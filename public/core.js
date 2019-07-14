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
            // var unpacked = []
            // for (i in data) {
            //     unpacked.push(data[i].capability)
            // }
            $scope.capabilities = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
    });

    $scope.selectcapability = function(capability) {
        $http.get('/api/bp/?capability=' + capability.capability)
            .success(function(data) {
                $scope.processing = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.selectprocess = function(process) {
        $http.get('/api/bf/?process=' + process.bprocessing)
            .success(function(data) {
                $scope.functions = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
}