'use strict';

angular.module('app')
    .factory('appService', function ($http) {
        var serviceAPIs = {};

        var baseUrl = 'https://eth-survivor-pool-classic-api.herokuapp.com';

        var getGameDataUrl = baseUrl + "/game";
        serviceAPIs.getGameData = function() {
            return $http({method: 'GET', url: getGameDataUrl});
        };

	    var getPlayerDataUrl = baseUrl + "/players";
	    serviceAPIs.getPlayerData = function() {
		    return $http({method: 'GET', url: getPlayerDataUrl});
	    };

	    var getAllPlayersUrl = baseUrl + "/all";
	    serviceAPIs.getAllPlayers = function() {
		    return $http({method: 'GET', url: getAllPlayersUrl});
	    };

	    var getClockUrl = baseUrl + "/clock";
	    serviceAPIs.getClock = function() {
		    return $http({method: 'GET', url: getClockUrl});
	    };

	    var blockchainSignDocumentUrl = baseUrl + '/sign';
        serviceAPIs.blockchainSignDocument = function(payload) {
            console .log(payload);
            return $http({method: 'POST', url: blockchainSignDocumentUrl, data: payload, headers: {'Content-Type': 'application/json'}});
        };

        return serviceAPIs;
    });
