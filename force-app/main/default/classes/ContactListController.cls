public with sharing class ContactListController {
	/*
	 * Get recently modified top 15 accounts.
	 * 
	 */
    @AuraEnabled(cacheable=true)
    public static list<Contact> getRecentModifiedContacts(){
        return [SELECT Id, Name, AccountId, Phone, Owner.Name, Email, Account.Name, LastName, FirstName,Country__c,City__c,
        Record_Typess__c, Title  
                FROM Contact
                Order By LastModifiedDate desc 

                limit 200]; 
    }
}