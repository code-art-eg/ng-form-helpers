import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ToNullDirective } from './directives/to-null.directive';
import { ToNumberDirective } from './directives/to-number.directive';
import { ToIntegerDirective } from './directives/to-integer.directive';
import { RemoveHostDirective } from './directives/remove-host.directive';
import { AngularGlobalizeModule } from '@code-art/angular-globalize';

@NgModule({
  declarations: [
    ToNullDirective,
    ToNumberDirective,
    ToIntegerDirective,
    RemoveHostDirective
  ],
  imports: [
    FormsModule,
    AngularGlobalizeModule.forRoot()
  ],
  exports: [
    ToNullDirective,
    ToNumberDirective,
    ToIntegerDirective,
    RemoveHostDirective
  ]
})
export class NgFormHelpersModule { }
