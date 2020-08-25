import { LightningElement, track, wire, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getRecentModifiedContacts from "@salesforce/apex/ContactListController.getRecentModifiedContacts"

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import { reduceErrors } from 'c/ldsUtils';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import FNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import NAME_FIELD from '@salesforce/schema/Contact.LastName';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import EDUCATION_FIELD from '@salesforce/schema/Contact.Education__c';

import TITLE_FIELD from '@salesforce/schema/Contact.Title';
import ACCOUNTID_FIELD from '@salesforce/schema/Contact.AccountId';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import EXPERIENCE_FIELD from '@salesforce/schema/Contact.Experiences__c';
import SEXE_FIELD  from '@salesforce/schema/Contact.Sexe__c';
import DEPARTMENT_FIELD  from '@salesforce/schema/Contact.Department';
import CITY_FIELD  from '@salesforce/schema/Contact.City__c';
import COUNTRY_FIELD  from '@salesforce/schema/Contact.Country__c';
import BIRTHDATE_FIELD  from '@salesforce/schema/Contact.Birthdate';
import COMMENT_FIELD  from '@salesforce/schema/Contact.Commentaires__c';
import SKILLS_FIELD  from '@salesforce/schema/Contact.Skills__c';
import RECORD_FIELD  from '@salesforce/schema/Contact.Record_Typess__c';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import { refreshApex } from '@salesforce/apex';
import RECORDTYPEID from '@salesforce/schema/Contact.RecordTypeId';

const _FIELDS = [RECORDTYPEID];
 
// Fields to Display for Selected record in RecordForm
const fields=['Name','Account.Name','Department','Email','Phone','Contact Owner'];

const columns = [ 
    {label: 'Nom du Contact', fieldName: 'recordId', type: 'url', typeAttributes: { label:{fieldName:'Name'}, tooltip:{fieldName:'Name'}, target: '_parent'}},
    {label: 'Nom du Compte Associé', fieldName: 'AccountId', type: 'url', typeAttributes: { label:{fieldName:'AccountName'}, tooltip:{fieldName:'AccountName'}, target: '_parent'}},
  {label: 'Titre', fieldName: 'Title', type: 'text'},
    {label: 'Email', fieldName: 'Email', type: 'email'},
    {label: 'Téléphone', fieldName: 'Phone', type: 'phone'},
    {label: 'Propriétaire du Contact', fieldName: 'OwnerId', type: 'url', typeAttributes: { label:{fieldName:'OwnerName'}, tooltip:{fieldName:'OwnerName'}, target: '_parent'}},
];

export default class SampleLWCContacts extends NavigationMixin(LightningElement) {
    @api recordId;
    @track contacts;
    @track error;
    @track mapMarkers = [];
    fields = fields;
    columns = columns;
    maxRowSelection = 1;
    zoomLevel=16;
    @api accountid;
 
    @track contactId;
 

    name = '';
    email = '';
    phone = '';  
    acc = '';
    title ='';
    exp = '';
    sexe='';
    dep='';
    city='';
    county='';
    birthdate='';
    comment='';
   ed ='';
 skills='';
 rec='';
@track varr;
    wiredContactsResult;

    @wire(getRecentModifiedContacts)
    wiredContacts(result) {
        this.wiredContactsResult = result;
        if (result.data) {
            const rows = [];
             
            result.data.forEach( function( contact ){
                if (contact.AccountId){
                // ES2015 (ES6) Object constructor: Object.assign | This new method allows to easily copy values from one object to another.
                const contactObj = Object.assign({}, contact, {
                    recordId: '/lightning/r/'+contact.Id+'/view',
                    OwnerId: '/lightning/r/'+contact.Owner.Id+'/view',
                    OwnerName: contact.Owner.Name,
                    AccountName: contact.Account.Name ,
                    AccountId: '/lightning/r/'+ contact.AccountId+'/view',
                   
               });
                rows.push(contactObj);
              } else {
                 
                const contactObj = Object.assign({}, contact, {
                    recordId: '/lightning/r/'+contact.Id+'/view',
                    OwnerId: '/lightning/r/'+contact.Owner.Id+'/view',
                    OwnerName: contact.Owner.Name,
                     
                    });
                rows.push(contactObj);
              }
            
            
            });  
            this.contacts = rows;
            
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.contacts = undefined;
        }
    
    }
    handleSuccess(event) {
        this.contactId = event.detail.id;
    }
    
    getSelectedContact( event ){
        const contact = event.detail.selectedRows[0];
        this.recordId = contact.Id;
      /*  this.mapMarkers = [
            {
                location: {
                    // Location Information
                    City: account.BillingCity,
                    Country: account.BillingCountry,
                    PostalCode: account.BillingPostalCode,
                    State: account.BillingState,
                    Street: account.BillingStreet,
                },

                icon: 'standard:account',
                title: account.Name
            }
        ];*/
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
        this.contactId = undefined;
        this.name = event.target.value;
    }
    handleAccountChange(event) {
         this.acc = event.target.value;
    }
    handleRecordChange(event) {
        this.varr = event.target.value;

   }

    handleEmailChange(event) {
        this.email = event.target.value;
    }

    handlePhoneChange(event) {
        this.phone = event.target.value;
    }
    
    handleTitleChange(event) {
        this.title = event.target.value;
    }
    handleExperienceChange(event) {
        this.exp = event.target.value;
    }
    handleSexeChange(event) {
        this.sexe = event.target.value;
    }
    handleCityChange(event) {
        this.city = event.target.value;
    }
    handleCountryChange(event) {
        this.country = event.target.value;
    }
    handleDepChange(event) {
        this.dep = event.target.value;
    }
    handleBirthdateChange(event) {
        this.birthdate = event.target.value;
    }
    handleCommentChange(event) {
        this.comment = event.target.value;
    }
    handleEducationChange(event) {
        this.ed = event.target.value;
    }
    handleSkillsChange(event) {
        this.skills = event.target.value;
    }
   
    
    createContact() {
        const fields = {};
        this.varr=this.selectedValue;
        if (this.varr=='0123z000000KmJvAAK') this.varr='Contact';
        if (this.varr=='0123z000000KmK5AAK') this.varr='Condidat';

        fields[NAME_FIELD.fieldApiName] = this.name;
        fields[EMAIL_FIELD.fieldApiName] = this.email;
        fields[PHONE_FIELD.fieldApiName] = this.phone;
        fields[ACCOUNTID_FIELD.fieldApiName] = this.acc;
        fields[TITLE_FIELD.fieldApiName] = this.title;
        fields[EXPERIENCE_FIELD.fieldApiName] = this.exp;
        fields[EDUCATION_FIELD.fieldApiName] = this.ed;
        fields[SKILLS_FIELD.fieldApiName] = this.skills;

        fields[DEPARTMENT_FIELD.fieldApiName] = this.dep;
        fields[SEXE_FIELD.fieldApiName] = this.sexe;
        fields[BIRTHDATE_FIELD.fieldApiName] = this.birthdate;
        fields[CITY_FIELD.fieldApiName] = this.city;
        fields[COUNTRY_FIELD.fieldApiName] = this.country;
        fields[COMMENT_FIELD.fieldApiName] = this.comment;

        fields[RECORD_FIELD.fieldApiName] = this.varr;

        const recordInput = { apiName: CONTACT_OBJECT.objectApiName, fields };
        window.console.log(this.varr);
        window.console.log('wej');
        window.console.log(this.selectedValue);

         createRecord(recordInput)
            .then(contact => {
                this.contactId = contact.id;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Contact created',
                        variant: 'success',
                    }),
                );
                
                this.template.querySelector("section").classList.add("slds-hide");
                this.template.querySelector("div.modalBackdrops").classList.add("slds-hide");
                return refreshApex(this.wiredContactsResult);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({                        
                        title: 'Error creating record',
                        message: error.message,
                        variant: 'error',
                    }),
                );
            });
    }

  
    @track selectedValue;
    @track options = [];

    // object info using wire service
    @wire(getObjectInfo, { objectApiName: CONTACT_OBJECT })
    accObjectInfo({data, error}) {
        if(data) {
            let optionsValues = [];
            // map of record type Info
            const rtInfos = data.recordTypeInfos;

            // getting map values
            let rtValues = Object.values(rtInfos);

            for(let i = 0; i < rtValues.length; i++) {
                if(rtValues[i].name !== 'Master') {
                    optionsValues.push({
                        label: rtValues[i].name,
                        value: rtValues[i].recordTypeId
                    })
                }
            }

            this.options = optionsValues;
        }
        else if(error) {
            window.console.log('Error ===> '+JSON.stringify(error));
        }
    }
   
   
     
    // Handling on change value
    handleChange(event) {
        this.selectedValue = event.detail.value;
        
    }
}