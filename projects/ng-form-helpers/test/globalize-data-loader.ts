import * as Globalize from 'globalize';

import likelySubtags from 'cldr-data/supplemental/likelySubtags.json';
import numberingSystems from 'cldr-data/supplemental/numberingSystems.json';

import numbersDe from 'cldr-data/main/de/numbers.json';
import numbersEn from 'cldr-data/main/en-GB/numbers.json';
import numbersAr from 'cldr-data/main/ar-EG/numbers.json';

export function loadGlobalizeData() {

    Globalize.load(likelySubtags);
    Globalize.load(numberingSystems);

    Globalize.load(numbersDe);

    Globalize.load(numbersEn);

    Globalize.load(numbersAr);
}
