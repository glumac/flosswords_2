(function() {
  var app = angular.module('floss', []);

  app.controller('FlossController', ['$http', '$scope', function($http, $scope) {
    $scope.rows = [],
    $scope.wide = false,
    $scope.squareSize,
    $scope.fontSize; 

    $http.get('https://dl.dropboxusercontent.com/u/204045/puzzle.json').then(populatePuzzle, puzzleError);

    function populatePuzzle(response) {
      $scope.rows = response.data;
    }

    function puzzleError(){
      console.log('error');
    }
  }]);


  app.directive('puzzleSizing', ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        $timeout(function () {
          var $window = $(window),
              $puzzle = elem;

          function puzzleRescale() {            
            if ($window.height() -100 <= $window.width() - 200){
              scope.wide = true;

              $puzzle.height('100%');
            } else {
              scope.wide = false;

              $puzzle.height($window.height() - 110);
            }

            if ($puzzle.width() <= $puzzle.height()) {
              scope.squareSize  = ($puzzle.width() - 10) / 14;
            } else {
              scope.squareSize = ($puzzle.height() - 10) / 14;
            }

            scope.fontSize = scope.squareSize - 10;
            
            scope.$apply();
          };

          puzzleRescale();

          $window.on('resize',puzzleRescale);
        }, 1);
      }
    };
  }]);
})();