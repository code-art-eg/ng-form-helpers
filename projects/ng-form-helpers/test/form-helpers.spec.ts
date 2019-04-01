import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';

import { TypedFormGroup, TypedFormArray, TypedFormControl, FormHelpers } from '../src/public_api';

export interface TestChildModel {
  name: string;
  age: number;
}

export interface TestModel {
  name: string;
  children: TestChildModel[];
}

@Component({
  template: `
  <form [formGroup]="form">
    <input type="text" formControlName="name"/>
    <div *ngFor="let f of form.controls.children" [formGroup]="f">
    <input type="text" formControlName="name"/>
    <input type="text" formControlName="age"/>
    </div>
  </form>
`
})
class TestComponent {
  public readonly form = new TypedFormGroup<TestModel>({
    name: new TypedFormControl<string>(null),
    children: new TypedFormArray<TestChildModel>([], () => new TypedFormGroup<TestChildModel>({
      name: new TypedFormControl<string>(null),
      age: new TypedFormControl<number>(0),
    })),
  });

  constructor() {
    this.form.controls.children.pushNewItem();
    this.form.controls.children.pushNewItem();
    this.form.controls.children.pushNewItem();
  }
}

describe('FormHelpers', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [FormsModule, ReactiveFormsModule],
    });

    fixture = TestBed.createComponent<TestComponent>(TestComponent);
    component = fixture.componentInstance;
  });

  const checkstatus = (p: (c: AbstractControl) => boolean) => {
    expect(p(component.form.controls.name)).toBe(true);
    expect(p(component.form.controls.children)).toBe(true);
    for (let i = 0; i < component.form.controls.children.controls.length; i++) {
      const child = component.form.controls.children.controls[i];
      expect(p(child.controls.name)).toBe(true);
      expect(p(child.controls.age)).toBe(true);
    }
  };

  it('marks all children as changes pristine/dirty status of all children', () => {
    FormHelpers.markAsDirtyRecurive(component.form);
    checkstatus((c) => c.dirty);
    FormHelpers.markAsPristineRecurive(component.form);
    checkstatus((c) => c.pristine);
  });

  it('marks all children as changes touched status of all children', () => {
    FormHelpers.markAsTouchedRecursive(component.form);
    checkstatus((c) => c.touched);
    FormHelpers.markAsUntouchedRecursive(component.form);
    checkstatus((c) => c.untouched);
  });

  it('returns control keys', () => {
    expect(FormHelpers.getControlKey(component.form)).toBeNull();
    expect(FormHelpers.getControlKey(component.form.controls.name)).toBe('name');
    expect(FormHelpers.getControlKey(component.form.controls.children)).toBe('children');
    expect(FormHelpers.getControlKey(component.form.controls.children.controls[0])).toBe(0);
  });

  it('returns sibilings', () => {
    expect(FormHelpers.getSibling(component.form, 'x')).toBeNull();
    expect(FormHelpers.getSibling(component.form.controls.name, 'x')).toBeNull();
    expect(FormHelpers.getSibling(component.form.controls.name, 'children')).toBe(component.form.controls.children);
    expect(FormHelpers.getSibling(component.form.controls.children.controls[0], 1)).toBe(component.form.controls.children.controls[1]);
  });
});
