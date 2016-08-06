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
import { UserDeviceLogComponent } from './user-device-log.component';

describe('Component: UserDeviceLog', () => {
  let builder: TestComponentBuilder;

  beforeEachProviders(() => [UserDeviceLogComponent]);
  beforeEach(inject([TestComponentBuilder], function (tcb: TestComponentBuilder) {
    builder = tcb;
  }));

  it('should inject the component', inject([UserDeviceLogComponent],
      (component: UserDeviceLogComponent) => {
    expect(component).toBeTruthy();
  }));

  it('should create the component', inject([], () => {
    return builder.createAsync(UserDeviceLogComponentTestController)
      .then((fixture: ComponentFixture<any>) => {
        let query = fixture.debugElement.query(By.directive(UserDeviceLogComponent));
        expect(query).toBeTruthy();
        expect(query.componentInstance).toBeTruthy();
      });
  }));
});

@Component({
  selector: 'test',
  template: `
    <app-user-device-log></app-user-device-log>
  `,
  directives: [UserDeviceLogComponent]
})
class UserDeviceLogComponentTestController {
}

