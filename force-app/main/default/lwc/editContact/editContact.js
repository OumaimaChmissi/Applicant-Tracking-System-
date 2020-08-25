import { LightningElement ,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class EditContact extends LightningElement {  
     @api recordId;
 
    @api objectApiName;
    handleContactCreated(){
        
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Contact a été Modifié avec Succès !',
                variant: 'success',
            }));
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
  
}