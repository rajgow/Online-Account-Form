 appConfig.service('utilityService', ['$http', 'appconstants', "appvalues", "$location", function( $http, appconstants, appvalues, $location ) {
      var utilityService = {};

      /* To check passed value is null or not, returns true if passed value is null */
      utilityService.isNull = function(check) {
          var error = false;
          switch( typeof(check) ) {
             case "object" :
                    if( check == null || check == undefined || check.length <= 0) {
                        error = true
                    }
                    break;
             case "string" :
                    if( $.trim(check) == "" || check == undefined) {
                        error = true;
                    }
                    break;
             case "array" :
                    if( check.length == 0) {
                        error = true;
                    }
                    break;
             case "number" :
                    if(check == 0) {
                       error = true;
                    }
             default :
                    if( !check ) {
                        error = true;
                    }
          }
          return error;
      }

      /*  Creates a circle using jQuery Plugin Circle.min.js
      *   it is a recursive function, to create circle only if passed ele is available in dom.
      *   if passed ele is not available, it wil call the same function for every 500 milliseconds only 5 times, so that to avoid stack over flow exception, if something bad happened
      */
      utilityService.createCircle = function(percentage, id, $scope) {
         var count = 0;
         if($("#"+id).length > 0) {
             utilityService.formCircle =   Circles.create({id : id, radius:60, value:percentage, maxValue:100, width:10, colors:["rgb(241, 243, 250)","#1caf9a"], text:function(value){return parseInt(value) + '%';}});
             $scope.circleRendered = true; $("#home").click();
         } else if (count <= 5) {
            count++;
            setTimeout( function() { utilityService.createCircle(percentage, id, $scope) }, 500);
         }

      };

      /*   handleAppResponsive is being called on page load, as well as on browser resize
      *    it will adjusts the menu and form completion circle as per screen width
      */
      utilityService.handleAppResponsive = function($scope) {
          $scope.browserWidth = $(window).width();
          if( $scope.browserWidth < 768 ) {
              $scope.menuType = 'short'; $scope.showMenu = false;
              $scope.showFormCompletion = false; $scope.device = "mobile";
          } else if( $scope.browserWidth > 991) {
              $scope.showFormCompletion = true;
              $scope.showMenu = true; $scope.device = "desktop";
          } else {
              $scope.showMenu = true; $scope.device = "tablet"
              $scope.showFormCompletion = false;
          }
          $("#home").click();
      };

      /*
       *  AJAX call using Angular service $http
       */
      utilityService.callService = function( activeReq, successCB ) {
          document.body.style.cursor = "wait";
          $http({
              method: activeReq.method,
              url: activeReq.url,
              data: activeReq.data,
              headers: {
                 'Content-Type': 'application/json',
                 'X-Parse-Application-Id': appconstants.applicationId,
                 'X-Parse-REST-API-Key' : appconstants.restAPIkey
              }
          }).success(function (data,config) {
                document.body.style.cursor = "";
                successCB(data);
          }).error(function (data,config) {
                document.body.style.cursor = "";
                $location.path("/application-failure").replace();
          });
      };

      /* This call updates the breadcrumbs to the scope passed,
       *  @param : $scope -> active page scope, to which breadcrumbs will be updated
                   state -> Till which URI State, we need to render breadcrumbs, starting from index 0 (ABC Banking Account)
                   activeIndex -> To make the breadcrumb active
                   addThis -> If you need add more breadcrumbs, pass the index of the breadcrumb to be added
       */
      utilityService.updateBreadcrumbs = function($scope, state, activeIndex, addThis) {
         utilityService.updateScopeWithLabels($scope, "breadcrumbs", { method : "GET", url : appconstants.parseURILabels + appconstants.breadcrumbsKey }, function(data) {
              breadcrumbs = angular.copy(data.breadcrumbs).slice(0,state);

              /* If we need to add any specific breadcrumb at last */
              if(addThis) {
                 breadcrumbs.push(angular.copy(data.breadcrumbs[addThis]))
              }

              /* This will make breadcrumb active, based on passed index*/
              activeIndex ? breadcrumbs[activeIndex].active = true : '';

              $scope.breadcrumbs = breadcrumbs;

              /* This method is being called on all pages, so this makes sure too remove spinner on successful loads */
              $scope.updateSpinner("hide");

         });
      };


      /* This call updates the Form completion percentage to the circle, and it is being called on change of every field
       *  @param : $scope -> active page scope, from which customer get extracted and to pass $scope to create circle if necessary
                   applicationForm -> Angular form,
                   totalFields -> Total number of fields to calculate form completion
      */
      utilityService.updateFormCompletion = function($scope, applicationForm, totalFields) {

            /* it was started with -1 instead of 0 because customer object always have step no, which is not part of form*/
            var filledCount = -1;

            for(var key in $scope.customer) {

                /*  this make sures that it passes all the validations,
                *   if any key which is part customer object, is not present in current form, it means it might be a part of other form.
                    And we no need to validate again because it's already passed validation
                */
                if(!applicationForm[key] || !applicationForm[key].$error.required && !applicationForm[key].$invalid) {
                    filledCount++
                }
            }

            /* Formula to calculate Form completion percentage */
            var currentFormPer = parseInt(filledCount/parseInt(totalFields) * 100);

            /* Creates a circle with the current percentage, if it is not yet created */
            if(utilityService.isNull(utilityService.formCircle)) {
                utilityService.createCircle(currentFormPer, "form-complete-circle", $scope)
            }

            /* updates the current percentage to circle */
            else if(utilityService.formCircle.getValue() != currentFormPer) {
                utilityService.formCircle.update(currentFormPer);
            }
      };

     /* This call will resets the current form fields
      *  @param : customer -> Customer object
                  applicationForm -> Angular form,
      */
      utilityService.resetFields = function(customer, applicationForm, $scope) {
          for(var key in customer) {

              /* to make sure that the key is part of the current form */
              if(applicationForm[key] && customer[key] != "") {
                  customer[key] = "";
              }
          }

          /* To Reset selectize Fields*/
          $("select").each(function(index, ele) {

              /* To make this process async, so that it wont clashes any inprogess $digest or $apply operation */
              setTimeout(function() { ele.selectize.setValue("") },0);
          });
      };

     /* This call will update the landing page information, fist it will check appvalues for the information,
        if its not there it will call a service to get the information, then updates appvalues and scope
      *  @param : $scope -> active page scope, to which it should update the information
                 appvaluesKey -> The key which refer to get the information,
                 request -> request to communicate the server, in case to get the information
                 callback (Optional) -> if you wish to call back the function without updating the scope
      */
      utilityService.updateScopeWithLabels = function($scope, appvaluesKey, request, callback) {
            if(utilityService.isNull(appvalues[appvaluesKey])) {
                utilityService.callService( request, function( data ) {
                    appvalues["save-"+appvaluesKey](data);

                    /* recursive call, after updating appvalues, it will call the same function  to update the scope*/
                    utilityService.updateScopeWithLabels($scope, appvaluesKey, undefined, callback);
                });
            } else {
                /* calls the function if it is passed else updates the scope */
                callback ? callback(angular.copy(appvalues[appvaluesKey])) : $scope[appvaluesKey] = angular.copy(appvalues[appvaluesKey]);

                /* giving some time to update the view using scope */
                setTimeout( function() { utilityService.initSlimScroll() }, 100 );
            }
      };

      /* This will update the current time to passed element */
      utilityService.updateDateTime = function(element) {
         var dateString = new Date().toString(),
			 indexString = navigator.appName == "Microsoft Internet Explorer" ? 'UTC' : ''GMT;
		 element.html(dateString.slice(0, dateString.indexOf(indexString)));
      };

      /* This will initialize slim scroll */
     utilityService.initSlimScroll = function() {
           $('[data-init-slimscroll]').slimscroll({ height: "100%", color : "#d7dce2", railColor : "#eaeaea"});
     };

     /*  Converts passed element into custom select */
     utilityService.renderSelectize = function(element) {
        $(element).selectize ({
            onBlur : function(event) {
               "dispatchEvent" in this.$input[0] ? this.$input[0].dispatchEvent(new Event('blur')) : this.$input[0].fireEvent("onblur");
            }
        })
     };

      /* this being called on page load, and it is correct place to initialize any plugins, custom codes etc. on load
      *  Currently it will initialize window resize event and also updates scope with current device width */
      utilityService.init = function($scope) {
            utilityService.handleAppResponsive($scope);
           $(window).resize(function() { utilityService.handleAppResponsive($scope) });
      };
      return utilityService;
 }]);