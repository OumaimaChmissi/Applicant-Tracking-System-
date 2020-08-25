import { LightningElement,api,track,wire } from 'lwc';
import { deleteRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getRecentModifiedAccounts from "@salesforce/apex/AccountListController.getRecentModifiedAccounts"
import { refreshApex } from '@salesforce/apex';
export default class UpdateDeleteAccount extends NavigationMixin(LightningElement) {
    // Flexipage provides recordId and objectApiName
    @api recordId;
    @api objectApiName;
    wiredJobsResult;

    //handle delete Record
    @track error;
    handleAccountCreated(){
        
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Succès',
                message: 'Le Compte a été Modifié ! ',
                variant: 'success',
            }));
                            return refreshApex(this.wiredJobsResult);

}
@track error;


@wire(getRecentModifiedAccounts)
wiredAccounts(result) {
    this.wiredJobsResult = result;
    if (result.data) {
        this.Jobs = result.data;
        this.error = undefined;
  
    } else if (result.error) {
        this.error = result.error;
        this.Jobs = undefined;
    }
    
}

    handledelete(event) {
        deleteRecord(this.recordId)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Succès',
                        message: 'Le Compte a été Supprimé !',
                        variant: 'success'
                    })
                );
                // Navigate to a record home page after
                // the record is deleted, such as to the
                // contact home page
                this[NavigationMixin.Navigate]({
                    type: 'standard__navItemPage',
                    attributes: {
                        // CustomTabs from managed packages are identified by their
                        // namespace prefix followed by two underscores followed by the
                        // developer name. E.g. 'namespace__TabName'
                        apiName: 'Comptes'
                    },
                });
                return refreshApex(this.wiredJobsResult);

            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Erreur dans la Suppression du Compte',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }

    //handle pop pup
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



    

}