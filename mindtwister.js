(function(){
  var app = angular.module("MindTwister",[]);

  app.controller("mtCtrl",["$scope",controller]);

  function controller($scope) {
    var $ctrl = this;

    $ctrl.title = "Mind Twister";
    $ctrl.output = [];

    $ctrl.start = function() {};
  }
})();
