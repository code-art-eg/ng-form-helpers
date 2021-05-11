import { Observable, of } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { sentenceCase } from 'change-case';

import { MessagesInjectionToken } from './validation-messages';
import { MessageCollection, NoContext } from '../form-models';
import { CANG_SUPPORTED_CULTURES, CurrentCultureService } from '@code-art-eg/angular-globalize';
import { map } from 'rxjs/operators';


export interface ITranslationService {
  getMessageString(lang: string | null | undefined, key: string, context: string | undefined): Observable<string>;
}

export const TranslationServiceInjectionToken = new InjectionToken<ITranslationService>('ITranslationService');


@Injectable({
  providedIn: 'root',
})
export class DefaultTranslationService implements ITranslationService {
  private readonly _messages: Record<string, string>;
  private readonly _messagesCache: Record<string, Observable<string>> = {};
  private readonly _cultures: string[];

  constructor(
    private readonly _currentCultureService: CurrentCultureService,
    @Inject(CANG_SUPPORTED_CULTURES) private readonly cultures: string[],
    @Optional() @Inject(MessagesInjectionToken) messages?: Array<MessageCollection>,
  ) {
    this._cultures = cultures.map(c => _currentCultureService.getSupportedCulture(c));
    this._messages = {};
    if (messages) {
      for (const collection of messages) {
        const lang = _currentCultureService.getSupportedCulture(collection.lang);
        const context = collection.context || NoContext;
        for (const key in collection.messages) {
          if (collection.messages.hasOwnProperty(key)) {
            const lookupKey = `${lang}/${context}/${key}`;
            this._messages[lookupKey] = collection.messages[key];
          }
        }
      }
    }
  }

  public getMessageString(lang: string | null | undefined, key: string, context: string | undefined): Observable<string> {
    const lookupKey = `${lang || ''}/${context || NoContext}/${key}`;
    if (!this._messagesCache[lookupKey]) {
      if (lang) {
        this._messagesCache[lookupKey] = of(this.getMessageInternalString(lang, key, context));
      } else {
        this._messagesCache[lookupKey] = this._currentCultureService.cultureObservable.pipe(
          map((l) => this.getMessageInternalString(l, key, context)),
        );
      }
    }
    return this._messagesCache[lookupKey];
  }

  private getMessageInternalString(lang: string, key: string, context: string | undefined): string {
    lang = this._currentCultureService.getSupportedCulture(lang);
    context = context || NoContext;
    const lookupKey = `${lang}/${context}/${key}`;
    const msg = this._messages[lookupKey];
    if (msg){
      return msg;
    };
    if (lang === this._cultures[0]) {
      return sentenceCase(key);
    }
    return this.getMessageInternalString(this._cultures[0], key, context);
  }
}
