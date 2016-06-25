import { FortisWsng2Page } from './app.po';

describe('fortis-wsng2 App', function() {
  let page: FortisWsng2Page;

  beforeEach(() => {
    page = new FortisWsng2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('fortis-wsng2 works!');
  });
});
