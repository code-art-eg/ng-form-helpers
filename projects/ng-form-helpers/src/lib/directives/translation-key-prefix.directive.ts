import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[frmTrnKeyPrefix]',
})
export class TranslationKeyPrefixDirective {
  @Input() frmTrnKeyPrefix?: string;
}
