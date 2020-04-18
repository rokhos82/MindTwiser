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
      var moves = ["moveBlue","jumpBlue","moveRed","jumpRed"];
      var move = _.sample(moves);

      _.forEach(sta,function(peg,index) {
        if(move == "moveBlule" && peg == "b" && sta[index+1] == "e") {
          i = index;
        }
        else if(move == "jumpBlue")
      });
      movePeg(sta,i,i+1);
      return sta;
    }

    function calculateStates(sta) {
      var states = [];

      _.forEach(sta,function(peg,index) {
        if(peg == "b") {
          // Check for move right and jump right
          if(index < 9 && sta[index+1] == "e") {
            // Move right
          }
          else if(index < 8 && (sta[index+1] == "b" || sta[index+1] == "r") && sta[index+2] == "e") {
            // Jump right
          }
        }
        if(peg == "r") {
          // Check for move left and jump left
          if(sta[index-1] == "e") {
            // Move left
          }
          else if((sta[index-1] == "b" || sta[index-1] == "r") && sta[index-2] == "e") {
            // Jump left
          }
        }
      });

      return states;
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
