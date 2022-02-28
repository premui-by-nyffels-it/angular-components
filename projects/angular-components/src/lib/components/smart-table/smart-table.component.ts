import { Component, ElementRef, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { DirectionEnum, PremuiSimpleTable, SearchParameters, TableColumn } from '..';
import { PremuiStyleService } from '../../services';

@Component({
  selector: 'premui-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss'],
})
export class PremuiSmartTable extends PremuiSimpleTable {
  protected _dataFunction: any;
  @Input('function') public set dataFunction(datafunction: any) {
    this._dataFunction = this.dataFunction;
  }
  public get dataFunction(): any {
    return this._dataFunction;
  }

  protected _variables: QueryVariable[] = [];
  @Input('variables') public set variables(variables: QueryVariable[]) {
    this._variables = variables;
  }
  public get variables(): QueryVariable[] {
    return this._variables;
  }
  _showAsBooleanVariables: QueryVariable[] = []; // TODO
  @Output('variablesChange') variablesChangedEmitter: EventEmitter<QueryVariable[]> = new EventEmitter<QueryVariable[]>();

  protected override _columns!: SmartTableColumn[];
  @Input('columns') public override set columns(columns: SmartTableColumn[]) {
    this._columns = columns;
  }
  public override get columns(): SmartTableColumn[] {
    return this._columns;
  }

	protected override onSearchChange: Subject<{ column: SmartTableColumn; value: string }> = new Subject();

  constructor(protected override ref: ElementRef, protected override styleService: PremuiStyleService) {
    super(ref, styleService);
  }

  override ngOnChanges(changes: SimpleChanges): void {
    if (!changes['dataFunction']?.firstChange && !_.isEqual(changes['dataFunction']?.currentValue, changes['dataFunction']?.previousValue)) {
      this.loadData();
    }

    if (changes['variables']) {
      this._showAsBooleanVariables = this.variables.filter((x) => x.displayAsBoolean === true);
    }
  }

  override ngOnInit(): void {
    if (!this.columns || this.columns.length <= 0) throw new Error('A table need to have columns defined! See documentation for more information!');

    /* Set basic parameters */
    this.parameters.paginator = {
      page: 1,
      size: 10,
    };

    if (this.order) {
      this.parameters.order = this.order;
    } else if (this.columns.length > 0) {
      this.parameters.order = {
        keys: [this.columns[0].header ? this.columns[0].header : ''],
        direction: DirectionEnum.ASC,
      };
    }

    this.loadData();

    fromEvent(document, 'keydown')
      .pipe(takeUntil(this.onDestroy))
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

    this.onSearchChange.pipe(takeUntil(this.onDestroy), debounceTime(1000)).subscribe(({ column, value }) => {
      /* Set value to empty of null */
      if (value === null) value = '';

      /* If value is empty, set value to null */
      if (value.trim() == '') {
        /* Remove search value from search parameters */
        let index: number = this.parameters.search.findIndex((x) => x.field == column.header);
        if (index != -1) this.parameters.search.splice(index, 1);
        /* Reload data */
        this.loadData();
      } else {
        /* If value is changed, set the value variable and emit it to the user */
        let index: number = this.parameters.search.findIndex((x) => x.field == column.header);
        if (index != -1 && this.parameters.search[index].search.length == 1 && this.parameters.search[index].search[0] == value) return;

        /* Set search parameter */
        if (!value.includes('*')) {
          value = '%' + value.split('').join('%') + '%';
        } else {
          value = value.replace(/\*/g, '%');
        }

        let searchParameter: SearchParameters = {
          field: column.header as string,
          search: column.mutateSearch ? column.mutateSearch(value, column) : [value],
        };

        if (index >= 0) this.parameters.search.splice(index, 1);
        this.parameters.search.push(searchParameter);

        /* Reload data */
        this.loadData();
      }
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  override loadData(): void {
    /* Remove selected items */
    this.selectedItems = [];

    if (!this.dataFunction) {
      this.data = [];
      return;
    }

    /* Get data, if invalid or empty set data to empty array */
    this.dataFunction(this.parameters, this.variables)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((object: ListReturnObject<any>) => {
        /* Set paginator settings */
        this._amountOfPages = object.paginator.pages <= 0 ? 1 : object.paginator.pages;
        this._totalItems = object.paginator.items;
        this._currentMinItem = ((this.parameters.paginator.page as number) - 1) * (this.parameters.paginator.size as number) + 1;
        this._currentMaxItem = Math.min((this.parameters.paginator.page as number) * (this.parameters.paginator.size as number), this.totalItems);

        /* Set data, check for changes */
        this.data = object.data;
      });
  }

  override sort(column: SmartTableColumn): void {
    if (column.header && column.header?.trim() != '' && !column.disableSort) {
      this.parameters.order.direction =
        this.parameters.order.keys && this.parameters.order.keys[0] === column.header
          ? this.parameters.order.direction == DirectionEnum.DESC
            ? DirectionEnum.ASC
            : DirectionEnum.DESC
          : DirectionEnum.ASC;
      this.parameters.order.keys = [column.header];
      this.loadData();
    }
  }

  onVariableChange(variable: QueryVariable, checked: boolean): void {
    (this.variables.find((x) => _.isEqual(x, variable)) as QueryVariable).value = checked;
    this.variablesChangedEmitter.emit(this.variables);
    this.refresh();
  }
}

export interface SmartTableColumn extends TableColumn {
  /**
   * @description A header used in the backend. See the documentation for more information on !!todo add link to documentation!!
   */
  header?: string;
}

export interface DataColumnOption {
  label: string;
  value: any;
}

export interface QueryVariable {
  key: string;
  value: any;
  displayAsBoolean?: boolean;
  checkedLabel?: string;
  uncheckedLabel?: string;
}

export interface ListReturnObject<T> {
  data: T[];
  paginator: ReturnPaginator;
}

export interface ReturnPaginator {
  pages: number;
  items: number;
}
