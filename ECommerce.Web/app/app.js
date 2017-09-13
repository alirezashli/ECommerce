(function () {
    'use strict';
    var app = angular.module('EComApp', ['ui.router','LocalStorageModule','angular-loading-bar']);

    angular.module('EComApp').config(function ($stateProvider, $urlRouterProvider) {
        var homeState = {
            name: 'home',
            url: '/home',
            controller: "homeController",
            templateUrl: "/app/views/home.html"
        }

        var aboutState = {
            name: 'about',
            url: '/about',
            template: '<h3>Its the UI-Router hello world app!</h3>'
        }
        var loginState = {
            name: 'login',
            url: '/login',
            controller: "loginController",
            templateUrl: "/app/views/auth/login.html"
        }
        var signupState = {
            name: 'signup',
            url: '/signup',
            controller: "signupController",
            templateUrl: "/app/views/auth/signup.html"
        }
        var orderState = {
            name: 'orders',
            url: '/orders',
            controller: "ordersController",
            templateUrl: "/app/views/auth/orders.html"
        }

        $stateProvider.state(homeState);
        $stateProvider.state(loginState);
        $stateProvider.state(orderState);
        $stateProvider.state(signupState);
        $stateProvider.state(aboutState);
        $urlRouterProvider.otherwise("/home");
    });

    app.constant('ngAuthSettings', {
        apiServiceBaseUri: 'http://localhost:51951/',
        clientId: 'eCommApp'
    });

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptorService');
    });
    app.run(['authService', function (authService) {
        authService.fillAuthData();
    }]);
})();
