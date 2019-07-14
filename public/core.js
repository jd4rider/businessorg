// $http.get('/api/bc')
//     .success(function(data) {
//         //$scope.todos = data;
//         console.log(data);
//     })
//     .error(function(data) {
//         console.log('Error: ' + data);
//     });

    //$.get( "/api/bc", function( data ) {
     //   console.log(data)
      //});

var businessOrg = angular.module('businessOrg', []);

function mainController($scope, $http){
  $http.get('/api/bc')
    .success(function(data) {
        //$scope.todos = data;
        console.log(data);
    })
    .error(function(data) {
        console.log('Error: ' + data);
    });
}