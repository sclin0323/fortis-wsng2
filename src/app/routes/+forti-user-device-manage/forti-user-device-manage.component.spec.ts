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
import { FortiUserDeviceManageComponent } from './forti-user-device-manage.component';

describe('Component: FortiUserDeviceManage', () => {
  let builder: TestComponentBuilder;

  beforeEachProviders(() => [FortiUserDeviceManageComponent]);
  beforeEach(inject([TestComponentBuilder], function (tcb: TestComponentBuilder) {
    builder = tcb;
  }));

  it('should inject the component', inject([FortiUserDeviceManageComponent],
      (component: FortiUserDeviceManageComponent) => {
    expect(component).toBeTruthy();
  }));

  it('should create the component', inject([], () => {
    return builder.createAsync(FortiUserDeviceManageComponentTestController)
      .then((fixture: ComponentFixture<any>) => {
        let query = fixture.debugElement.query(By.directive(FortiUserDeviceManageComponent));
        expect(query).toBeTruthy();
        expect(query.componentInstance).toBeTruthy();
      });
  }));
});

@Component({
  selector: 'test',
  template: `
    <app-forti-user-device-manage></app-forti-user-device-manage>
  `,
  directives: [FortiUserDeviceManageComponent]
})
class FortiUserDeviceManageComponentTestController {
}

