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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Share', component: ShareComponent },
  { path: 'Bonds', component: BondsComponent },
  { path: 'Proposal', component: ProposalComponent },
  { path: 'Trade', component: TradeComponent },
  { path: 'AssetManager', component: AssetManagerComponent },
  { path: 'FundAdministrator', component: FundAdministratorComponent },
  { path: 'Auditor', component: AuditorComponent },
  { path: 'ShareIssue', component: ShareIssueComponent },
  { path: 'BondIssue', component: BondIssueComponent },
  { path: 'Propose', component: ProposeComponent },
  { path: 'ModifyProposal', component: ModifyProposalComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }
