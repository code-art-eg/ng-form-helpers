import { FormGroup, FormArray } from '@angular/forms';
import type { AbstractControl } from '@angular/forms';

export class FormHelpers {
  public static markAsTouchedRecursive(ctl: AbstractControl) {
    this.actionRecursive(ctl, (c) => c.markAsTouched());
  }

  public static markAsUntouchedRecursive(ctl: AbstractControl) {
    // angular will mark children as untouched
    ctl.markAsUntouched();
  }

  public static markAsDirtyRecurive(ctl: AbstractControl) {
    this.actionRecursive(ctl, (c) => c.markAsDirty());
  }

  public static markAsPristineRecurive(ctl: AbstractControl) {
    // angular will mark children as pristine
    ctl.markAsPristine();
  }

  public static markAsPendingRecurive(ctl: AbstractControl) {
    this.actionRecursive(ctl, (c) => c.markAsPending());
  }

  public static computeControlId(ctl: AbstractControl | null | undefined): string | null {
    if (!ctl) {
      return null;
    }
    if (!ctl.parent!) {
      return null;
    }
    const parentId = this.computeControlId(ctl.parent!);
    return (parentId ? parentId + '_' : '') + this.getControlKey(ctl);
  }

  public static getControlKey(ctl: AbstractControl): string | number | null {
    if (!ctl.parent!) {
      return null;
    }
    if (ctl.parent instanceof FormArray) {
      return ctl.parent.controls.indexOf(ctl);
    }
    for (const key in ctl.parent!.controls) {
      if (ctl.parent!.controls.hasOwnProperty(key) && ctl.parent!.controls[key] === ctl) {
        return key;
      }
    }
    return null;
  }

  public static getSibling(ctl: AbstractControl, key: string | number): AbstractControl | null {
    if (!ctl.parent!) {
      return null;
    }
    if (ctl.parent instanceof FormArray) {
      if (typeof key !== 'number') {
        throw new Error(`Invalid key. FormHelpers.getSibling with a parent FormArray, expected key to be number.`);
      }
      if (key < 0) {
        throw new Error(`Invalid key. FormHelpers.getSibling with a parent FormArray, expected key positive or zero.`);
      }
      if (ctl.parent.controls.length <= key) {
        return null;
      }
      return ctl.parent.controls[key];
    }
    if (typeof key !== 'string') {
      throw new Error(`Invalid key. FormHelpers.getSibling with a parent FormGroup, expected key to be string.`);
    }
    if (ctl.parent!.controls.hasOwnProperty(key)) {
      return ctl.parent!.controls[key];
    }
    return null;
  }

  public static actionRecursive(ctl: AbstractControl, action: (c: AbstractControl) => any): void {
    const res = action(ctl);
    if (res === false) {
      return;
    }
    if (ctl instanceof FormGroup) {
      for (const key in ctl.controls) {
        if (ctl.controls.hasOwnProperty(key)) {
          this.actionRecursive(ctl.controls[key], action);
        }
      }
    } else if (ctl instanceof FormArray) {
      for (const child of ctl.controls) {
        this.actionRecursive(child, action);
      }
    }
  }
}
