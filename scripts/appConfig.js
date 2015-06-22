
   /* Angular Modules configuration
   *  ui.router : This module help in URL Routing
   *  ui.select : This module help in rendering beautiful custom selects.
   *  ngSanitize : This module provides a functionality, which helps making clean HTML.
   *               However its not mandatory to configure Angular, to make ui.select functional it requires ngSanitize
   */
   var appConfig = angular.module('applyAccount', ['ui.router', 'ui.select', 'ngSanitize']);


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
                url : '/form/personal/:accountId',
                templateUrl : 'fragments/application.html',
                controller : 'FormCtrl'
            })
            .state('income',{
                url : '/form/income/:accountId',
                templateUrl : 'fragments/application.html',
                controller : 'FormCtrl'
            })
            .state('account',{
                url : '/form/account/:accountId',
                templateUrl : 'fragments/application.html',
                controller : 'FormCtrl'
            })
            .state('application-success',{
                url : '/form/success/:accountId',
                templateUrl : 'fragments/application-success.html',
                controller : 'AppSuccessCtrl'
            })
    });


    /* Application Values */
    appConfig.value('appvalues', {
        breadcrumbs : [{"title":"ABC Banking Account","icon":"fa-inr","active":false,"url":"#/banking-account"},{"title":"Personal Details","icon":"fa-user","active":false,"url":"#/form/personal/"},{"title":"Income Details","icon":"fa-briefcase","active":false,"url":"#/form/income/"},{"title":"Account Details","icon":"fa-inr","active":false,"url":"#/form/account/"},{"title":"Application Success","icon":"fa-check","active":false,"url":"#/form/success/"}],
        formFields : {"account":[{"modal":"accountType","required":true,"title":"Account Type","type":"D","values":[{"code":"SA","decode":"Savings Account"},{"code":"CA","decode":"Current Account"},{"code":"SCA","decode":"Savings \u0026 Current Account"},{"code":"SALA","decode":"Salary Account"},{"code":"ABCP","decode":"ABCBanking Premium Account"}]},{"modal":"moreAccoutOPtions","required":true,"title":"","type":"R","values":[{"code":"AFD","decode":"Apply for Fixed Deposit"},{"code":"HANC","decode":"Holding any credit cards from ABC Bank"}]},{"modal":"terms","required":true,"title":"","type":"C","values":[{"code":"TERMS","decode":"Do you accept our terms \u0026 Conditions"}]}],"createdAt":"2015-06-21T15:21:20.443Z","income":[{"modal":"pan","required":true,"title":"PAN Card","type":"T"},{"modal":"annualIncome","required":true,"title":"Gross Annual Income","type":"N"},{"modal":"company","required":true,"title":"Company Name","type":"T"},{"modal":"designation","required":true,"title":"Designation","type":"D","values":[{"code":"DIR","decode":"Director"},{"code":"MANG","decode":"Manager"},{"code":"SUR","decode":"Surgeon"},{"code":"ASSM","decode":"Assistant Manager"},{"code":"PROF","decode":"Professor"},{"code":"OTHER","decode":"Other"}]},{"modal":"profession","required":true,"title":"Profession","type":"D","values":[{"code":"ITP","decode":"IT Professional"},{"code":"DOC","decode":"Doctor"},{"code":"BUSS","decode":"Business"},{"code":"BANK","decode":"Banking"},{"code":"AGRI","decode":"Agriculture"},{"code":"ET","decode":"Education/Training"}]},{"modal":"address","required":true,"title":"Address","type":"TA"},{"modal":"pincode","required":true,"title":"Pincode","type":"N"}],"objectId":"yzlHvrj0cK","personal":[{"modal":"fname","required":true,"title":"First Name","type":"T"},{"modal":"lname","required":true,"title":"Last Name","type":"T"},{"modal":"age","required":true,"title":"Age","type":"N"},{"modal":"city","required":true,"title":"City","type":"D","values":[{"code":"HYD","decode":"Hyderabad"},{"code":"TPTY","decode":"Tirupati"},{"code":"BZA","decode":"Vijayawada"},{"code":"VSKP","decode":"Vizag"}]},{"modal":"profession","required":true,"title":"Profession","type":"D","values":[{"code":"ITP","decode":"IT Professional"},{"code":"DOC","decode":"Doctor"},{"code":"BUSS","decode":"Business"},{"code":"PROF","decode":"Professor"},{"code":"AGRI","decode":"Agriculture"}]},{"modal":"mobile","required":true,"title":"Mobile No","type":"N"}],"updatedAt":"2015-06-22T13:25:09.920Z"},
		accountDetails : {"topReasons":{"title":"Top Reasons to open a ABCBanking Account","icon":"fa-thumbs-up fa-125x","listIcon":"fa-check","list":["Enjoy Zero fees on a host of banking services","Zero fees on a host of banking services","Never-expiring Reward Points redeemable for cash and airmiles on the ABCBank Platinum Debit Card","Free withdrawals at any ATM in India and overseas"]},"benefits":{"title":"Benefits","icon":"fa-suitcase fa-125x","innerListIcon":"fa-dot-circle-o","list":[{"title":"Get a complimentary ABCBank Platinum Debit Card","icon":"fa-cc-visa","list":["Free ATM cash withdrawal around the world","High daily spend and withdrawal limit of up to Rs.1 Lakh","Convenience of cashless payments, online as well as in-store, around the world"]},{"title":"Never-expiring Reward Points on the ABCBank Platinum Debit Card","icon":"fa-gift","list":["Get rewarded when you spend on your debit card","Get 2X air miles on Jet Airways and Air India","Attractive welcome privileges on a range of lifestyle products and services"]},{"title":"Enjoy value based benefits with your account, including","icon":"fa-star fa-spin","list":["Zero fee on a wide range of banking services. For the complete list of complimentary services that you can enjoy, refer to the FEATURES tab","A Personal Banker, and use of in-depth research reports for smarter financial planning","Account-related assistance within 20 seconds or less when you call our 24x7 ABCPhone helpline"]}]},"features":{"title":"Features","icon":"fa-thumbs-up fa-125x","list":[{"title":"Flexibility","icon":"fa-cog fa-spin","list":[{"type":"Bank Alerts","desc":"Track your account activity with free SMS & E-mail alerts"},{"type":"Minimum Relationship Value","desc":"The average monthly relationship value requirement for this account is Rs.2,00,000 which includes balances across Savings, Term Deposits, Investments, Insurance, Outstanding principal on Home Loan and Citibank Demat Account"}]}]}},
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
        personal : { step : 1, icon : "fa-user", formName : "personal"},
        income : { step : 2, icon : "fa-briefcase", formName : "income"},
        account : { step : 3, icon : "fa-inr", formName : "account"},
        1 : "personal/",
        2 : "income/",
        3 : "account/"
    });


    /* UI Select filter as per properties (This code taken from UI Select examples)*/
    appConfig.filter('propsFilter', function() {
        return function(items, props) {
            var out = [];
            if (angular.isArray(items)) {
                items.forEach(function(item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }
                if (itemMatches) {
                  out.push(item);
                }
            });
            } else {
                // Let the output be the input untouched
                out = items;
            }
            return out;
        };
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

    /* Angular Application Bootstrap */
    angular.element(document).ready(function() {
        angular.bootstrap(document,['applyAccount']);
    });


