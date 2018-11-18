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
import { AuditorService } from './Auditor.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-auditor',
  templateUrl: './Auditor.component.html',
  styleUrls: ['./Auditor.component.css'],
  providers: [AuditorService]
})
export class AuditorComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  isValidated = new FormControl('', Validators.required);
  issuedBonds = new FormControl('', Validators.required);
  owner = new FormControl('', Validators.required);
  fundadmin = new FormControl('', Validators.required);
  email = new FormControl('', Validators.required);
  name = new FormControl('', Validators.required);


  constructor(public serviceAuditor: AuditorService, fb: FormBuilder) {
    this.myForm = fb.group({
      isValidated: this.isValidated,
      issuedBonds: this.issuedBonds,
      owner: this.owner,
      fundadmin: this.fundadmin,
      email: this.email,
      name: this.name
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceAuditor.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
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
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.fundadmin.block9systems.Auditor',
      'isValidated': this.isValidated.value,
      'issuedBonds': this.issuedBonds.value,
      'owner': this.owner.value,
      'fundadmin': this.fundadmin.value,
      'email': this.email.value,
      'name': this.name.value
    };

    this.myForm.setValue({
      'isValidated': null,
      'issuedBonds': null,
      'owner': null,
      'fundadmin': null,
      'email': null,
      'name': null
    });

    return this.serviceAuditor.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'isValidated': null,
        'issuedBonds': null,
        'owner': null,
        'fundadmin': null,
        'email': null,
        'name': null
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


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.fundadmin.block9systems.Auditor',
      'isValidated': this.isValidated.value,
      'issuedBonds': this.issuedBonds.value,
      'owner': this.owner.value,
      'fundadmin': this.fundadmin.value,
      'name': this.name.value
    };

    return this.serviceAuditor.updateParticipant(form.get('email').value, this.participant)
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


  deleteParticipant(): Promise<any> {

    return this.serviceAuditor.deleteParticipant(this.currentId)
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

    return this.serviceAuditor.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'isValidated': null,
        'issuedBonds': null,
        'owner': null,
        'fundadmin': null,
        'email': null,
        'name': null
      };

      if (result.isValidated) {
        formObject.isValidated = result.isValidated;
      } else {
        formObject.isValidated = null;
      }

      if (result.issuedBonds) {
        formObject.issuedBonds = result.issuedBonds;
      } else {
        formObject.issuedBonds = null;
      }

      if (result.owner) {
        formObject.owner = result.owner;
      } else {
        formObject.owner = null;
      }

      if (result.fundadmin) {
        formObject.fundadmin = result.fundadmin;
      } else {
        formObject.fundadmin = null;
      }

      if (result.email) {
        formObject.email = result.email;
      } else {
        formObject.email = null;
      }

      if (result.name) {
        formObject.name = result.name;
      } else {
        formObject.name = null;
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
      'isValidated': null,
      'issuedBonds': null,
      'owner': null,
      'fundadmin': null,
      'email': null,
      'name': null
    });
  }
}
