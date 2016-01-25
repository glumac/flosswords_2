(function() {
  var app = angular.module('floss', []);

  app.controller('FlossController', ['$http', '$scope', function($http, $scope) {
    $scope.rows = [];
    $scope.wide = false;
    $scope.squareSize;
    $scope.fontSize;
    $scope.tooltipMagnification = 4;
    $scope.tooltipImg;

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

  app.directive('tooltip', ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        $timeout(function () {
          var $tooltip = elem,
              tooltipLeft,
              tooltipTop,
              initialPosition = scope.squareSize * scope.tooltipMagnification + scope.squareSize * .2,
              $puzzleInner = $('#puzzle-inner');

          scope.showTooltip = function(img) {
            scope.tooltipImg = img;

            $tooltip.show();
          };

          scope.hideTooltip = function() {
            $tooltip.hide();
          };


          $puzzleInner.mousemove(function(event) {
            if (event.pageX - initialPosition > 0) {
              tooltipLeft = event.pageX - initialPosition;
            } else {
              tooltipLeft =  event.pageX + (scope.squareSize * .2);
            }

            if (event.pageY - initialPosition > 0) {
              tooltipTop = event.pageY - initialPosition;
            } else {
              tooltipTop = event.pageY + (scope.squareSize * .2);
            }

            $tooltip.css({top: tooltipTop, left: tooltipLeft});
          });
        }, 1);
      }
    };
  }]);
})();