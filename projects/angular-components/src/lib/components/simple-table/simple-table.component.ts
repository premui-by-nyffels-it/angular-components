import { Component, ElementRef, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash';
import { cloneDeep, sortBy } from 'lodash';
import { fromEvent } from 'rxjs';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { PremuiStyleService } from '../../services';
import { Icon, IconSettings } from '../icon/icon.component';

@Component({
  selector: 'premui-simple-table',
  templateUrl: './simple-table.component.html',
  styleUrls: ['./simple-table.component.scss'],
})
export class PremuiSimpleTable implements OnInit, OnChanges, OnDestroy {
	public icon: typeof Icon = Icon;

  protected _data!: any[];
  @Input('data') public set data(data: any[]) {
    this._data = data;
  }
  public get data(): any[] {
    return this._data;
  }

  protected _columns!: TableColumn[];
  @Input('columns') public set columns(columns: TableColumn[]) {
    this._columns = columns;
  }
  public get columns(): TableColumn[] {
    return this._columns;
  }

  protected _order!: OrderParameters;
  @Input('defaultOrder') public set order(order: OrderParameters) {
    this._order = order;
  }
  public get order(): OrderParameters {
    return this._order;
  }

  protected _paginator: boolean = true;
  @Input('enablePaginator') public set paginator(enablePaginator: boolean) {
    this._paginator = enablePaginator;
  }
  public get paginator(): boolean {
    return this._paginator;
  }

  protected _search: boolean = true;
  @Input('enableSearch') public set search(enableSearch: boolean) {
    this._search = enableSearch;
  }
  public get search(): boolean {
    return this._search;
  }

  protected _searchLabel: string = 'SEARCH';
  @Input('searchLabel') public set searchLabel(label: string) {
    this._searchLabel = label;
  }
  public get searchLabel(): string {
    return this._searchLabel;
  }

  protected _selection: boolean = true;
  @Input('enableSelection') public set selection(enableSelection: boolean) {
    this._selection = enableSelection;
  }
  public get selection(): boolean {
    return this._selection;
  }
  @Output('selectionChange') selectionChangedEmitter: EventEmitter<any[]> = new EventEmitter<any[]>();

  protected _clear: boolean = false;
  @Input('clearOption') public set clear(clearOptionEnabled: boolean) {
    this._clear = clearOptionEnabled;
  }
  public get clear(): boolean {
    return this._clear;
  }

  @Output('rowClick') onRowClickEmitter: EventEmitter<any> = new EventEmitter<any>();

  parameters: TableParameters = {
    order: { direction: DirectionEnum.ASC, keys: null },
    paginator: { page: null, size: null },
    search: [],
  };
  _amountOfPages: number = 1;
  get amountOfPages(): number[] {
    let pages: number[] = [];
    if (this._amountOfPages < 7) {
      for (let i = 1; i <= this._amountOfPages; i++) pages.push(i);
    } else {
      if (this.parameters.paginator.page && this.parameters.paginator.page < 3) {
        pages = [1, 2, 3, 4, 5];
      } else {
        pages = [1, 0];
      }

      if (this.parameters.paginator.page && this.parameters.paginator.page >= 3 && this.parameters.paginator.page <= this._amountOfPages - 2) {
        pages.push(this.parameters.paginator.page - 1);
        pages.push(this.parameters.paginator.page);
        pages.push(this.parameters.paginator.page + 1);
      }

      if (this.parameters.paginator.page && this.parameters.paginator.page > this._amountOfPages - 2) {
        pages = pages.concat([this._amountOfPages - 4, this._amountOfPages - 3, this._amountOfPages - 2, this._amountOfPages - 1, this._amountOfPages]);
      } else {
        pages = pages.concat([0, this._amountOfPages]);
      }
    }
    return pages;
  }

  protected _totalItems!: number;
	public get totalItems(): number {
		return this._totalItems;
	}
  protected _currentMinItem!: number;
	public get currentMinItem(): number {
		return this._currentMinItem;
	}
  protected _currentMaxItem!: number;
	public get currentMaxItem(): number {
		return this._currentMaxItem;
	}

  paginatedData: any[] = [];
  public selectedItems: any[] = [];

  protected selectAllItems: boolean = true;
  protected onDestroy: Subject<void> = new Subject();
  protected onSearchChange: Subject<{ column: TableColumn; value: string }> = new Subject();

  tableIconSettings: IconSettings = {
    margin: '0 0 0 5px',
    padding: '0',
    height: '8px',
  };

  constructor(protected ref: ElementRef, protected styleService: PremuiStyleService, protected cdr: ChangeDetectorRef) {
    this.styleService.applyStyle(this.ref);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data']?.firstChange && changes['data']?.currentValue) {
      this.loadData();
    }
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  ngOnInit(): void {
    if (!this.columns || this.columns.length <= 0) throw new Error('A table need to have columns defined! See documentation for more information!');
    this.loadParameters();

    let sortColumn = this.columns.find((column) => _.isEqual(column.keys, this.parameters.order.keys));
    if (sortColumn) {
      this.sort(sortColumn);
    } else {
      this.loadData();
    }

    fromEvent(document, 'keydown')
      .pipe(
				takeUntil(this.onDestroy),
      )
      .subscribe((ev) => {
				const keyevent = ev as KeyboardEvent;

				if (keyevent.ctrlKey && (keyevent.code === 'ArrowLeft' || keyevent.code === 'ArrowRight')) {
					keyevent.preventDefault();

					switch (keyevent.code) {
						case 'ArrowLeft':
							this.previousPage();
							break;
						case 'ArrowRight':
							this.nextPage();
							break;
					}
				}
      });

    this.onSearchChange.pipe(takeUntil(this.onDestroy), debounceTime(500)).subscribe(({ column, value }) => {
      /* Set value to empty of null */
      if (value === null) value = '';

      /* If value is empty, set value to null */
      if (value.trim() == '') {
        /* Remove search value from search parameters */
        let index: number = this.parameters.search.findIndex((x) => x.field == column.keys.join('%'));
        if (index != -1) this.parameters.search.splice(index, 1);
        /* Reload data */
        this.loadData();
      } else {
        /* If value is changed, set the value variable and emit it to the user */
        let index: number = this.parameters.search.findIndex((x) => _.isEqual(x.field.split('%'), column.keys));
        if (index != -1 && this.parameters.search[index].search.length == 1 && this.parameters.search[index].search[0] == value) return;

        /* Set search parameter */
        if (!value.includes('*')) {
          value = '%' + value.split('').join('%') + '%';
        } else {
          value = value.replace(/\*/g, '%');
        }

        let searchParameter: SearchParameters = {
          field: column.keys.join('%'),
          search: column.mutateSearch ? column.mutateSearch(value, column) : [value],
        };

        if (index >= 0) this.parameters.search.splice(index, 1);
        this.parameters.search.push(searchParameter);

        /* Reload data */
        this.loadData();
      }
    });
  }

  loadParameters(): void {
    this.parameters.paginator = {
      page: 1,
      size: 10,
    };

    if (this.order) {
      this.parameters.order = this.order;
    } else if (this.columns.length > 0) {
      this.parameters.order = {
        keys: this.columns[0].keys,
        direction: DirectionEnum.ASC,
      };
    }
  }

  loadData(): void {
    if (!this.data || this.data.length <= 0) {
      this.paginatedData = [];
      return;
    }

    this.paginatedData = cloneDeep(this.data);

    /* Sorting */
    this.paginatedData = sortBy(this.paginatedData, this.parameters.order.keys as string[]);
    if (this.parameters.order.direction === DirectionEnum.DESC) this.paginatedData = this.paginatedData.reverse();

    /* Search */
    if (this.parameters.search?.length > 0) {
      this.parameters.search.forEach((searchParam) => {
        let searchValues = searchParam.search[0].split('%').filter((value) => value.trim() != ''); // Todo make multiple possible for simple data

        this.paginatedData = this.paginatedData.filter((data) => {
          for (let value of searchValues) {
            if (
              !this.getValue(data, this.columns.find((column) => _.isEqual(column.keys, searchParam.field.split('%'))) as TableColumn)
                .toLowerCase()
                .includes(value.toLowerCase())
            )
              return false;
          }

          return true;
        });
      });
    }

    this._totalItems = this.paginatedData.length;
    if (this.paginator) {
      this.paginatedData = this.paginatedData.slice(
        (((this.parameters.paginator.page as number) - 1) * (this.parameters.paginator.size as number)),
        (this.parameters.paginator.page as number) * (this.parameters.paginator.size as number)
      );

      this._amountOfPages = Math.ceil(this._totalItems / (this.parameters.paginator.size as number));
      this._currentMinItem = ((this.parameters.paginator.page as number) - 1) * (this.parameters.paginator.size as number) + 1;
      this._currentMaxItem = Math.min((this.parameters.paginator.page as number) * (this.parameters.paginator.size as number), this._totalItems);
    } else {
      this._amountOfPages = 1;
      this._currentMinItem = 1;
      this._currentMaxItem = this.paginatedData.length;
    }

		this.cdr.detectChanges();
  }

  getValue(item: any, column: TableColumn): string {
    let originalItem: any = _.cloneDeep(item);
    for (let key of column.keys) if (item != null) item = item[key] != null ? item[key] : null;
    if (!column.mutateValue) {
      return item;
    } else {
      return column.mutateValue(item, originalItem);
    }
  }

  onClick(item: any): void {
    this.onRowClickEmitter.emit(item);
  }

  onClear(): void {
    this.onRowClickEmitter.emit(null);
  }

  selectRow(rowItem: any): void {
    this.selectAllItems = true; /* When clicked on a row it resets selectAll to select all items */
    (this.ref.nativeElement as HTMLElement).querySelectorAll('.checkAll').forEach((x) => ((x as HTMLInputElement).checked = false));

    /* Add or delete to/from selectedItems */
    let index: number = this.selectedItems.findIndex((item) => _.isEqual(item, rowItem));
    if (index < 0) this.selectedItems.push(rowItem);
    else this.selectedItems.splice(index, 1);

    /* Emit the selectedItems */
    this.selectionChangedEmitter.emit(this.selectedItems);
  }

  clearSelecion(): void {
    this.selectAllItems = true;
    this.selectedItems = [];
    (this.ref.nativeElement as HTMLElement).querySelectorAll('.checkAll').forEach((x) => ((x as HTMLInputElement).checked = false));
  }

  setPage(page: number): void {
    if (page <= 0) return;
    this.clearSelecion();

    this.parameters.paginator.page = page;
    this.loadData();
  }

  nextPage(): void {
    this.clearSelecion();

    if (this.parameters.paginator.page && this.parameters.paginator.page < this._amountOfPages) {
      this.parameters.paginator.page++;
      this.loadData();
    }
  }

  previousPage(): void {
    this.clearSelecion();

    if (this.parameters.paginator.page && this.parameters.paginator.page > 1) {
      this.parameters.paginator.page--;
      this.loadData();
    }
  }

  sort(column: TableColumn): void {
    if (column.keys && column.keys.length > 0 && !column.disableSort) {
      this.parameters.order.direction =
        this.parameters.order.keys === column.keys ? (this.parameters.order.direction == DirectionEnum.DESC ? DirectionEnum.ASC : DirectionEnum.DESC) : DirectionEnum.ASC;
      this.parameters.order.keys = column.keys;

      this.loadData();
    }
  }

  onSearch(column: TableColumn, value: string): void {
    this.onSearchChange.next({ column: column, value: value });
  }

  selectAll() {
    /* Set checkboxes to checked/unchecked */
    (this.ref.nativeElement as HTMLElement).querySelectorAll('.rowSelect').forEach((x) => ((x as HTMLInputElement).checked = this.selectAllItems));

    /* Set selecteditems correct */
    this.selectedItems = [];
    if (this.selectAllItems) {
      for (let item of this.paginatedData) this.selectedItems.push(item);
      this.selectAllItems = false;
    } else {
      this.selectAllItems = true;
    }

    /* Emit the selectedItems */
    this.selectionChangedEmitter.emit(this.selectedItems);
  }

  public clearFilter(): void {
    /* Remove search */
    this.parameters.search = [];

    /* Set all html inputs to empty */
    (this.ref.nativeElement as HTMLElement).querySelectorAll('input').forEach((x) => (x.value = ''));

    /* Reload data */
    this.loadData();
  }

  public async refresh(): Promise<void> {
    await this.loadData();
  }
}

export interface TableColumn {
  /**
   * @description The name of this column, this will be displayed in the header.
   */
  name: string;
  /**
   * @description Navigate through the data with the given keys.
   */
  keys: string[];

  /**
   * @description Set the width of the column.
   * @example width = '100px';
   */
  width?: string;

  /**
   * @description Disable/enable the search option
   */
  disableSearch?: boolean;

  /**
   * @description Disable/enable the sort option
   */
  disableSort?: boolean;

  /**
   * @description Mutate the value and return the string.
   */
  mutateValue?: (value: any, parent?: any) => string;

  /**
   * @description Set the color of the text in this row
   */
  color?: (value: any, parent?: any) => RowColor;

  /**
   * @description Mutate the search value before search
   */
  mutateSearch?: (value: any, parent?: any) => string[];
}

export interface OrderParameters {
  keys: string[] | null;
  direction: DirectionEnum;
}

export enum DirectionEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface TableParameters {
  paginator: PagintorParameters;
  order: OrderParameters;
  search: SearchParameters[];
}

export interface PagintorParameters {
  page: number | null;
  size: number | null;
}

export interface SearchParameters {
  field: string;
  search: string[];
}

export type RowColor = 'valid' | 'invalid' | 'warning';
