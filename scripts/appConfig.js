
   /* Angular Modules configuration
   *  ui.router : This module help in URL Routing
   *  ui.select : This module help in rendering beautiful custom selects.
   *  ngSanitize : This module provides a functionality, which helps making clean HTML.
   *               However its not mandatory to configure Angular, to make ui.select functional it requires ngSanitize
   */
   var appConfig = angular.module('applyAccount', ['ui.router']);


    /* URL Routing */
    appConfig.config(function($stateProvider,$urlRouterProvider) {
        $urlRouterProvider.otherwise('banking-account');
        $stateProvider
            .state('account-details',{
                url : '/banking-account',
                templateUrl : 'fragments/banking-account.html',
                controller : 'BankingAccCtrl'
            })
            .state('personal',{
                url : '/form/personal',
                templateUrl : 'fragments/application.html',
                controller : 'FormCtrl'
            })
            .state('income',{
                url : '/form/income',
                templateUrl : 'fragments/application.html',
                controller : 'FormCtrl'
            })
            .state('account',{
                url : '/form/account',
                templateUrl : 'fragments/application.html',
                controller : 'FormCtrl'
            })
            .state('application-success',{
                url : '/form/success/:accountId',
                templateUrl : 'fragments/application-success.html',
                controller : 'AppSuccessCtrl'
            })
             .state('application-failure',{
                url : '/application-failure',
                templateUrl : 'fragments/application-failure.html',
                controller : 'FailureCtrl'
            })
    });

    /* Application Values */
    appConfig.value('appvalues', {
        "save-accountDetails" : function(details) {
            this.accountDetails = details;
        },
        "save-breadcrumbs" : function(breadcrumbs) {
            this.breadcrumbs = breadcrumbs;
        },
        "save-formFields" : function(formFields) {
            this.formFields = formFields;
        }
    });

    /* Application Constants */
    appConfig.constant('appconstants', {
        accountDetailsKey : "3zIZ3aBPxB",
        breadcrumbsKey : "r6XnMHBzjm",
        formFieldsKey : "yzlHvrj0cK",
        parseURILabels : "https://api.parse.com/1/classes/labels/",
        parseURIApplications : "https://api.parse.com/1/classes/applications/",
        applicationId : "HnUsOaemBuSD01Qd302yK7mmflVZsrQqOxjJwETp",
        restAPIkey : "cgpDruLiMSjz1fCoS3KFpdCm3Vor9S65JALwBrzM",
        personal : { step : 1, icon : "fa-user", formName : "personal", nextStep : "income"},
        income : { step : 2, icon : "fa-briefcase", formName : "income", nextStep : "account"},
        account : { step : 3, icon : "fa-inr", formName : "account", nextStep : "success/"},
        1 : "personal",
        2 : "income",
        3 : "account"
    });


    /* Date directive to update System time on every second
    *  systemTime directive restricted to Attribute, Means it get called only if directive matches to attribute
    */
    appConfig.directive('systemTime', ['utilityService', function(utilityService) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                utilityService.updateDateTime(element);
                setInterval(function() { utilityService.updateDateTime(element) },1000);
            }
        }
    }]);

    /* Selectize directive to convert HTML inputs/selects to customised selects
    */
    appConfig.directive('ngSelectize', ['utilityService', function(utilityService) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                setTimeout (function() {  utilityService.renderSelectize(element) }, 100);
            }
        }
    }]);


    /* Angular Service to share modal between the views */
    appConfig.service('sharedModal', function( ) {
        var customer = {};

        return {
            updateCustomer : function(customerParam) {
                customer = customerParam;
            },
                getCustomer : function() {
                return angular.copy(customer);
            }

        };
    });


    /* Angular Application Bootstrap */
    angular.element(document).ready(function() {
        angular.bootstrap(document,['applyAccount']);
    });


