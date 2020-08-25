import { LightningElement, track, wire, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getRecentModifiedAccounts from "@salesforce/apex/AccountListController.getRecentModifiedAccounts"
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import { reduceErrors } from 'c/ldsUtils';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import SITE_FIELD from '@salesforce/schema/Account.Website';
import External_ID_FIELD from '@salesforce/schema/Account.Account_External_ID__c';
import OwnerId_FIELD from '@salesforce/schema/Account.OwnerId';
import Type_FIELD from '@salesforce/schema/Account.Type';
import Baddress_FIELD from '@salesforce/schema/Account.BillingAddress';
import Indistry_FIELD from '@salesforce/schema/Account.Industry';
import Phone_FIELD from '@salesforce/schema/Account.Phone';
import Fax_FIELD from '@salesforce/schema/Account.Fax';
import { refreshApex } from '@salesforce/apex';
import getAccountList from '@salesforce/apex/AccountController.getAccountList';




// Fields to Display for Selected record in RecordForm
const fields=['Name','AccountNumber','OwnerId','AccountSource','ParentId','AnnualRevenue','Type','CreatedById','LastModifiedById','Industry','Description','Phone'];

const columns = [ 
    {label: 'Nom du compte', fieldName: 'recordId', type: 'url', typeAttributes: { label:{fieldName:'Name'}, tooltip:{fieldName:'Name'}, target: '_parent'}},
    {label: 'Type de compte', fieldName: 'Type', type: 'text'},
    {label: 'Adresse', fieldName: 'Adresse__c' , type: 'text'},
    {label: 'Téléphone', fieldName: 'Phone', type: 'phone'},
    
    {label: 'Site-Web', fieldName: 'Website', type: 'url', typeAttributes: { target: '_parent'}},
    {label: 'Industrie', fieldName: 'Industry', type: 'text'},
   
    {label: 'Propriétaire du compte', fieldName: 'OwnerId', type: 'url', typeAttributes: { label:{fieldName:'OwnerName'}, tooltip:{fieldName:'OwnerName'}, target: '_parent'}},
  
];







export default class DataTable extends NavigationMixin(LightningElement) {
    @api recordId;
    @track accounts;
    @track error;
    @track mapMarkers = [];
    fields = fields;
    columns = columns;
    maxRowSelection = 1;
    zoomLevel=16;
    @track accountId;




    
AccountObject=ACCOUNT_OBJECT
myFields = [OwnerId_FIELD,NAME_FIELD, SITE_FIELD,Phone_FIELD,Fax_FIELD,External_ID_FIELD,Type_FIELD,Baddress_FIELD,Indistry_FIELD ];
   
    name = '';
    site = '';
    wiredAccountsResult;
    @wire(getRecentModifiedAccounts)
    wiredAccounts(result) {
        this.wiredAccountsResult = result;
        if (result.data) {
            const rows = [];
            result.data.forEach( function( account ){
               
                const accountObj = Object.assign({}, account, {
                    recordId: '/lightning/r/'+account.Id+'/view',
                    OwnerId: '/lightning/r/'+account.Owner.Id+'/view',
                    OwnerName: account.Owner.Name,
                });
                rows.push(accountObj);
            });
            this.accounts = rows;
            
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.accounts = undefined;
        }
    }


    
    refreshData() {
        return refreshApex(this.wiredAccountsResult);
        
        }


        getSelectedAccount( event ){
            const account = event.detail.selectedRows[0];
            this.recordId = account.Id;
            this.mapMarkers = [
                {
                    location: {
                        // Location Information
                        City: account.ShippingCity,
                        Country: account.ShippingCountry,
                        PostalCode: account.ShippingPostalCode,
                        State: account.ShippingState,
                        Street: account.ShippingStreet,
                    },
    
                    icon: 'standard:account',
                    title: account.Name
                }
            ];
        }


    handledelete(event) {
        const account = event.detail.selectedRows[0];
        this.recordId = account.Id;
        deleteRecord(this.recordId)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'compte deleted',
                        variant: 'success'
                    })
                );
                return refreshApex(this.wiredJobsResult);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting compte',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }


  handlePopup() {
    this.template.querySelector("section").classList.remove("slds-hide");
    this.template
      .querySelector("div.modalBackdrops")
      .classList.remove("slds-hide");
  }
  handleCloseModal() {
    this.template.querySelector("section").classList.add("slds-hide");
    this.template
      .querySelector("div.modalBackdrops")
      .classList.add("slds-hide");    }
      handleSkip() {

        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
        this.template.querySelector("section").classList.add("slds-hide");
        this.template
          .querySelector("div.modalBackdrops")
          .classList.add("slds-hide");  

      }

  handleNameChange(event) {
    this.accountId = undefined;
    this.name = event.target.value;
}

handleSiteChange(event){
   this.site=event.target.value;
}

createAccount() {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Account created',
                    variant: 'success',
                }),
            );
            this.template.querySelector("section").classList.add("slds-hide");
            this.template.querySelector("div.modalBackdrops").classList.add("slds-hide");
            return refreshApex(this.wiredAccountsResult);

       //eval("$A.get('e.force:refreshView').fire();");
       
}



}