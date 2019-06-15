import { takeUntilDestroyed } from '@code-art/rx-helpers';
import { SubjectWrapper } from '../src/public_api';
// tslint:disable: deprecation

describe('SubjectWrapper', () => {
  it('initializes with default value', () => {
    const component = {
      ngOnDestroy: () => { },
    };
    const s = new SubjectWrapper<number>(1, component);
    expect(s.value).toBe(1);
    component.ngOnDestroy();
  });

  it('replays intial event', () => {
    const component = {
      ngOnDestroy: () => { },
    };
    const s = new SubjectWrapper<number>(1, component);
    let n = null as null | number;
    s.observable
      .pipe(takeUntilDestroyed(component))
      .subscribe((v) => {
        n = v;
      });
    expect(n).toBe(1);
    component.ngOnDestroy();
  });

  it('replays intial event when value is undefined', () => {
    const component = {
      ngOnDestroy: () => { },
    };
    const s = new SubjectWrapper<number | undefined>(undefined, component);
    let n = null as null | number | undefined;
    s.observable
      .pipe(takeUntilDestroyed(component))
      .subscribe((v) => {
        n = v;
      });
    expect(n).toBeUndefined();
    component.ngOnDestroy();
  });

  it('tiggers change on value change', () => {
    const component = {
      ngOnDestroy: () => { },
    };
    const s = new SubjectWrapper<number>(1, component);
    let n = null as null | number;
    s.observable
      .pipe(takeUntilDestroyed(component))
      .subscribe((v) => {
        n = v;
      });
    expect(n).toBe(1);
    s.value = 2;
    expect(n).toBe(2);
    component.ngOnDestroy();
  });

  it('has a value getter that works', () => {
    const component = {
      ngOnDestroy: () => { },
    };
    const s = new SubjectWrapper<number>(1, component);
    s.value = 2;
    expect(s.value).toBe(2);
    s.value = 2;
    expect(s.value).toBe(2);
    s.value = 1;
    expect(s.value).toBe(1);
    component.ngOnDestroy();
  });

  it('does not tiggers change when same value', () => {
    const component = {
      ngOnDestroy: () => { },
    };
    const s = new SubjectWrapper<number>(1, component);
    let n = null as null | number;
    let count = 0;
    s.observable
      .pipe(takeUntilDestroyed(component))
      .subscribe((v) => {
        n = v;
        count++;
      });
    expect(n).toBe(1);
    expect(count).toBe(1);
    s.value = 2;
    expect(n).toBe(2);
    expect(count).toBe(2);
    s.value = 2;
    expect(n).toBe(2);
    expect(count).toBe(2);
    s.value = 1;
    expect(n).toBe(1);
    expect(count).toBe(3);
    component.ngOnDestroy();
  });

  it('completes when component destroyed', () => {
    const component = {
      ngOnDestroy: () => { },
    };
    const s = new SubjectWrapper<number>(1, component);
    let completeCalled = false;
    s.observable.subscribe({
      complete: () => {
        completeCalled = true;
      },
    });
    component.ngOnDestroy();
    expect(completeCalled).toBe(true);
  });
});
