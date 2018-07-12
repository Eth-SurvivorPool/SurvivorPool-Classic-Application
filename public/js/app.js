(function () {

  'use strict';
  angular.module('app', ['ui.router'])
    .controller('MainController', mainController)
    .config(config);

  mainController.$inject = ['$scope', '$rootScope', '$location', 'appService', '$interval'];

  function mainController($scope, $rootScope, $location, appService, $interval) {
   console.log("MAIN CONTROLLER");

   let gweiToEther = function(gwei) {
       return gwei / 1000000000000000000;
   };

   let intToStatus = function(int) {
     if (int == 1) {
         return "alive";
     }
     else if (int == 2) {
         return "infected";
     }
     else if (int == 3) {
         return "dead";
     }
     else {
         return "inactive";
     }
   };

   $scope.gameData = {};
   $scope.players = [];

   $scope.nextGameSettled = null;
   $scope.nextGameSettledCountdown = null;
   $scope.nextInfectTime  = null;
   $scope.nextInfectionCountdown = null;

   let callAtInterval = () => {
	    if ($scope.nextInfectTime != null) {
	    	  var now = new Date().getTime();

	    	  var infectDistance = $scope.nextInfectTime - now;

	    	  // Time calculations for days, hours, minutes and seconds
	    	  var hours = Math.floor((infectDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	    	  var minutes = Math.floor((infectDistance % (1000 * 60 * 60)) / (1000 * 60));
	    	  var seconds = Math.floor((infectDistance % (1000 * 60)) / 1000);

	    	  $scope.nextInfectionCountdown = hours + "h " + minutes + "m " + seconds + "s ";

		      var roundDistance = $scope.nextGameSettled - now;

		    var hours = Math.floor((roundDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		    var minutes = Math.floor((roundDistance % (1000 * 60 * 60)) / (1000 * 60));
		    var seconds = Math.floor((roundDistance % (1000 * 60)) / 1000);

		    $scope.nextGameSettledCountdown = hours + "h " + minutes + "m " + seconds + "s ";

	    }
    };

    appService.getClock().then(function(response){
		  var clock = response.data.timestamp;
		  var infectDate = new Date(clock);
		  var roundDate = new Date(clock + (24 * 60 * 60 * 1000));

		  //calculate next infect date
	      var hour = infectDate.getHours();

	      infectDate.setSeconds(0);
	      infectDate.setMinutes(0);
		  var delta = hour % 2 == 0 ? 2 : 1;

		  infectDate.setHours(hour + delta);

		  $scope.nextInfectTime = infectDate;

		  //calculate next round date
          roundDate.setHours(0);
	      roundDate.setMinutes(0);
	      roundDate.setSeconds(0);
	      $scope.nextGameSettled = roundDate;
   });

   $interval(callAtInterval, 1000);

   appService.getGameData().then( (results)=>{
	   console.log(results.data);
	   $scope.gameData.prizePool = gweiToEther(results.data.roundBalance);
	   $scope.gameData.playerCount = results.data.totalPlayersInDB;
	   $scope.gameData.entryFeeEther = gweiToEther(results.data.entryFee);
	   $scope.gameData.entryFee = results.data.entryFee;
	   $scope.gameData.cureFeeEther = gweiToEther(results.data.cureFee);
	   $scope.gameData.cureFee = results.data.cureFee;
	   console.log($scope.gameData);
   });

   appService.getPlayerData().then( (results)=>{
       console.log(results.data);
	   $scope.gameData.infectedCount = results.data.infectedCount;
	   $scope.gameData.deadCount = results.data.playerCount - results.data.aliveCount;
       console.log($scope.gameData);
   });

   appService.getAllPlayers().then( (results)=>{
       console.log(results.data);
       for (var i=0; i<results.data.length; i++)  {
           $scope.players.push({
               address: results.data[i].address,
               joined: results.data[i].join_timestamp,
               status: intToStatus(results.data[i].status),
               balance: results.data[i].balance,
           });
       }
	   console.log($scope.players);
   });
  }

  config.$inject = [
    '$stateProvider'
  ];

  function config(
    $stateProvider,
  ) {

    $stateProvider
      .state('home', {
        url: '/',
        controller: 'MainController'
      });
  }

})();
