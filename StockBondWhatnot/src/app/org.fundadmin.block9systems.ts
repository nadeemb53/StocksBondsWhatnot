import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.fundadmin.block9systems{
   export class Share extends Asset {
      shareId: string;
      count: number;
      fundadmin: FundAdministrator;
      holder: AssetManager;
   }
   export class Bonds extends Asset {
      bondId: string;
      count: number;
      fundadmin: FundAdministrator;
      holder: AssetManager;
   }
   export class Proposal extends Asset {
      proposalId: string;
      type: TradeStatus;
      count: number;
      price: number;
      fundadmin: FundAdministrator;
      assetmanager: AssetManager;
   }
   export class Trade extends Asset {
      tradeId: string;
      count: number;
      price: number;
      buyer: AssetManager;
      seller: AssetManager;
      fundadmin: FundAdministrator;
   }
   export abstract class User extends Participant {
      email: string;
      name: string;
   }
   export class AssetManager extends User {
      balance: number;
   }
   export class FundAdministrator extends User {
      issuedShareCount: number;
      issuedBonds: number;
      owner: AssetManager;
   }
   export class Auditor extends User {
      isValidated: boolean;
      issuedBonds: number;
      owner: AssetManager;
      fundadmin: FundAdministrator;
   }
   export enum TradeStatus {
      FOR_SALE,
      FOR_BUY,
   }
   export class ShareIssue extends Transaction {
      detail: string;
      count: number;
      price: number;
      fundadmin: FundAdministrator;
   }
   export class BondIssue extends Transaction {
      detail: string;
      count: number;
      price: number;
      fundadmin: FundAdministrator;
   }
   export class Propose extends Transaction {
      proposalType: TradeStatus;
      count: number;
      price: number;
      fundadmin: FundAdministrator;
   }
   export class ModifyProposal extends Transaction {
      newPrice: number;
      proposal: Proposal;
   }
// }
