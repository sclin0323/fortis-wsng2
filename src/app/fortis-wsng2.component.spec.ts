import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { FortisWsng2AppComponent } from '../app/fortis-wsng2.component';

beforeEachProviders(() => [FortisWsng2AppComponent]);

describe('App: FortisWsng2', () => {
  it('should create the app',
      inject([FortisWsng2AppComponent], (app: FortisWsng2AppComponent) => {
    expect(app).toBeTruthy();
  }));

  it('should have as title \'fortis-wsng2 works!\'',
      inject([FortisWsng2AppComponent], (app: FortisWsng2AppComponent) => {
    expect(app.title).toEqual('fortis-wsng2 works!');
  }));
});
