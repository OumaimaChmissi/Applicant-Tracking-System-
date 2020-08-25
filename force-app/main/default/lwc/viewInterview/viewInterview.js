import { LightningElement, api,track } from 'lwc';

export default class viewContact extends LightningElement {
    // Flexipage provides recordId and objectApiName
    @api recordId;
    @api objectApiName;
    @track activeSections=['A', 'B','C'];
}