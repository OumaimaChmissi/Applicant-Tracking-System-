import { LightningElement, api,track ,wire} from 'lwc';
import getRecentModifiedAccounts from "@salesforce/apex/AccountListController.getRecentModifiedAccounts"
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import STREET_FIELD from '@salesforce/schema/Account.ShippingStreet';
import CITY_FIELD from '@salesforce/schema/Account.ShippingCity';
import POSTCODE_FIELD from '@salesforce/schema/Account.ShippingState';

const fields = [
    'Account.ShippingCity',

    'Account.ShippingCountry',
    'Account.ShippingPostalCode',

    'Account.ShippingState',


	'Account.ShippingStreet'
];
 
 export default class viewAccount extends LightningElement {
    // Flexipage provides recordId and objectApiName
    @api recordId;
    @api objectApiName;
    @track activeSections = ['A', 'B','C'];
    @track error;
    wiredJobsResult;
    @track mapMarkers=[];   
//     @wire(getRecord, {
//         fields: [ STREET_FIELD, CITY_FIELD, POSTCODE_FIELD]
//     },getRecentModifiedAccounts)
//     fetchAcc({ data, error }) {
//         if (data) {
//             this.mapMarkers = [
//                 {
//                     location: {
                            
//                         Street: data.fields.ShippingStreet.value,
//                         City: data.fields.ShippingCity.value,
//                         State: data.fields.ShippingState.value ,                            
//                     },
  
                  
//               }
//           ];
//           console.log('this.mapMarkers => ', JSON.stringify(this.mapMarkers));
//       } else if (error) {
//           console.error('ERROR => ', error);
//       }
//   }

@wire(getRecord, { recordId: '$recordId', fields },getRecentModifiedAccounts)
fetchAcc({ error, data }) {
		if (error) {
            // TODO: handle error
            console.error('ERROR => ', error);
		} else if (data) {
            // Get Bear data
            const City = data.fields.ShippingCity.value;
 			const Country = data.fields.ShippingCountry.value;
             const PostalCode = data.fields.ShippingPostalCode.value;
             const State = data.fields.ShippingState.value;
             const Street = data.fields.ShippingStreet.value;

        

			// Transform bear data into map markers
			this.mapMarkers = [{
				location: { City, Country , PostalCode ,State, Street},
			 
			}];
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