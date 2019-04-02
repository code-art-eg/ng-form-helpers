import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RemoveHostDirective } from '../../src/lib/directives/remove-host.directive';

@Component({
  template: `
    <div >
      <frm-toremove frmRemoveHost="2">
        Hello
      </frm-toremove>
    </div>
  `,
})
class TestRemoveHostComponent {
}

@Component({
  selector: 'frm-toremove',
  template: `
    <p>Test</p>
  `,
})
class TestRemovedComponent {

}

describe('RemoveHostDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
// tslint:disable-next-line: deprecation
      declarations: [TestRemovedComponent, TestRemoveHostComponent, RemoveHostDirective],
      imports: [],
    });
  });

  it('removes host', () => {
    const fixture = TestBed.createComponent<TestRemoveHostComponent>(TestRemoveHostComponent);
    fixture.detectChanges(); // needed to trigger ngOnInit
    const element = fixture.debugElement.query(By.css('div')).nativeElement as HTMLDivElement;
    expect(element.innerHTML.trim()).toBe('<p>Test</p>');
  });
});
