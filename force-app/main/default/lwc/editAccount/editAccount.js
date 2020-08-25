import { LightningElement ,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class EditAccount extends LightningElement {  
     @api recordId;
 
    @api objectApiName;
    handleAccountCreated(){
        
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Account  Updated',
                variant: 'success',
            }));
}
}