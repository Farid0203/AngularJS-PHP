angular.module('myApp').controller('studentRegistrationController', ['$scope', '$rootScope', '$http', '$timeout', '$location', function ($scope, $rootScope, $http, $timeout, $location) {


  // console.log("The admin is :"+  adminIdService.getLoggedAdminId());
  //object data
  $scope.student = {
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
    permanentAddress: '',
    currentAddress: '',
    nationality: '',
    motherTongue: '',
    motherName: '',
    fatherName: '',
    degreeType: '',
    partTimeTiming: '',
    degree: '',
    department: '',
    qualifications: [
      { qualification: '', year: '', institutionType: '', institutionName: '' }
    ],
    adminId: ''

  };


  if ($rootScope.loggedAdminId != '') {
    $scope.student.adminId = $rootScope.loggedAdminId;

  }

  console.log("Its me :" + $scope.student.adminId);
  // dropdown data
  $scope.genders = ['Male', 'Female', 'Transgender'];
  $scope.partTimeTimings = ['Morning', 'Evening'];
  $scope.degrees = ['BCA', 'BE'];
  $scope.departments = ['CIVIL', 'CSE', 'MECH', 'IT'];
  $scope.qualifications = [];

  //used to debug the validity of the form on the console
  // $scope.checkValidity = function () {
  //   var form = $scope.studentFormTwo;

  //   for (var inputName in form) {
  //     if (form.hasOwnProperty(inputName) && inputName.charAt(0) !== "$") {
  //       var input = form[inputName];
  //       console.log(inputName + " is valid: " + input.$valid);
  //     }
  //   }
  // };



  $scope.copyToCurrent = function () {
    if (!$scope.student.permanentAddress) {
      alert("Enter address to copy");
      $scope.isPermanentChecked = false;
    } else {
      if (confirm("Copy to current address?")) {

        $scope.student.currentAddress = $scope.student.permanentAddress;
      }
    }
  };

  $scope.copyToPermanent = function () {
    if (!$scope.student.currentAddress) {
      $scope.isCurrentChecked = false;
      alert("Enter address to copy");
    } else {
      if (confirm("Copy to permanent address?")) {
        $scope.student.permanentAddress = $scope.student.currentAddress;
      }
    }
  }



  //used to add previous Qualification
  $scope.addQualification = function () {

    //maximum no.of previous qualification is set to 3
    if ($scope.student.qualifications.length < 3) {

      /*The first set of inputs should by visible by default, so the length is check to be 0
      the second condition checks that the previous input is valid/invalid and used to push new qualification*/
      if ($scope.student.qualifications.length === 0 || isPreviousInputsValid($scope.student.qualifications[$scope.student.qualifications.length - 1])) {
        // Add a new qualification
        $scope.student.qualifications.push({
          qualification: '',
          year: '',
          institutionType: '',
          institutionName: ''
        });
      }



    };
  };

  //This function is used to remove an qualification, when it is not required
  $scope.removeQualification = function (index) {
    $scope.student.qualifications.splice(index, 1);
  };



  //used to shift between pages
  $scope.currentPage = 'one';

  //used to shift between pages by validating the inputs and includes timeout of 1 second to go to next page.
  $scope.nextPage = function () {
    if ($scope.studentFormOne.$valid) {
      $scope.currentPage = 'two';
    }





  }


  $scope.viewStudents = function () {
    $location.path('/data')
  }
  //This function checks that all the inputs are valid and used to pop up registration is successfull
  $scope.submitForm = function () {

    if ($scope.student.degreeType == "Full Time") {
      $scope.studentFormTwo.partTimeTimings.$setValidity('required', true);
    }
    if ($scope.student.degree == "BCA") {
      $scope.studentFormTwo.department.$setValidity('required', true);
    }


    if ($scope.studentFormTwo.$valid) {
      // angular.toJson($scope.student, true)

      const studentData = JSON.stringify($scope.student);

      var actionParam = encodeURIComponent('addStudent');


      $jq('#reg-success').modal('show'); // Show the edit modal


      $http({
        method: 'POST',
        url: 'http://localhost/AngularJS_Unit2_6/API/Api.php?action=' + actionParam,
        data: studentData, // Assuming studentData is a JavaScript object
        headers: {
          'Content-Type': 'application/json' // Specify JSON data
        }
      }).then(function (response) {
        // Handle success response here
        console.log(response.data);
      }).catch(function (error) {
        // Handle error response here
        console.error('Error adding student:', error);
        if (error.data && angular.isObject(error.data)) {
          console.log('Response data:', error.data);
        }
      });

      // // // Attempt to parse the response data as JSON
      // try {
      //   var responseData = JSON.parse(error.data);
      //   console.log('Response data:', responseData);
      // } catch (jsonError) {
      //   console.error('Error parsing response data as JSON:', jsonError);
      // }

    }
  }


}]);

//filter that checks input name field and returns appropriate error msg
app.filter('onlyCharacters', function () {
  return function (input, scope) {

    if (!input) {
      return scope.result = '';
    }

    let pattern = /^[a-zA-Z]+$/;

    if (pattern.test(input)) {
      return scope.result = '';
    } else {
      return scope.result = 'Name should contain only characters';
    }



  }
});

/*This function is related to add qualification button, 
which is used to make sure that the inputs in previous qualification is not empty,null or undefined*/
function isPreviousInputsValid(qualification) {
  return qualification &&
    qualification.qualification &&
    qualification.year &&
    qualification.institutionType &&
    qualification.institutionName;
}

/*
   $scope.isEmailValid=true; 
  $scope.validateEmail=function(){
       
       if(!EmailValidationService.validateEmail($scope.student.email)){
           $scope.isEmailValid=false;
       }else{
           $scope.isEmailValid=true;
       }
   }
   */


/*app.service("EmailValidationService", function () {
    this.validateEmail = function (email) {
        var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }
});
app.service("DateValidationService",function(){
    this.validateDate= function(inputDate){
        if(!isNaN(Date.parse(inputDate))){
            return 'Enter valid date';
        }else{
            return '';
        }
    }
});*/


// This directive is used to check the email which is valid or not.
app.directive('customEmail', function () {
  const EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return {
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {
      ctrl.$validators.customEmail = function (modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          return true;
        }
        
        if (EMAIL_REGEXP.test(viewValue)) {
          return true;
        }

        return false;
      };
    }
  };
});

// This directive is used to apply dynamic error class for invalid input fields
app.directive('applyErrorClass', function () {
  return {
    restrict: 'A',
    require: '^form',
    link: function (scope, element, attrs, formCtrl) {
      scope.$watch(function () {
        return formCtrl.$submitted && formCtrl[attrs.name].$error.required;
      }, function (hasError) {
        if (hasError) {
          element.addClass('error-msg');
        } else {
          element.removeClass('error-msg');
        }
      });
    }
  };
})


