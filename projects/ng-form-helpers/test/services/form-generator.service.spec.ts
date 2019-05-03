import { FormGroupInfo } from '../../src/lib/form-generation-models';
import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormGenerationService, TypedFormGroup, NgFormHelpersModule } from '../../src/lib';

interface Address {
  street: string;
  city: string;
}

interface Person {
  firstName: string;
  lastName: string;
  addresses: Address[];
}

const formGroupInfo: FormGroupInfo = {
  name: 'test',
  items: [
    {
      label: 'name',
      content: [
        {
          icon: 'user'
        },
        {
          name: 'firstName',
          validators: [
            {
              name: 'required'
            },
            {
              name: 'personName'
            },
            {
              name: 'minLength',
              parameters: [2]
            },
            {
              name: 'maxLength',
              parameters: [10]
            },
          ],
        },
        {
          name: 'lastName',
          validators: [
            {
              name: 'required'
            },
            {
              name: 'personName'
            },
            {
              name: 'minLength',
              parameters: [2]
            },
            {
              name: 'maxLength',
              parameters: [10]
            },
          ],
        },
      ],
    },
    {
      name: 'addresses',
      itemType: {
        name: 'address',
        items: [
          {
            name: 'street',
            validators: [
              {
                name: 'required'
              },
              {
                name: 'maxLength',
                parameters: [20]
              },
            ],
          },
          {
            name: 'city',
            validators: [
              {
                name: 'required'
              },
              {
                name: 'maxLength',
                parameters: [30]
              },
            ],
          },
        ]
      }
    }
  ],
};

@Component({
  template: `
    <form [formGroup]="form">
      <input type="text" formControlName="firstName" />
      <input type="text" formControlName="lastName" />
      <div *ngFor="let d of form.controls.addresses.controls" [formGroup]="d">
        <input type="text" formControlName="street" />
        <input type="text" formControlName="city" />
      </div>
    </form>
  `
})
class TestComponent {
  public readonly form: TypedFormGroup<Person>;
  constructor(
    public readonly formGenerationService: FormGenerationService,
  ) {
    this.form = this.formGenerationService.createFormGroup(formGroupInfo);
  }
}

describe('FormGeneratorService', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [CommonModule, ReactiveFormsModule, FormsModule, NgFormHelpersModule],
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('creates form object', () => {
    expect(component.form).toBeTruthy();
    expect(component.form.controls.firstName).toBeTruthy();
    expect(component.form.controls.lastName).toBeTruthy();
    expect(component.form.controls.addresses).toBeTruthy();
  });

  it('creates validators', async () => {
    expect(component.form.controls.firstName.invalid).toBe(true);
    expect(component.form.controls.lastName.invalid).toBe(true);
    component.form.controls.firstName.setValue('Test value');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.form.controls.firstName.invalid).toBe(false);
  });
});
