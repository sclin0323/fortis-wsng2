import {
  beforeEach,
  beforeEachProviders,
  describe,
  expect,
  it,
  inject,
} from '@angular/core/testing';
import { ComponentFixture, TestComponentBuilder } from '@angular/compiler/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AjaxWaitingComponent } from './ajax-waiting.component';

describe('Component: AjaxWaiting', () => {
  let builder: TestComponentBuilder;

  beforeEachProviders(() => [AjaxWaitingComponent]);
  beforeEach(inject([TestComponentBuilder], function (tcb: TestComponentBuilder) {
    builder = tcb;
  }));

  it('should inject the component', inject([AjaxWaitingComponent],
      (component: AjaxWaitingComponent) => {
    expect(component).toBeTruthy();
  }));

  it('should create the component', inject([], () => {
    return builder.createAsync(AjaxWaitingComponentTestController)
      .then((fixture: ComponentFixture<any>) => {
        let query = fixture.debugElement.query(By.directive(AjaxWaitingComponent));
        expect(query).toBeTruthy();
        expect(query.componentInstance).toBeTruthy();
      });
  }));
});

@Component({
  selector: 'test',
  template: `
    <app-ajax-waiting></app-ajax-waiting>
  `,
  directives: [AjaxWaitingComponent]
})
class AjaxWaitingComponentTestController {
}

