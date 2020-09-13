import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TypedFormExampleComponent } from './typed-form-example.component';

describe('TypedFormExampleComponent', () => {
  let component: TypedFormExampleComponent;
  let fixture: ComponentFixture<TypedFormExampleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TypedFormExampleComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypedFormExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
