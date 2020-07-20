import { Observable, of } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { sentenceCase } from 'change-case';
import { Dictionary } from '@code-art-eg/angular-globalize/lib/models';

import { ValidationMessagesInjectionToken } from './validation-messages';
import { FormValidationContext, StringDictionary } from '../form-models';


export interface ITranslationService {
  getMessageString(lang: string | null | undefined, key: string, context: string | undefined): Observable<string>;
}

export const TranslationServiceInjectionToken = new InjectionToken<ITranslationService>('ITranslationService');

@Injectable({
  providedIn: 'root',
})
export class DefaultTranslationService implements ITranslationService {
  private readonly _validationMessages: Dictionary<Observable<string>>;
  private readonly _messageCache: Dictionary<Observable<string>> = {};

  constructor(
    @Optional() @Inject(ValidationMessagesInjectionToken) validationMessages?: StringDictionary[],
  ) {
    this._validationMessages = {};
    if (validationMessages) {
      for (const dict of validationMessages) {
        for (const key in dict) {
          if (dict.hasOwnProperty(key)) {
            this._validationMessages[key] = of(dict[key]);
          }
        }
      }
    }
  }

  public getMessageString(_lang: string | null | undefined, key: string, context: string | undefined): Observable<string> {
    if (context === FormValidationContext) {
      const res = this._validationMessages[key];
      if (res) {
        return res;
      }
    }
    return this._messageCache[key] || (this._messageCache[key] = of(sentenceCase(key)));
  }
}
