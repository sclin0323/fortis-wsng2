export class FortisWsng2Page {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('fortis-wsng2-app h1')).getText();
  }
}
