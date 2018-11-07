import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TypedFormExampleComponent } from './components/typed-form-example/typed-form-example.component';

const routes: Routes = [ {
    path: 'typedform',
    component: TypedFormExampleComponent,
  }, {
    path: '',
    redirectTo: 'typedform',
    pathMatch: 'full'
  }, {
    path: '*',
    redirectTo: 'typedform',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
