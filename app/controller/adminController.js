app.controller('adminController', ['$scope', '$rootScope', '$timeout', '$window', '$location', function ($scope, $rootScope, $timeout, $window, $location) {
    $scope.user = {
        userType: 'admin',
        userName: '',
        number: '',
        email: '',
        password: '',
        rePassword: ''

    };


    $scope.showModal = true;
    var adminList = JSON.parse(localStorage.getItem('adminData')) || [];



    // $scope.check = function () {
    //     var storedData = localStorage.getItem('adminData');
    //     if (storedData) {

    //         var parsedData = JSON.parse(storedData);

    //     } else {

    //         console.log('No data found in local storage.');
    //     }
    // }

    $scope.$watch('user.userType', function (oldValue, newValue) {

        if (oldValue !== newValue) {
            $scope.user.userName = '';
            $scope.user.number = '';
            $scope.user.email = '';
            $scope.user.password = '';
            $scope.user.rePassword = '';

            $scope.errorMessages = undefined;

        }

    });

    $scope.navigate = function () {
        $timeout(function () {

            $('.modal-backdrop').remove();

            $location.path('/login');


        }, 1000);

    }


    $scope.adminRegistrationValidation = function () {

        //function is to check the username, type and password on the console
        if ($scope.validateForm()) {

        } else {
            console.log('Form validation failed.');
        }
    };

    function isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(email);
    };

    $scope.showButton = false;

    $scope.popUp = function () {

        $scope.display = {
            image: 'app/style/images/check-one.png',
            userType: 'Admin',
            userName: '',
            default: 'Sign Up Successfully'
        };

        if ($scope.validateForm()) {
            $scope.showButton = true;
            if ($scope.user.userType == 'admin') {
                // Clear all data from local storage

                adminList.push($scope.user);
                localStorage.setItem('adminData', JSON.stringify(adminList));
                // $scope.check();
                $scope.display.username = $scope.user.userName;
                $scope.user = {
                    userType: 'admin',
                    userName: '',
                    number: '',
                    email: '',
                    password: '',
                    rePassword: ''

                };

            }
            else {
                $scope.display.userType = 'Student';
                $scope.display.username = $scope.user.userName;

            }
        }

        else {
            $scope.showButton = false;
            $scope.display.image = 'app/style/images/incorrect.png',
                $scope.display.userType = 'Admin/Student',
                $scope.display.default = 'Sign Up Failed!'
        }


    };

    // this function validates form based on certain conditions
    $scope.validateForm = function () {
        $scope.errorMessages = {
            userName: '',
            email: '',
            number: '',
            password: '',
            rePassword: ''
        };


        if (!$scope.user.userName) {
            $scope.errorMessages.userName = 'Username is required.';
        } else if ($scope.user.userName.length < 4) {
            $scope.errorMessages.userName = '*Username must contain at least 4 characters.';
        }

        if (!$scope.user.email) {
            $scope.errorMessages.email = 'Email is required.';

        } else if (!isValidEmail($scope.user.email)) {
            $scope.errorMessages.email = '*Enter valid email ID';
        }
        if (!$scope.user.number) {
            $scope.errorMessages.number = 'Phone number is required';
        }
        else if ($scope.user.number.length != 10) {
            $scope.errorMessages.number = '*Enter valid phone number';
        }
        if (!$scope.user.password) {
            $scope.errorMessages.password = 'Password is required.';
        } else if ($scope.user.password.length < 6) {
            $scope.errorMessages.password = '*Password must be at least 6 characters long.';
        }

        if (!$scope.user.rePassword) {
            $scope.errorMessages.rePassword = 'Re-Enter the password';
        } else if (!($scope.user.rePassword === $scope.user.password)) {
            $scope.errorMessages.rePassword = '*Password does not match!!!';
        }

        return !$scope.errorMessages.userName && !$scope.errorMessages.email
            && !$scope.errorMessages.number && !$scope.errorMessages.password
            && !$scope.errorMessages.rePassword;
    };


}]);


