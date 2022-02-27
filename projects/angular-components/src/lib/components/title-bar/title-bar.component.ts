import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, Input, ElementRef, ViewChild, Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { PremuiStyleService } from '../../services';

@Injectable({
  providedIn: 'root',
})
export class PremuiTitleBarService {
  public static instances: { name: string; titleBar: PremuiTitleBarService }[] = [];

  public static init(name: string): PremuiTitleBarService {
    let instance = this.instances.find((instance) => instance.name == name.toLowerCase());
    if (!instance) {
      let titleBarService = new PremuiTitleBarService();
      this.instances.push({ name: name.toLowerCase(), titleBar: titleBarService });
      return titleBarService;
    } else {
      return instance.titleBar;
    }
  }

  public static get(name: string): PremuiTitleBarService | null {
    let instance = this.instances.find((instance) => instance.name == name.toLowerCase());
    return instance ? instance.titleBar : null;
  }

  public static destroy(name: string): void {
    this.instances = this.instances.filter((instance) => instance.name != name.toLowerCase());
  }

  private _appname: Subject<string> = new Subject();
  set appname(name: string) {
    this._appname.next(name);
  }
  get appname$(): Observable<string> {
    return this._appname;
  }

  private _breadcrumbs: Subject<Breadcrumb[]> = new Subject();
  set breadcrumbs(breadcrumbs: Breadcrumb[]) {
    this._breadcrumbs.next(breadcrumbs);
  }
  get breadcrumbs$(): Observable<Breadcrumb[]> {
    return this._breadcrumbs;
  }

  private _enabled$: Subject<boolean> = new Subject();
  public _enabled!: boolean;
  get enabled(): boolean {
    return this._enabled;
  }
  set enabled(enabled: boolean) {
    this._enabled$.next(enabled);
    this._enabled = enabled;
  }
  get enabled$(): Observable<boolean> {
    return this._enabled$;
  }
}

@Component({
  selector: 'premui-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.scss'],
})
export class PremuiTitleBar implements OnInit, OnDestroy, OnChanges {
  @ViewChild('breadcrumbsContextMenu') breadcrumbsContextMenu!: ElementRef;
  @ViewChild('outClick') outClick!: ElementRef;

  private _instanceName: string = 'default';
  @Input('name') public set instanceName(name: string) {
    this._instanceName = name;
  }
  public get instanceName(): string {
    return this._instanceName;
  }

  private _title!: string;
  @Input('title') public set title(title: string) {
    this._title = title;
  }
  public get title(): string {
    return this._title;
  }

  public breadcrumbs: Breadcrumb[] = [];

  private titleBarService!: PremuiTitleBarService;
  private onDestroy: Subject<void> = new Subject();

  menuCrumbOptions: Breadcrumb[] = [];

  constructor(private ref: ElementRef, private styleService: PremuiStyleService, private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['instanceName'] && !changes['instanceName'].firstChange) {
      PremuiTitleBarService.destroy(changes['instanceName'].previousValue);
      PremuiTitleBarService.init(changes['instanceName'].currentValue);
    }
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
    PremuiTitleBarService.destroy(this.instanceName);
  }

  ngOnInit(): void {
    this.styleService.applyStyle(this.ref);
    this.titleBarService = PremuiTitleBarService.init(this.instanceName);

    this.titleBarService.appname$.subscribe((appName) => {
      this.title = appName;
    });
    this.titleBarService.breadcrumbs$.subscribe((breadcrumbs) => {
      this.breadcrumbs = breadcrumbs;
    });
  }

  openRoute(crumb: Breadcrumb): void {
    if (crumb.route && crumb.route.length > 0) this.router.navigate(crumb.route, crumb.routeSettings);

    this.clickOnOutClick();
  }

  openBreadCrumbMenu(event: MouseEvent, crumb: Breadcrumb): void {
    if (crumb.route || crumb.options) event.preventDefault();
    if (crumb.options && crumb.options.length > 0) {
      this.menuCrumbOptions = crumb.options;

      this.breadcrumbsContextMenu.nativeElement.style.top = `${event.clientY}px`;
      this.breadcrumbsContextMenu.nativeElement.style.left = `${event.clientX}px`;
      this.breadcrumbsContextMenu.nativeElement.classList.add('show');

      this.outClick.nativeElement.style.display = 'block';
    }
  }

  clickOnOutClick(): void {
    this.breadcrumbsContextMenu.nativeElement.classList.remove('show');
    this.outClick.nativeElement.style.display = 'none';

    this.menuCrumbOptions = [];
  }

  goToHome(): void {
    this.router.navigate(['']);
  }
}

export interface Breadcrumb {
  label: string;
  route?: string[];
  routeSettings?: NavigationExtras;
  options?: Breadcrumb[];
}
