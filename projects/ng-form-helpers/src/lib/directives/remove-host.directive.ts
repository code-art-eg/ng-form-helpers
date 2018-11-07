import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[frmRemoveHost]',
})
export class RemoveHostDirective implements OnInit {
  constructor(private readonly element: ElementRef) {
  }

  public ngOnInit(): void {
      const nativeElement: HTMLElement = this.element.nativeElement;
      const parentElement = nativeElement.parentElement;
      if (parentElement === null) {
        return;
      }

      // move all children out of the element
      while (nativeElement.firstChild) {
          parentElement.insertBefore(nativeElement.firstChild, nativeElement);
      }
      // remove the empty element(the host)
      parentElement.removeChild(nativeElement);
  }
}
