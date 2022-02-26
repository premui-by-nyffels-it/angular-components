import { Component, ElementRef, ChangeDetectorRef, AfterViewInit, OnChanges, SimpleChanges, ContentChildren, QueryList, Output, EventEmitter, Input, OnInit, OnDestroy, Host } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import _ from 'lodash';
import { PremuiStyleService } from '../../services';

@Component({
  selector: 'premui-tab-item',
  templateUrl: './tab-item.component.html',
  styleUrls: ['./tab-item.component.scss'],
})
export class PremuiTabItem implements OnChanges, OnInit, OnDestroy, AfterViewInit {
  private _id: string = '' + Math.random();
  @Input('id') public set id(id: string) {
    this._id = id ? id : '' + Math.random();
  }
  public get id(): string {
    return this._id;
  }

  private _label: string = '';
  @Input('label') public set label(label: string) {
    this._label = label;
  }
  public get label(): string {
    return this._label;
  }

  private _hidden: boolean = false;
  @Input('hidden') public set hidden(isHidden: boolean) {
    this._hidden = isHidden;
  }
  public get hidden(): boolean {
    return this._hidden;
  }

  parent: PremuiTabs;
  _selected: boolean = false;
  selected: Subject<boolean> = new Subject();

  onDestroy: Subject<void> = new Subject();

  constructor(@Host() parent: PremuiTabs, private ref: ElementRef, private styleService: PremuiStyleService) {
    this.styleService.applyStyle(this.ref);
    this.parent = parent;
  }

  ngAfterViewInit(): void {
    this.reloadParent();
  }

  ngOnInit(): void {
    if (!this.label) throw new Error(`Label was not provided for tab-item with ID ${this.id}`);

    this.selected.pipe(takeUntil(this.onDestroy)).subscribe((selected) => {
      this._selected = selected;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && !changes['id'].firstChange && changes['id'].currentValue != changes['id'].previousValue) {
      this.reloadParent();
    }
    if (changes['label'] && !changes['label'].firstChange && changes['label'].currentValue != changes['label'].previousValue) {
      this.reloadParent();
    }
    if (changes['hidden'] && !changes['hidden'].firstChange && changes['hidden'].currentValue != changes['hidden'].previousValue) {
      this.reloadParent();
    }
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.reloadParent();
    });
  }

  private reloadParent(): void {
    if (this.parent.initCompleted) {
      this.parent.loadData();
    }
  }
}

@Component({
  selector: 'premui-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class PremuiTabs implements OnChanges, AfterViewInit {
  @ContentChildren(PremuiTabItem) tabItems!: QueryList<PremuiTabItem>;

  private _tabsAmount!: number;
  @Input('tabsAmount') public set tabsAmount(tabsAmount: number) {
    this._tabsAmount = tabsAmount;
  }
  public get tabsAmount(): number {
    return this._tabsAmount;
  }

  private _selectedTabId!: string;
  @Input('selectedTab') public set selectedTabId(id: string) {
    this._selectedTabId = id;
  }
  public get selectedTab(): string {
    return this._selectedTabId;
  }
  @Output('selectedTabChange') selectedTabEmitter: EventEmitter<string> = new EventEmitter();

  @Output('onTabChange') onTabChangeEmitter: EventEmitter<TabChangeEvent> = new EventEmitter();

  private _templateColumns: string = '';
  get templateColumns(): string {
    return this._templateColumns;
  }

  private _height: string = '300px';
  @Input('minContentHeight') public set height(height: string) {
    this._height = height ? height : '300px';
  }
  public get height(): string {
    return this._height;
  }

  private _padding: string = '20px';
  @Input('contentPadding') public set padding(padding: string) {
    this._padding = padding ? padding : '20px';
  }
  public get padding(): string {
    return this._padding;
  }

  initCompleted: boolean = false;

  constructor(private ref: ElementRef, private styleService: PremuiStyleService) {
    this.styleService.applyStyle(this.ref);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tabsAmount'] && !changes['tabsAmount']?.firstChange && changes['tabsAmount']?.currentValue != changes['tabsAmount']?.previousValue) {
      this.loadData();
    }
  }

  ngAfterViewInit(): void {
    this.loadData();
    this.initCompleted = true;
  }

  loadData(): void {
    this.tabItems = this.tabItems.filter((x) => !x.hidden) as any;
    if (this.tabItems == null || this.tabItems.length <= 0) throw new Error('No enabled items found for tabs component!');

    /* set content and selectedTabId */
    if (!this._selectedTabId || !this.tabItems.find((item) => item.id == this._selectedTabId)) this._selectedTabId = this.tabItems.first?.id;
    this.tabItems.forEach((item) => item.selected.next(item.id == this._selectedTabId));

    /* set the tabs */
    let gridTemplateColumns: string[] = [];
    if (this.tabsAmount > 0) {
      for (let i = 0; i < this.tabsAmount; i++) gridTemplateColumns.push(`${100 / this.tabsAmount}%`);
    } else {
      let itemCount: number = this.tabItems.length;
      for (let i = 0; i < itemCount; i++) gridTemplateColumns.push(`${100 / itemCount}%`);
    }
    this._templateColumns = gridTemplateColumns.join(' ');
  }

  onTabClick(id: string): void {
    if (this._selectedTabId != id) {
      let returnValue: TabChangeEvent = { previous: _.cloneDeep(this._selectedTabId), current: _.cloneDeep(id) };

      this.selectedTabEmitter.emit(id);
      this.onTabChangeEmitter.emit(returnValue);

      this._selectedTabId = id;

      this.loadData();
    }
  }
}

export interface Tab {
  id: string;
  item: PremuiTabItem;
}

export interface TabChangeEvent {
  previous: string;
  current: string;
}
