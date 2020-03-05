import { NgModule } from '@angular/core';

import Globalize from 'globalize';
import numbers from 'cldr-data/main/de/numbers.json';

import calendar from 'cldr-data/main/de/ca-gregorian.json';
import timeZones from 'cldr-data/main/de/timeZoneNames.json';

import currency from 'cldr-data/main/de/currencies.json';

/*
 * Module to add support for the de culture
 */
@NgModule()
export class GlobalizeDataDeModule {
  constructor() {
    Globalize.load(numbers);

    Globalize.load(currency);

    Globalize.load(calendar);
    Globalize.load(timeZones);
  }
}
