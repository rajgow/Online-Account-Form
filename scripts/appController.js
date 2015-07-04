
    /* Root control, it has his scope for entire application, how ever it can be overridden by child controllers  */
    appConfig.controller('TemplateCtrl',function($scope,utilityService,$location) {

        /* It helps in toggling page spinner */
        $scope.updateSpinner = function(value) {
            $scope.spinner = value;
        }

        /* It helps in toggling Main Menu,
        *  it toggles differently as per screen size
        */
        $scope.toggleMenu = function() {
            $(window).width() < 768 ? $scope.showMenu = !$scope.showMenu : $scope.menuType = $scope.menuType == 'short' ? 'big' : 'short';
        };


        /* Helps in showing Form completion circle in mobiles. The reason this code is part of root controller,
        *  instead of FormCtrl is it should get accessed on window resize from utilityService as well
        */
        $scope.toggleFormCompletion = function() {
            $scope.showFormCompletion = !$scope.showFormCompletion;
        };

        /* it is blank function, and being called when every on browsers resize to refresh the application device configurations in scope
        *  it is kind of trick to refresh the scope, some times angular doesn't update the view, when model is changed through widow resize.
        *  it requires any event to refresh the scope values, So after browser resize, it will fire click event on home ele, in turn this function will get called.
        */
        $scope.home = function() {};

        /* updates the scope with the current year, and is currently being used in Footer */
        $scope.currentYear = new Date().getFullYear();

        /* This will called on page loads, and it is correct place to initialize any plugins, custom codes etc.
        *  Currently it will initialize window resize events and also updates scope with current device width
        */
        utilityService.init($scope);
    });

    appConfig.controller('BankingAccCtrl', function($scope,$state,utilityService,sharedModal,appvalues,appconstants) {

         /* This call updates the breadcrumbs,
         *  refer utilityService.updateBreadcrumbs function for more information
         */
         utilityService.updateBreadcrumbs($scope, 1);

         /* updates the scope with the current page name */
         $scope.formName = $state.current.name;

         /* To get latest information of ABC Banking Account */
         utilityService.updateScopeWithLabels($scope, "accountDetails", { method : "GET", url : appconstants.parseURILabels + appconstants.accountDetailsKey });

         /* Resetting Customer Object */
         sharedModal.updateCustomer(new Object());
    });

    appConfig.controller('FormCtrl', function($scope, $state, $location, utilityService, sharedModal, appvalues,appconstants) {

        $scope.customer = sharedModal.getCustomer();

        /* Holds form details, like form name, step no, etc.  */
        $scope.formDetails = appconstants[$state.current.name];


        /* This contains application form, for the angular validations  */
        $scope.application = {};

        /* Customer object, by default it has step 1  */
        $scope.customer.step = $scope.customer.step ||  0;


        /* gets the form current labels, and form fields information as well */
        $scope.getLabels = function() {
            $scope.updateSpinner("show");
            utilityService.updateScopeWithLabels($scope, "formFields", { method : "GET", url : appconstants.parseURILabels + appconstants.formFieldsKey }, function(formFields) {
                $scope.updateSpinner("hide");
                $scope.formFields = formFields[$scope.formDetails.formName]
            });
        }

        /* It will reset the circle on load, as form changed, so that it will create again */
        utilityService.formCircle = undefined;


        /* This will render breadCrumbs, Labels and Circle with Percentage */
        utilityService.updateBreadcrumbs($scope, $scope.customer.step + 2, $scope.formDetails.step);
        $scope.getLabels();
        setTimeout(function() { $scope.updateFormCompletion($scope.application.form) },500);


        /* Calls on submit, if data is valid on the form, calls the service to save the data,
         * Then transits to next step, if final step reached, then transits to success page
         */
        $scope.submit = function(isValid) {
            if(isValid) {
                /* sets the highest step number reached so far */
                $scope.customer.step = $scope.customer.step >= $scope.formDetails.step ? $scope.customer.step : $scope.customer.step + 1;

                /* Call parse Once reached final form */
                if($scope.formDetails.step == 3) {
                    /*  sets the spinners on the screen & and disable the submit button to make sure that user is not clicking twice  */
                    $scope.updateSpinner("show"); $scope.application.formSubmitted = true;

                    var request = { method : "POST", url : appconstants.parseURIApplications, data : { customer : $scope.customer } };

                    /* Service call */
                    utilityService.callService(request, function(data) {
                         $scope.updateSpinner("hide"); $scope.accountId = data.objectId || $scope.accountId
                         sharedModal.updateCustomer(new Object());
                         $location.path("/form/"+ $scope.formDetails.nextStep + $scope.accountId).replace();
                    });
                } else {
                    /* Updating Customer Object */
                    sharedModal.updateCustomer($scope.customer);

                    /* Switching the form */
                    $location.path("/form/"+ $scope.formDetails.nextStep);
                }

            }
        };

        /* Calls on every change of the field to update the form completion */
        $scope.updateFormCompletion = function(applicationForm) {
            utilityService.updateFormCompletion($scope, applicationForm,  15);
        };

        /* this will reset the form */
        $scope.resetForm = function(applicationForm) {
            /* Resets all the fields in the form */
            utilityService.resetFields($scope.customer, applicationForm, $scope);

            /* this will set the form, that control hasn't been touched */
            applicationForm.$setUntouched();

            /* this will set the form, that control hasn't been interacted with yet */
            applicationForm.$setPristine();

            setTimeout(function() { $scope.updateFormCompletion(applicationForm) },10);
        };
    });

    appConfig.controller('AppSuccessCtrl', function($scope,$state, utilityService,appvalues,appconstants) {

        /* updates the scope with the application id */
        $scope.accountId = $state.params.accountId;

        /* This call updates the breadcrumbs,
        *  refer utilityService.updateBreadcrumbs function, to more about these parameters
        */
        utilityService.updateBreadcrumbs($scope, 1, 1, 4);
    });
    appConfig.controller('FailureCtrl', function($scope,$state, utilityService,appvalues,appconstants) {
        /* This call updates the breadcrumbs,
        *  refer utilityService.updateBreadcrumbs function, to more about these parameters
        */
        utilityService.updateBreadcrumbs($scope, 1, 1, 5);
    });


