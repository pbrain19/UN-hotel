'use strict';


// Declare app level module which depends on filters, and services
angular.module('AppleHotel', ['AppleHotel.filters',
    'AppleHotel.controllers', 'AppleHotel.services',
    'AppleHotel.directives' ,'ui.bootstrap','angular-carousel','angularLocalStorage']).
        config(function($routeProvider, $httpProvider) {


            $routeProvider.when('/home', {templateUrl: 'partials/home.html'});
    $routeProvider.when('/dining', {templateUrl: 'partials/dining.html'});
    $routeProvider.when('/activities', {templateUrl: 'partials/Activities.html'});
    $routeProvider.when('/weather', {templateUrl: 'partials/Weather.html'});
    $routeProvider.when('/flights', {templateUrl: 'partials/Flighttimes.html'});
    $routeProvider.when('/news', {templateUrl: 'partials/News.html'});
    $routeProvider.when('/transportation', {templateUrl: 'partials/Transportation.html'});

    $routeProvider.otherwise({redirectTo: '/home'});

});

