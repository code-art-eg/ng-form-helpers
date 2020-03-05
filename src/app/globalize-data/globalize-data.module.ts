import { NgModule } from '@angular/core';

import 'globalize/number';
import 'globalize/currency';
import 'globalize/date';
import 'globalize/plural';
import Globalize from 'globalize';

import likelySubtags from 'cldr-data/supplemental/likelySubtags.json';
import numberingSystems from 'cldr-data/supplemental/numberingSystems.json';

import currencyData from 'cldr-data/supplemental/currencyData.json';

import plurals from 'cldr-data/supplemental/plurals.json';

import metaZones from 'cldr-data/supplemental/metaZones.json';
import timeData from 'cldr-data/supplemental/timeData.json';
import weekData from 'cldr-data/supplemental/weekData.json';


/*
 * Module to add support for globalize
 */
@NgModule()
export class GlobalizeDataModule {
  constructor() {
    Globalize.load(likelySubtags);
    Globalize.load(numberingSystems);

    Globalize.load(currencyData);

    Globalize.load(plurals);

    Globalize.load(metaZones);
    Globalize.load(timeData);
    Globalize.load(weekData);

  }
}
