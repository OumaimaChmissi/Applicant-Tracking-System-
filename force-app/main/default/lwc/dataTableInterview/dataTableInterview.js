import { LightningElement, track, wire, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getRecentModifiedInterviews from "@salesforce/apex/InterviewListController.getRecentModifiedInterviews"
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';

import INTERVIEW_OBJECT from '@salesforce/schema/Interview__c';
import NAME__FIELD  from '@salesforce/schema/Interview__c.Name';

import CAND_FIELD from '@salesforce/schema/Interview__c.Candidat__c';
import TYPE_FIELD from '@salesforce/schema/Interview__c.Type__c';
import TIME_FIELD from '@salesforce/schema/Interview__c.Duree__c';

import COMPTE__FIELD from '@salesforce/schema/Interview__c.Compte__c';
import JURY_FIELD from '@salesforce/schema/Interview__c.Nom_du_Jury__c';
import HOUR_FIELD from '@salesforce/schema/Interview__c.Heure_de_l_entretien__c';

import JOB_FIELD from '@salesforce/schema/Interview__c.Job_Num__c';
import JOBTITLE_FIELD from '@salesforce/schema/Interview__c.Titre_du_Job__c';
import JOBREC_FIELD from '@salesforce/schema/Interview__c.Recruteur_du_Job__c';
import DOMNUM_FIELD from '@salesforce/schema/Interview__c.Demandeur_d_emploi__c';

import COMMENT_FIELD  from '@salesforce/schema/Interview__c.Commentaires_sur_l_entretien__c';
import EMAILCAND_FIELD from '@salesforce/schema/Interview__c.Candidat__r.Email';
import EMAILCANDINTERVIEW_FIELD from '@salesforce/schema/Interview__c.Email_de_Candidat__c';
import EMAILJURYINTERVIEW_FIELD from '@salesforce/schema/Interview__c.Email_du_Jury__c';





// Fields to Display for Selected record in RecordForm
const fields=['Nom d\'entretien','Temps de l\'entretien','Candidat','Nom du Jury','Type de l\'entretien'];

const columns = [ 
    
    {label: 'Nom d\'entretien',fieldName: 'recordId', type: 'url', typeAttributes: { label:{fieldName:'Name'}, tooltip:{fieldName:'Name'}, target: '_parent'}},
    {label: 'Temps de l\'entretien', fieldName: 'Heure_de_l_entretien__c', type: 'date',typeAttributes: {day: 'numeric',month: 'short',year: 'numeric',hour: '2-digit',minute: '2-digit',hour24: true},sortable: false},
    {label: 'Candidat',fieldName: 'CandidatID', type: 'url', typeAttributes: { label:{fieldName:'CandidatName'}, tooltip:{fieldName:'CandidatName'}, target: '_parent'}},
   // {label: 'Account Name', fieldName: 'Account__r.Id', type: 'text',},
    {label: 'Nom du Jury',fieldName: 'JuryID', type: 'url', typeAttributes: { label:{fieldName:'JuryName'}, tooltip:{fieldName:'JuryName'}, target: '_parent'}},
    {label: 'Type de l\'entretien', fieldName: 'Type__c', type: 'text',},
    
];


export default class DataTableInterview extends NavigationMixin(LightningElement) {
    @api recordId;
    @api interviews;
    fields = fields;
    columns = columns;
    maxRowSelection = 1;
    zoomLevel=16;
    @track interviewId;
    @track error;
 
    name = '';
    cand = '';
    type = '';
    time = '';
    hour = '';
    jury = '';
    job = '';
    compte = '';
    jobtitre  = '';
    jobrec = '';
    domnum = '';
    comment = '';
    email = '';
    jemail = '';

         


wiredInterviewsResult;

@wire(getRecentModifiedInterviews)
wiredContacts(result) {
    this.wiredInterviewsResult = result;
    if (result.data) {
        const rows = [];
         
        result.data.forEach( function( interview ){
            if (interview.Nom_du_Jury__c && interview.Candidat__c )
            {
                const contactObj = Object.assign({}, interview, {
            
                    recordId: '/lightning/r/'+interview.Id+'/view',
                     JuryID : '/lightning/r/'+interview.Nom_du_Jury__c+'/view',
                      JuryName:  interview.Nom_du_Jury__r.Name,  
                      CandidatName:  interview.Candidat__r.Name ,
                      CandidatID: '/lightning/r/'+interview.Candidat__c+'/view',
                    });
                      
                      rows.push(contactObj)  ;     
    
            }
          
           else if(interview.Nom_du_Jury__c){
            // ES2015 (ES6) Object constructor: Object.assign | This new method allows to easily copy values from one object to another.
            const contactObj = Object.assign({}, interview, {
        
                recordId: '/lightning/r/'+interview.Id+'/view',
                 JuryID : '/lightning/r/'+interview.Nom_du_Jury__c+'/view',
                  JuryName:  interview.Nom_du_Jury__r.Name,  
                });
                  
                  rows.push(contactObj)  ;

            } 
            
         else  if (interview.Candidat__c ){
        const contactObj = Object.assign({}, interview, {
            recordId: '/lightning/r/'+interview.Id+'/view',
            CandidatName:  interview.Candidat__r.Name ,
            CandidatID: '/lightning/r/'+interview.Candidat__c+'/view',
        });
        rows.push(contactObj)  ;
        
    }
       else   {

            const contactObj = Object.assign({}, interview, {
                recordId: '/lightning/r/'+interview.Id+'/view',
               
               
                
           });
            rows.push(contactObj);
            
       
   
      }  });
   
    this.interviews = rows;
 
}else{
    this.error = result.error; 
}
}


/*handleSuccess(event) {
    this.interviewId = event.detail.id;
}*/

getSelectedContact( event ){
    const interview = event.detail.selectedRows[0];
    this.recordId = interview.Id;
 
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
    this.interviewId = undefined;
    this.name = event.target.value;
}
handleCandidatChange(event) {
     this.cand = event.target.value;
}

handleTypeChange(event) {
    this.type = event.target.value;
}

handleTimeChange(event) {
    this.time = event.target.value;
}
handleHourChange(event) {
    this.hour = event.target.value;
}
handleJuryChange(event) {
    this.jury = event.target.value;
}
handleJobChange(event) {
    this.job = event.target.value;
}
handleCompteChange(event) {
    this.compte = event.target.value;
}
handleJobTitleChange(event) {
    this.jobtitre = event.target.value;
}
handleJobRecChange(event) {
    this.jobrec = event.target.value;
}
handleDomnumChange(event) {
    this.domnum = event.target.value;
}
handleCommentChange(event) {
    this.comment = event.target.value;
}

handleEmailChange(event) {
    this.email = event.target.value;
}
handleJEmailChange(event) {
    this.jemail = event.target.value;
}



  createInterview() {


    
    const fields = {};
    fields[NAME__FIELD.fieldApiName] = this.name;
    fields[CAND_FIELD.fieldApiName] = this.cand;
    fields[TYPE_FIELD.fieldApiName] = this.type;
    fields[TIME_FIELD.fieldApiName] = this.time;
    fields[HOUR_FIELD.fieldApiName] = this.hour;
    fields[JURY_FIELD.fieldApiName] = this.jury;
    fields[JOBTITLE_FIELD.fieldApiName] = this.jobtitre;
    fields[JOBREC_FIELD.fieldApiName] = this.jobtitre;
    fields[JOB_FIELD.fieldApiName] = this.job;
    fields[DOMNUM_FIELD.fieldApiName] = this.domnum;
    fields[COMPTE__FIELD.fieldApiName] = this.compte;

    fields[COMMENT_FIELD.fieldApiName] = this.comment;
   // fields[EMAILCANDINTERVIEW_FIELD.fieldApiName] =  this.email;
//    fields[EMAILJURYINTERVIEW_FIELD.fieldApiName] =  this.jemail;



    const recordInput = { apiName: INTERVIEW_OBJECT.objectApiName, fields };
    createRecord(recordInput)
        .then(interview => {
            this.interviewId = interview.id;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Succès',
                    message: 'Entretien a été Créé !',
                    variant: 'success',
                }),
            );
            this.template.querySelector("section").classList.add("slds-hide");
            this.template.querySelector("div.modalBackdrops").classList.add("slds-hide");
            return refreshApex(this.wiredInterviewsResult);
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({                        
                    title: 'Erreur Lors de la Création de l\'entretin',
                    message: error.message,
                    variant: 'error',
                }),
            );
        });
}


}