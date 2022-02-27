import { Component, ElementRef, Injectable, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import _ from 'lodash';
import { PremuiStyleService } from 'dist/angular-components/public-api';

@Injectable({
  providedIn: 'root',
})
export class PremuiSideMenuService implements OnDestroy {
  public static instances: { name: string; titleBar: PremuiSideMenuService }[] = [];
  public static init(name: string): PremuiSideMenuService {
    let instance = this.instances.find((instance) => instance.name == name.toLowerCase());
    if (!instance) {
      let PremuiTitleBarService = new PremuiSideMenuService();
      this.instances.push({ name: name.toLowerCase(), titleBar: PremuiTitleBarService });
      return PremuiTitleBarService;
    } else {
      return instance.titleBar;
    }
  }
  public static menuData: { name: string; data: MenuItem[] }[] = [];

  public static fetchData(name: string): void {
    name = name.toLowerCase();
    let instance = this.instances.find((instance) => instance.name == name);

    if (!instance) {
      throw new Error(`Instance ${name} not found!`);
    } else {
      const data = this.menuData.find((x) => x.name == name);

      if (!data) {
        throw new Error(`Menu data for instance ${name} not found`);
      } else {
        instance.titleBar.data = data.data;
      }
    }
  }

  public static get(name: string): PremuiSideMenuService | null {
    let instance = this.instances.find((instance) => instance.name == name.toLowerCase());
    return instance ? instance.titleBar : null;
  }

  public static destroy(name: string): void {
    this.instances = this.instances.filter((instance) => instance.name != name.toLowerCase());
  }

  private onDestroy: Subject<void> = new Subject();

  constructor() {}

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  private _enabled$: Subject<boolean> = new Subject();
  private _enabled!: boolean;
  get enabled(): boolean {
    return this._enabled;
  }
  set enabled(status: boolean) {
    this._enabled$.next(status);
    this._enabled = status;
  }
  get enabled$(): Observable<boolean> {
    return this._enabled$;
  }

  private _data: Subject<MenuItem[]> = new Subject();
  private _menu!: MenuItem[];
  set data(data: MenuItem[]) {
    this._data.next(data);
    this._menu = _.cloneDeep(data);
  }
  get data$(): Observable<MenuItem[]> {
    return this._data;
  }
  reEvaluateMenu(): void {
    this.data = this._menu;
  }
}

@Component({
  selector: 'premui-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class PremuiSideMenu implements OnInit, OnDestroy {
  @ViewChild('menu') menu!: ElementRef;

  private _instanceName: string = 'default';
  @Input('name') public set instanceName(name: string) {
    this._instanceName = name;
  }
  public get instanceName(): string {
    return this._instanceName;
  }

  /**
   * @description The label for the menu, attention if you use translationSensitive you need to send the translationlabel.
   */
  private _menuLabel: string = 'MENU';
  @Input('menuLabel') public set menuLabel(label: string) {
    this._menuLabel = label;
  }
  public get menuLabel(): string {
    return this._menuLabel;
  }

  private _offset: string = '0px';
  @Input('offset') public set offset(offset: string) {
    this._offset = offset;
  }
  public get offset(): string {
    return this._offset;
  }

  private _hoverDelay: string = '250ms';
  @Input('hoverDelay') public set hoverDelay(delay: string) {
    this._hoverDelay = delay;
  }
  public get hoverDelay(): string {
    return this._hoverDelay;
  }

  items: MenuItem[] = [];

  menuService!: PremuiSideMenuService;
  onDestroy: Subject<void> = new Subject();

  constructor(private ref: ElementRef, private styleService: PremuiStyleService, private router: Router) {
    this.styleService.applyStyle(this.ref);

    this.ref.nativeElement.style.setProperty('--menuWidth', '0px');
  }

  ngOnInit(): void {
    this.menuService = PremuiSideMenuService.init(this.instanceName);

    this.menuService.enabled$.pipe(takeUntil(this.onDestroy)).subscribe((enabled) => {
      /* Enable logic */
      enabled ? this.ref.nativeElement.style.setProperty('--menuIndicatorWidth', '20px') : this.ref.nativeElement.style.setProperty('--menuIndicatorWidth', '0px');
      enabled ? (this.menu.nativeElement.style.display = 'block') : (this.menu.nativeElement.style.display = 'none');

      this.menuService.reEvaluateMenu();
    });

    this.menuService.data$.pipe(takeUntil(this.onDestroy)).subscribe({
      next: (data) => {
        this.items = this.filterDataForVisibility(data).filter((x) => x.showWithoutChildren || (x.children && x.children.length > 0));
      },
      error: (err) => {
        console.error(err);
      },
    });

    PremuiSideMenuService.fetchData(this.instanceName);
  }

  private filterDataForVisibility(items: MenuItem[]): MenuItem[] {
    items = items.filter((data) => (data.visible ? data.visible(data) : true));

    for (let item of items) {
      if (item.children && item.children.length > 0) {
        item.children = this.filterDataForVisibility(item.children);
      }
    }

    return items;
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  onItemClick(item: MenuItem): void {
    if (item.onClick) {
      item.onClick();
    }

    if (item.route && item.route.length > 0) {
      this.router.navigate(item.route);
    }
  }

  onContextClick(event: MouseEvent, item: MenuItem): void {
    if (item.onContextClick || item.contextRoute) {
      event.preventDefault();

      if (item.onContextClick) {
        item.onContextClick();
      }

      if (item.contextRoute && item.contextRoute.length > 0) {
        this.router.navigate(item.contextRoute);
      }
    }
  }
}

export interface MenuItem {
  label: string;
  route?: string[];
  contextRoute?: string[];
  showWithoutChildren?: boolean;
  children?: MenuItem[];
  open?: boolean;
  onClick?(): void;
  onContextClick?(): void;
  visible?(item: MenuItem): boolean;
}
