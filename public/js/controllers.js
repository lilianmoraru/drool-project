'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
    controller('AppCtrl', function ($scope, $http) {
        $scope.obj = {};

        $scope.obj.transferValue = 0;
        $scope.obj.exchangeRate = 0;

        //Right
        $scope.obj.exchangeValue = 0;
        //Left
        $scope.obj.currencyValue = 0;

        $scope.obj.currentMarket = "Bitfinex";
        $scope.obj.previousMarket = $scope.obj.currentMarket;
        $scope.obj.previousBTCUSD = 0;
        $scope.obj.refreshData = true;
        $scope.obj.virtualCurrencies = ['Bitcoin', 'Litecoin'];
        $scope.obj.typeOfVirtualCurrency = 'Bitcoin';
        $scope.obj.typeOfValue= 'USD';
        $scope.obj.currencyCollapsed = true;
        $scope.obj.valueCollapsed = true;
        $scope.obj.currencyToModify = false;

        $http.get('/data').success(function (data) {
            $scope.obj.rememberCurrencies = $scope.obj.currencies = data.currencies;
        });

        $http.get('/markets').success(function (data) {
            $scope.obj.markets = data.markets;
        });

        $http.get('/data/USD').success(function (data) {
            $scope.obj.exchangeRate = data.exchangeValue;
        });

        ///Pulls data from the server and updates the values while taking in consideration all the flags currently set
        $scope.obj.updateData = function() {
            var updateUi = false;
            if ($scope.obj.previousMarket != $scope.obj.currentMarket) {
                updateUi = true;
                $scope.obj.previousMarket = $scope.obj.currentMarket;
            }

//            if ($scope.obj.currencyToModify) {
//                $scope.obj.currencyValue = "Loading...";
//            } else {
//                $scope.obj.exchangeValue = "Loading...";
//            }
            $http.get('/markets/' + $scope.obj.currentMarket).success(function (data) {
                if ($scope.obj.previousBTCUSD != data.btcusd) {
                    $scope.obj.refreshData = true;
                    $scope.obj.previousBTCUSD = data.btcusd;
                }

                if (updateUi) {
                    if ($scope.obj.ltcAvailable = data.ltcAvailable) {
                        $scope.obj.virtualCurrencies = ['Bitcoin', 'Litecoin'];

                        //If there is Litecoin, than an exchange to Litecoin will be available
                        $scope.obj.currencies = $scope.obj.rememberCurrencies;
                        $scope.obj.currencies.push('LTC');
                    } else {
                        $scope.obj.virtualCurrencies = ['Bitcoin'];
                        $scope.obj.typeOfVirtualCurrency = 'Bitcoin';

                        //If there is no other currency than Bitcoin, then there will be only the default types of currency to exchange
                        $scope.obj.currencies = $scope.obj.rememberCurrencies;
                    }
                }

                if ($scope.obj.refreshData) {
                    if ($scope.obj.typeOfVirtualCurrency == 'Bitcoin') {
                        if ($scope.obj.typeOfValue != 'BTC') {
                            if ($scope.obj.typeOfValue == 'LTC') {
                                $scope.exchangeRate = 1;
                                $scope.transferValue = 1.0 / data.ltcbtc;
                            } else {
                                $scope.obj.transferValue = data.btcusd;
                            }
                        } else {
                            $scope.obj.exchangeRate = 1;
                            $scope.obj.transferValue = 1;
                        }
                    }

                    if ($scope.obj.typeOfVirtualCurrency == 'Litecoin') {
                        if ($scope.obj.typeOfValue != 'LTC') {
                            if ($scope.obj.typeOfValue == 'BTC') {
                                $scope.obj.exchangeRate = 1;
                                $scope.obj.transferValue = data.ltcbtc;
                            } else {
                                $scope.obj.transferValue = data.ltcusd;
                            }
                        } else {
                            $scope.obj.transferValue = 1;
                            $scope.obj.exchangeRate = 1;
                        }
                    }

                    $scope.obj.compute();
                    $scope.obj.refreshData = false;
                }
            });
        }

        $scope.obj.modifyCurrency = function(state) {
            $scope.currencyToModify = state;
        }

        $scope.obj.compute = function() {
            if ($scope.currencyToModify) {
                $scope.obj.currencyValue = $scope.obj.exchangeValue / ($scope.obj.exchangeRate * $scope.obj.transferValue);
            } else {
                $scope.obj.exchangeValue = $scope.obj.currencyValue * ($scope.obj.exchangeRate * $scope.obj.transferValue);
            }
        };

        $scope.obj.updateData();
        setInterval($scope.obj.updateData, 5000);
    });
/*
 .
 controller('DataCtrl', function ($scope, $http) {
 //This is not used
 $scope.messages = ['Lilian Moraru', 'Viorel Moraru', 'Anatol Moraru', 'Efrosinia Moraru'];
 }).
 controller('MyCtrl2', function ($scope) {
 // write Ctrl here

 });*/
