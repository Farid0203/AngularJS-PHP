// Initialize the AngularJS application
var app = angular.module('myApp', ['ngRoute']).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    // $locationProvider.html5Mode(true);
    $routeProvider
        .when('/home', {
            templateUrl: "app/view/home.html",
            controller: 'homeController'
        })
        .when('/studentRegistration', {
            templateUrl: "app/view/studentRegistration.html",
            controller: 'studentRegistrationController'
        })
        .when('/login', {
            templateUrl: "app/view/login.html",
            controller: 'loginController'
        })
        .when('/register', {
            templateUrl: "app/view/registration.html",
            controller: 'adminController'
        })
        .when('/enrollment', {
            templateUrl: "app/view/enrollmentTemplate.html",
            controller: 'enrollmentController'
        })
        .when('/data', {
            templateUrl: "app/view/dataTable.html",
            controller: 'dataController'
        })
        
        .otherwise({ redirectTo: '/login' });
    console.log($routeProvider);

}]);;

app.controller('mainCtrl', ['$scope','$rootScope', function ($scope,$rootScope) {
    $scope.sample = "data"
    $rootScope.loggedAdminId=1;


    
    $rootScope.adminList=JSON.parse(localStorage.getItem('adminData'));
   console.log($rootScope.adminList);

}]);


app.run(['$rootScope', function ($rootScope) {
    // You can set global variables or functions on $rootScope
    $rootScope.globalVariable = 'This is a global variable';
    
    $rootScope.globalFunction = function () {
        alert('This is a global function');
    };
}]);
