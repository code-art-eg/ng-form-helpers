import { Observable, of } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { sentenceCase } from 'change-case';

import { ValidationMessagesInjectionToken } from './validation-messages';
import { FormValidationContext } from '../form-models';


export interface ITranslationService {
  getMessageString(lang: string | null | undefined, key: string, context: string | undefined): Observable<string>;
}

export const TranslationServiceInjectionToken = new InjectionToken<ITranslationService>('ITranslationService');

@Injectable({
  providedIn: 'root',
})
export class DefaultTranslationService implements ITranslationService {
  private readonly _validationMessages: Record<string, Observable<string>>;
  private readonly _messageCache: Record<string, Observable<string>> = {};

  constructor(
    @Optional() @Inject(ValidationMessagesInjectionToken) validationMessages?: Array<Record<string, string>>,
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
