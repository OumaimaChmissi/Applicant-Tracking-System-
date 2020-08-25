 

public with sharing class AccountListController {
	/*
	 * Get recently modified top 15 accounts.
	 * 
	 */
    @AuraEnabled(cacheable=true)
    public static list<Account> getRecentModifiedAccounts(){
        return [SELECT Id, Name, AccountNumber, OwnerId, Owner.Name, AccountSource,  
                AnnualRevenue, Type, Industry, Phone,
                BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry,
                ShippingStreet, ShippingCity, ShippingState, ShippingPostalCode,ShippingCountry, ShippingAddress,Adresse__c,

                Website
                FROM Account 
                Order By LastModifiedDate desc 
                limit 50];
    }
}