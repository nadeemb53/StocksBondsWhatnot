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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { DataService } from './data.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { ShareComponent } from './Share/Share.component';
import { BondsComponent } from './Bonds/Bonds.component';
import { ProposalComponent } from './Proposal/Proposal.component';
import { TradeComponent } from './Trade/Trade.component';

import { AssetManagerComponent } from './AssetManager/AssetManager.component';
import { FundAdministratorComponent } from './FundAdministrator/FundAdministrator.component';
import { AuditorComponent } from './Auditor/Auditor.component';

import { ShareIssueComponent } from './ShareIssue/ShareIssue.component';
import { BondIssueComponent } from './BondIssue/BondIssue.component';
import { ProposeComponent } from './Propose/Propose.component';
import { ModifyProposalComponent } from './ModifyProposal/ModifyProposal.component';

  @NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ShareComponent,
    BondsComponent,
    ProposalComponent,
    TradeComponent,
    AssetManagerComponent,
    FundAdministratorComponent,
    AuditorComponent,
    ShareIssueComponent,
    BondIssueComponent,
    ProposeComponent,
    ModifyProposalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
