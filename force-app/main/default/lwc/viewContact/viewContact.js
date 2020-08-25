import { LightningElement, api,track, wire } from 'lwc';
import getRecentModifiedContacts from "@salesforce/apex/ContactListController.getRecentModifiedContacts"
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import CITY_FIELD  from '@salesforce/schema/Contact.City__c';
import COUNTRY_FIELD  from '@salesforce/schema/Contact.Country__c';
import CONTACT_OBJECT from '@salesforce/schema/Contact';

export default class viewContact extends LightningElement {
    // Flexipage provides recordId and objectApiName
    @api recordId;
    @api objectApiName;
    @track activeSections = ['A', 'B','C'];
    @track error;
  wiredJobsResult;
  @track mapMarkers = [];
 
  @wire(getRecord, {
    recordId: '$recordId',
    fields: [ COUNTRY_FIELD, CITY_FIELD  ]
},getRecentModifiedContacts) 
fetchAcc({ data, error }) {
    if (data) {
        this.mapMarkers = [
            {
                location: {
                    City: data.fields.City__c.value,
                    Country: data.fields.Country__c.value,
                  },

                
            }
        ];
        console.log('this.mapMarkers => ', JSON.stringify(this.mapMarkers));
    } else if (error) {
        console.error('ERROR => ', error);
    }
}
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
 
   
}