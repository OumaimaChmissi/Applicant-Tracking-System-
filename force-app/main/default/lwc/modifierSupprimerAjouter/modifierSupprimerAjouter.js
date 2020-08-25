import { LightningElement ,api,track,wire} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { deleteRecord } from 'lightning/uiRecordApi';
import getRecentModifiedContacts from "@salesforce/apex/ContactListController.getRecentModifiedContacts"
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';
export default class ModifierSupprimerAjouter extends NavigationMixin(LightningElement)  {  
    
    @api recordId;
 
    @api objectApiName;
    handleContactCreated(){
        
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Succès',
                message: 'Contact a été Modifié avec Succès !',
                variant: 'success',
            }));
            return refreshApex(this.wiredJobsResult);

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
  @track error;
  wiredJobsResult;


  @wire(getRecentModifiedContacts)
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
     
  @track error;
  handledelete(event) {
      deleteRecord(this.recordId)
          .then(() => {
              this.dispatchEvent(
                  new ShowToastEvent({
                      title: 'Succès',
                      message: 'Contact Supprimé avec Succès',
                      variant: 'success'
                  })
              );
            
             
              this[NavigationMixin.Navigate]({
                type: 'standard__navItemPage',
                attributes: {
                    // CustomTabs from managed packages are identified by their
                    // namespace prefix followed by two underscores followed by the
                    // developer name. E.g. 'namespace__TabName'
                    apiName: 'Contacts'
                  },
              });
              return refreshApex(this.wiredJobsResult);

          })
          .catch(error => {
              this.dispatchEvent(
                  new ShowToastEvent({
                      title: 'Problème de Suppression de Contact',
                      message: error.body.message,
                      variant: 'error'
                  })
              );
          });
  }

  }