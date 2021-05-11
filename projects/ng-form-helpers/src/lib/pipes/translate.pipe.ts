import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Inject, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { ITranslationService } from '../../../../../dist/ng-form-helpers/lib';
import { TranslationServiceInjectionToken } from '../services/translation.service';

@Pipe({
  pure: false,
  name: 'frmTranslate',
})
export class TranslatePipe implements PipeTransform, OnDestroy {

  private readonly _asyncPipe: AsyncPipe;
  constructor(
    @Inject(TranslationServiceInjectionToken) private readonly _translationService: ITranslationService,
    cd: ChangeDetectorRef,
  ) {
    this._asyncPipe = new AsyncPipe(cd);
  }

  public transform(value: string, context?: string, lang?: string): string | null;
  public transform(value: any, ...args: any[]): string | null {
    return this._asyncPipe.transform(
      this._translationService.getMessageString(args[1] as string, value as string, args[0] as string)
    );
  }

  public ngOnDestroy() {
    this._asyncPipe.ngOnDestroy();
  }
}

