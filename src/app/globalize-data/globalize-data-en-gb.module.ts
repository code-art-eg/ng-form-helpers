import { NgModule } from '@angular/core';

import Globalize from 'globalize';
import numbers from 'cldr-data/main/en-GB/numbers.json';

import calendar from 'cldr-data/main/en-GB/ca-gregorian.json';
import timeZones from 'cldr-data/main/en-GB/timeZoneNames.json';

import currency from 'cldr-data/main/en-GB/currencies.json';

/*
 * Module to add support for the en-GB culture
 */
@NgModule()
export class GlobalizeDataEnGBModule {
  constructor() {
    Globalize.load(numbers);

    Globalize.load(currency);

    Globalize.load(calendar);
    Globalize.load(timeZones);
  }
}
