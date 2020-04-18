(function(){
  var app = angular.module("MindTwister",[]);

  var bluePeg = function(label) {
    this.color = "blue";
    this.label = label;
    this.actions = ["right","hopRight"];
  };
  var redPeg = function(label) {
    this.color = "red";
    this.label = label;
    this.actions = ["left","hopLeft"];
  };
  var empty = function() {
    this.color = "empty";
    this.label = "";
  };

  var hole = function(p) {
    this.peg = p;
  };

  /*var state = {
    internal: ["b","b","b","b","e","e","r","r","r","r"],
    holes: [
      new hole(new bluePeg(1)),
      new hole(new bluePeg(2)),
      new hole(new bluePeg(3)),
      new hole(new bluePeg(4)),
      new hole(new empty()),
      new hole(new empty()),
      new hole(new redPeg(1)),
      new hole(new redPeg(2)),
      new hole(new redPeg(3)),
      new hole(new redPeg(4)),
    ]
  };

  var example1 = {
    internal: ["b","b","b","e","b","e","r","r","r","r"],
    holes: [
      new hole(new bluePeg(1)),
      new hole(new bluePeg(2)),
      new hole(new bluePeg(3)),
      new hole(new empty()),
      new hole(new bluePeg(4)),
      new hole(new empty()),
      new hole(new redPeg(1)),
      new hole(new redPeg(2)),
      new hole(new redPeg(3)),
      new hole(new redPeg(4)),
    ]
  };*/

  app.controller("mtCtrl",["$scope",controller]);

  function controller($scope) {
    var $ctrl = this;

    var startState = ["b","b","b","b","e","e","r","r","r","r"];
    var endState = ["r","r","r","r","e","e","b","b","b","b"];
    var limiter = 50;
    var turn = 0;

    $ctrl.title = "Mind Twister";
    $ctrl.output = [];

    $ctrl.start = function() {
      turn = 0;
      var state = _.clone(startState);
      console.log("Starting");
      console.log(state);
      while(didWeWin(state)) {
        turn++;
        console.log(turn,state);
        state = bruteForce(state);
        console.log(turn,state);
        $ctrl.output.push(buildOutput(state));
      }
    };

    function didWeWin(sta) {
      return (!_.isEqual(sta,endState) && turn <= limiter);
    }

    function buildOutput(sta) {
      var holes = [];
      _.forEach(sta,function(peg) {
        if(peg == "b") {
          holes.push(new hole(new bluePeg(peg)));
        }
        else if(peg == "r") {
          holes.push(new hole(new redPeg(peg)));
        }
        else {
          holes.push(new hole(new empty()));
        }
      });

      return {
        internal: sta,
        holes: holes
      };
    }

    function bruteForce(sta) {
      // Look for the first available move
      var i = 0;
      _.forEach(sta,function(peg,index) {
        if(peg == "b" && sta[index+1] == "e") {
          i = index;
        }
      });
      movePeg(sta,i,i+1);
      return sta;
    }

    function movePeg(sta,i,j) {
      var p1 = sta[i];
      sta[i] = sta[j];
      sta[j] = p1;
      return sta;
    }

    function validMove(sta) {
    }
  }
})();
