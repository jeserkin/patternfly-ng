import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';

import { clone, cloneDeep, defaults, isEqual } from 'lodash';

import { Filter } from './filter';
import { FilterConfig } from './filter-config';
import { FilterEvent } from './filter-event';

/**
 * Component for the filter results
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'pfng-filter-results',
  styleUrls: ['./filter-results.component.less'],
  templateUrl: './filter-results.component.html'
})
export class FilterResultsComponent implements DoCheck, OnInit {
  /**
   * The filter config containing component properties
   */
  @Input() config: FilterConfig;

  /**
   * The event emitted when the clear action is selected
   */
  @Output('onClear') onClear = new EventEmitter();

  /**
   * The event emitted when the save action is selected
   */
  @Output('onSave') onSave = new EventEmitter();

  private defaultConfig = {} as FilterConfig;
  private prevConfig: FilterConfig;
  private saveFilterName: string;

  /**
   * The default constructor
   */
  constructor() {
  }

  // Initialization

  /**
   * Setup component configuration upon initialization
   */
  ngOnInit(): void {
    this.setupConfig();
  }

  /**
   * Check if the component config has changed
   */
  ngDoCheck(): void {
    // Do a deep compare on config
    if (!isEqual(this.config, this.prevConfig)) {
      this.setupConfig();
    }
  }

  /**
   * Set up default config
   */
  protected setupConfig(): void {
    if (this.config !== undefined) {
      defaults(this.config, this.defaultConfig);
    } else {
      this.config = cloneDeep(this.defaultConfig);
    }

    if (this.config && this.config.appliedFilters === undefined) {
      this.config.appliedFilters = [];
    }
    if (this.config && this.config.resultsCount === undefined) {
      this.config.resultsCount = 0;
    }
    if (this.config && this.config.selectedCount === undefined) {
      this.config.selectedCount = 0;
    }
    if (this.config && this.config.totalCount === undefined) {
      this.config.totalCount = 0;
    }
    this.prevConfig = cloneDeep(this.config);
  }

  // Private

  private clearFilter(filter: Filter): void {
    let newFilters: Filter[] = [];
    this.config.appliedFilters.forEach((appliedFilter) => {
      if (appliedFilter.field.title !== filter.field.title
          || appliedFilter.value !== filter.value) {
        newFilters.push(appliedFilter);
      }
    });
    this.config.appliedFilters = newFilters;
    this.onClear.emit(this.config.appliedFilters);
  }

  private clearAllFilters(): void {
    this.config.appliedFilters = [];
    this.onClear.emit(this.config.appliedFilters);
  }

  private saveAllFilters(): void {
    this.onSave.emit({
      appliedFilters: this.config.appliedFilters,
      value: clone(this.saveFilterName)
    } as FilterEvent);
    this.saveFilterName = ''; // Reset
  }
}
