import { deleteRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { LightningElement,api,track } from 'lwc';
import getRecentModifiedInterviews from "@salesforce/apex/InterviewListController.getRecentModifiedInterviews"
 import { createRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import {   wire  } from 'lwc';


export default class UpdateDeleteInterview extends NavigationMixin(LightningElement) {
    // Flexipage provides recordId and objectApiName
    @api recordId;
    @api objectApiName;
    //handle delete Record
    @track error;
    @wire(getRecentModifiedInterviews)
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
    handleInterviewCreated(){
        
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Succès',
                message: 'L\'entretien a été Modifié ! ',
                variant: 'success',
            }));
            return refreshApex(this.wiredJobsResult);

}
    handledelete(event) {
        deleteRecord(this.recordId)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Succès',
                        message: 'L\'entretien a été Supprimé !',
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
                        apiName: 'Entretiens'
                    },
                });
                return refreshApex(this.wiredJobsResult);

            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Erreur dans la Suppression de L\'entretien',
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