/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { AngularTestPage } from './app.po';
import { ExpectedConditions, browser, element, by } from 'protractor';
import {} from 'jasmine';


describe('Starting tests for StockBondWhatnot', function() {
  let page: AngularTestPage;

  beforeEach(() => {
    page = new AngularTestPage();
  });

  it('website title should be StockBondWhatnot', () => {
    page.navigateTo('/');
    return browser.getTitle().then((result)=>{
      expect(result).toBe('StockBondWhatnot');
    })
  });

  it('network-name should be fundadmin-block9systems@0.0.1',() => {
    element(by.css('.network-name')).getWebElement()
    .then((webElement) => {
      return webElement.getText();
    })
    .then((txt) => {
      expect(txt).toBe('fundadmin-block9systems@0.0.1.bna');
    });
  });

  it('navbar-brand should be StockBondWhatnot',() => {
    element(by.css('.navbar-brand')).getWebElement()
    .then((webElement) => {
      return webElement.getText();
    })
    .then((txt) => {
      expect(txt).toBe('StockBondWhatnot');
    });
  });

  
    it('Share component should be loadable',() => {
      page.navigateTo('/Share');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Share');
      });
    });

    it('Share table should have 5 columns',() => {
      page.navigateTo('/Share');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(5); // Addition of 1 for 'Action' column
      });
    });
  
    it('Bonds component should be loadable',() => {
      page.navigateTo('/Bonds');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Bonds');
      });
    });

    it('Bonds table should have 5 columns',() => {
      page.navigateTo('/Bonds');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(5); // Addition of 1 for 'Action' column
      });
    });
  
    it('Proposal component should be loadable',() => {
      page.navigateTo('/Proposal');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Proposal');
      });
    });

    it('Proposal table should have 7 columns',() => {
      page.navigateTo('/Proposal');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(7); // Addition of 1 for 'Action' column
      });
    });
  
    it('Trade component should be loadable',() => {
      page.navigateTo('/Trade');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Trade');
      });
    });

    it('Trade table should have 7 columns',() => {
      page.navigateTo('/Trade');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(7); // Addition of 1 for 'Action' column
      });
    });
  

  
    it('AssetManager component should be loadable',() => {
      page.navigateTo('/AssetManager');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('AssetManager');
      });
    });

    it('AssetManager table should have 4 columns',() => {
      page.navigateTo('/AssetManager');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(4); // Addition of 1 for 'Action' column
      });
    });
  
    it('FundAdministrator component should be loadable',() => {
      page.navigateTo('/FundAdministrator');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('FundAdministrator');
      });
    });

    it('FundAdministrator table should have 6 columns',() => {
      page.navigateTo('/FundAdministrator');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(6); // Addition of 1 for 'Action' column
      });
    });
  
    it('Auditor component should be loadable',() => {
      page.navigateTo('/Auditor');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Auditor');
      });
    });

    it('Auditor table should have 7 columns',() => {
      page.navigateTo('/Auditor');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(7); // Addition of 1 for 'Action' column
      });
    });
  

  
    it('ShareIssue component should be loadable',() => {
      page.navigateTo('/ShareIssue');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('ShareIssue');
      });
    });
  
    it('BondIssue component should be loadable',() => {
      page.navigateTo('/BondIssue');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('BondIssue');
      });
    });
  
    it('Propose component should be loadable',() => {
      page.navigateTo('/Propose');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Propose');
      });
    });
  
    it('ModifyProposal component should be loadable',() => {
      page.navigateTo('/ModifyProposal');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('ModifyProposal');
      });
    });
  

});