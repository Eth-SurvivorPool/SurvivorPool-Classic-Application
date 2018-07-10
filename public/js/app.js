(function () {

  'use strict';
  angular.module('app', ['ui.router'])
    .controller('MainController', mainController)
    .config(config);

  mainController.$inject = ['$scope', '$rootScope', '$location', 'appService'];

  function mainController($scope, $rootScope, $location, appService) {
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

   appService.getGameData().then( (results)=>{
	   console.log(results.data);
	   $scope.gameData.prizePool = gweiToEther(results.data.totalPrizePool);
	   $scope.gameData.playerCount = results.data.totalPlayersInDB;
	   $scope.gameData.entryFee = gweiToEther(results.data.entryFee);
	   $scope.gameData.cureFee = gweiToEther(results.data.cureFee);
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
