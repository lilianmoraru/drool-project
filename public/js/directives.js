'use strict';

/* Directives */

var app = angular.module('myApp.directives', []);

app.directive('chooseConversion', function ($q, $http) {
    return {
        restrict: "E",
        replace: true,
        template: "<a href='' ng-click='setCurrency(currency)'>{{currency}}</a>",
        link: function (scope, elem, attrs) {
            scope.setCurrency = function(currency) {
                scope.obj.typeOfValue = currency;
                scope.obj.valueCollapsed = !scope.obj.valueCollapsed;

                $http.get('/data/' + currency).success(function (data) {
                    scope.obj.exchangeRate = data.exchangeValue;
                    scope.obj.refreshData = true;
                    scope.obj.updateData();
                });
            }
        }
    }
});

app.directive('chooseVirtualCurrency', function($q, $http) {
    return {
        restrict: "E",
        replace: true,
        template: "<a href='' ng-click='setVirtualCurrency(virtualCurrency)'>{{virtualCurrency}}</a>",
        link: function(scope, elem, attrs) {
            scope.setVirtualCurrency = function(virtualCurrency) {
                scope.obj.typeOfVirtualCurrency = virtualCurrency;
                scope.obj.currencyCollapsed = !scope.obj.currencyCollapsed;
                scope.obj.refreshData = true;
                scope.obj.updateData();
            }
        }
    }
});

app.directive('chooseMarket', function($q, $http) {
    return {
        restrict: "E",
        replace: true,
        template: "<a href='' ng-click='setMarket(market)'>{{market}}</a>",
        link: function(scope, elem, attrs) {
            scope.setMarket = function(market) {
                scope.obj.currentMarket = market;
                scope.obj.refreshData = true;
                scope.obj.updateData();
            }
        }
    }
});