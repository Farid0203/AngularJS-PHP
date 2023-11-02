
app.controller('loginController', ['$scope', '$location', '$rootScope', '$timeout','$window', function ($scope, $location, $rootScope, $timeout,$window) {



   
    

    $scope.user = {
        usertype: 'admin',//default usertype is set to admin
        username: '',
        password: ''
    };

    var adminList;
    if($rootScope.adminList){
        var adminList=$rootScope.adminList;
    }else{
        adminList=[];
    }


   


    $scope.showModal = true;
    $scope.loginValidation = function () {


        //function is to check the username, type and password on the console
        if ($scope.validateForm()) {
           
        } else {
            console.log('Form validation failed.');
        }
    };

    $scope.$watch('user.usertype', function (oldValue, newValue) {

        if (oldValue !== newValue) {
            $scope.user.username = '';
            $scope.user.password = '';

            $scope.errorMessages = undefined;

        }

    });


    //this function is used to display the popup modal based on signin success/unsuccess
    $scope.popUp = function () {
        $scope.display = {
            image: 'app/style/images/check-one.png',
            usertype: 'Admin',
            username: '',
            default: 'Sign In Successfully'
        };

        if ($scope.validateForm()) {

            if ($scope.user.usertype == 'admin') {
                $scope.display.username = $scope.user.username;
                $rootScope.loggedAdminId = $scope.user.username;
                // $scope.check();


            }
            else {
                $scope.display.usertype = 'Student',
                    $scope.display.username = $scope.user.username
            }
            $timeout(function () {
                $scope.showModal = false;
                $('.modal-backdrop').remove();
                $location.path('/data');
            }, 2000);

        }

        else {
            $scope.display.image = 'app/style/images/incorrect.png',
                $scope.display.usertype = 'Admin/Student',
                $scope.display.default = 'Sign in Failed!'
        }




    };

    // this function validates form based on certain conditions
    $scope.validateForm = function () {
        $scope.errorMessages = {
            username: '',
            password: ''
        };

       

        if (Array.isArray(adminList)) {
    
            for (const admin of adminList) {
                
              if (admin.userName === $scope.user.username && admin.password === $scope.user.password) {
                $rootScope.loggedAdminId = $scope.user.username;
                return true;        
              }
            }
          } 
          

        if (!$scope.user.username) {
            $scope.errorMessages.username = 'Username is required.';
        } else if ($scope.user.username.length < 4) {
            $scope.errorMessages.username = '*Username must contain at least 4 characters.';
        }

        if (!$scope.user.password) {
            $scope.errorMessages.password = 'Password is required.';
        } else if ($scope.user.password.length < 6) {
            $scope.errorMessages.password = '*Password must be at least 6 characters long.';
        }

        return false;
    };

}]);