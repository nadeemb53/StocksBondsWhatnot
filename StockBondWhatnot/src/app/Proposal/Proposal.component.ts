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

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ProposalService } from './Proposal.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-proposal',
  templateUrl: './Proposal.component.html',
  styleUrls: ['./Proposal.component.css'],
  providers: [ProposalService]
})
export class ProposalComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  proposalId = new FormControl('', Validators.required);
  type = new FormControl('', Validators.required);
  count = new FormControl('', Validators.required);
  price = new FormControl('', Validators.required);
  fundadmin = new FormControl('', Validators.required);
  assetmanager = new FormControl('', Validators.required);

  constructor(public serviceProposal: ProposalService, fb: FormBuilder) {
    this.myForm = fb.group({
      proposalId: this.proposalId,
      type: this.type,
      count: this.count,
      price: this.price,
      fundadmin: this.fundadmin,
      assetmanager: this.assetmanager
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceProposal.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.fundadmin.block9systems.Proposal',
      'proposalId': this.proposalId.value,
      'type': this.type.value,
      'count': this.count.value,
      'price': this.price.value,
      'fundadmin': this.fundadmin.value,
      'assetmanager': this.assetmanager.value
    };

    this.myForm.setValue({
      'proposalId': null,
      'type': null,
      'count': null,
      'price': null,
      'fundadmin': null,
      'assetmanager': null
    });

    return this.serviceProposal.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'proposalId': null,
        'type': null,
        'count': null,
        'price': null,
        'fundadmin': null,
        'assetmanager': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.fundadmin.block9systems.Proposal',
      'type': this.type.value,
      'count': this.count.value,
      'price': this.price.value,
      'fundadmin': this.fundadmin.value,
      'assetmanager': this.assetmanager.value
    };

    return this.serviceProposal.updateAsset(form.get('proposalId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceProposal.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceProposal.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'proposalId': null,
        'type': null,
        'count': null,
        'price': null,
        'fundadmin': null,
        'assetmanager': null
      };

      if (result.proposalId) {
        formObject.proposalId = result.proposalId;
      } else {
        formObject.proposalId = null;
      }

      if (result.type) {
        formObject.type = result.type;
      } else {
        formObject.type = null;
      }

      if (result.count) {
        formObject.count = result.count;
      } else {
        formObject.count = null;
      }

      if (result.price) {
        formObject.price = result.price;
      } else {
        formObject.price = null;
      }

      if (result.fundadmin) {
        formObject.fundadmin = result.fundadmin;
      } else {
        formObject.fundadmin = null;
      }

      if (result.assetmanager) {
        formObject.assetmanager = result.assetmanager;
      } else {
        formObject.assetmanager = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'proposalId': null,
      'type': null,
      'count': null,
      'price': null,
      'fundadmin': null,
      'assetmanager': null
      });
  }

}
