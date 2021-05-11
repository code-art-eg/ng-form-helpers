import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Inject, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { FormFieldContext } from '../form-models';
import { ITranslationService, TranslationServiceInjectionToken } from '../services/translation.service';

@Pipe({
  pure: false,
  name: 'frmField',
})
export class FormFieldPipe implements PipeTransform, OnDestroy {

  private readonly _asyncPipe: AsyncPipe;
  constructor(
    @Inject(TranslationServiceInjectionToken) private readonly _translationService: ITranslationService,
    cd: ChangeDetectorRef,
  ) {
    this._asyncPipe = new AsyncPipe(cd);
  }

  public transform(value: string, lang?: string): string | null;
  public transform(value: any, ...args: any[]): string | null {
    return this._asyncPipe.transform(
      this._translationService.getMessageString(args[0] as string, value as string, FormFieldContext)
    );
  }

  public ngOnDestroy() {
    this._asyncPipe.ngOnDestroy();
  }
}
