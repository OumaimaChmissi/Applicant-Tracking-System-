public with sharing class InterviewListController {
    @AuraEnabled(cacheable=true)
    public static list<Interview__c> getRecentModifiedInterviews(){
        return [SELECT Id, Name,Candidat__c	,Candidat__r.Email,Commentaire_Rapide_sur_les_r_sultats__c,Commentaires_sur_l_entretien__c	,Compte__c,Compte__r.Name,Candidat__r.Id ,Candidat__r.Name,CreatedById,Demandeur_d_emploi__c	,Duree__c,Email_de_Candidat__c,Email_de_Gestionnaire_de_Compte__c	,Email_du_Jury__c,Email_Recruteur_du_Job__c,Feedback_G_neral__c,Gestionnaire_de_Compte__c,Heure_de_l_entretien__c,ID_de_l_v_nement_du_candidat__c,Job_Num__c,LastModifiedById,Nom_du_Jury__r.Id,Nom_du_Jury__r.Name,Nom_du_Jury__c,OwnerId,Recruteur_du_Candidat__c,Recruteur_du_Job__c,Titre_du_Job__c,Type__c,telephone_du_candidat__c,evaluation__c
                FROM Interview__c
                Order By LastModifiedDate desc 
                limit 25];
    
}


@AuraEnabled(cacheable=true)
public static List<Interview__c> findInterviews(String searchKey) {
    String key = '%' + searchKey + '%';
    return [
        SELECT Id,Name,type__c, Candidat__c,Compte__c,Compte__r.Name,Candidat__r.Name
        FROM Interview__c
        WHERE Name LIKE :key
        WITH SECURITY_ENFORCED
        LIMIT 10
    ];
}

}