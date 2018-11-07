import { OnDestroy } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntilDestroyed } from '@code-art/rx-helpers';

export class SubjectWrapper<T> {
    public readonly observable: Observable<T>;
    private readonly _subject: ReplaySubject<T>;
    private _innerValue!: T;
    private readonly _isIntializing: boolean = true;

    constructor(initialVal: T, parent: OnDestroy) {
        this._subject = new ReplaySubject<T>(1);
        this.observable = this._subject.asObservable();
        this.observable.pipe(takeUntilDestroyed(parent))
            .subscribe({
                complete: () => {
                    this._subject.complete();
                }
            });
        this.value = initialVal;
        this._isIntializing = false;
    }

    get value(): T {
        return this._innerValue;
    }

    set value(val: T) {
        if (this._innerValue !== val || this._isIntializing) {
            this._innerValue = val;
            this._subject.next(val);
        }
    }
}
