'use strict';

// Declare app level module which depends on filters, and services

var app = angular.module('myApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap',
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives'
]);

app.config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: '/doc/api',
      controller: 'DataCtrl'
    }).otherwise({
      redirectTo: '/error404'
    });

  $locationProvider.html5Mode(true);
});