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
    var done = false;

    $ctrl.title = "Mind Twister";
    $ctrl.output = [];

    $ctrl.states = {
      "bbbbeerrrr": {
        board: _.clone(startState),
        neighbors: [],
        visited: true
      }
    };
    $ctrl.solution = [];

    $ctrl.start = function() {
      $ctrl.output = [];
      $ctrl.solution = [];
      startWork();
    };

    function startWork() {
      turn = 0;
      done = false;
      var state = _.clone(startState);
      console.log("Beginning");

      $ctrl.output.push(buildOutput(state));
      $ctrl.solution.push(state);

      while(didWeWin(state)) {
        turn++;
        console.log(`Starting turn ${turn}`);
        console.log(`Cur state is:`,state);

        state = bruteForce(state);

        console.log(`New state is:`,state);

        $ctrl.output.push(buildOutput(state));
        $ctrl.solution.push(state);
      }

      console.log("states",$ctrl.states);
      console.log("solution",$ctrl.solution);
    }

    function didWeWin(sta) {
      return (!_.isEqual(sta,endState) && turn <= limiter && !done);
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
      // Calculate all states from this states
      var states = calculateStates(sta);

      if(states.length === 0) {
        done = true;
      }
      else {
        // Fill out state graph
        updateStateGraph(sta,states);

        // Choose next step
        var nextState = _.sample(states);

        // Update solution
        return nextState;
      }
    }

    function calculateStates(sta) {
      var states = [];

      _.forEach(sta,function(peg,index) {
        if(peg == "b") {
          // Check for move right and jump right
          if(index < 9 && sta[index+1] == "e") {
            // Move right
            states.push(movePeg(sta,index,index+1));
          }
          else if(index < 8 && (sta[index+1] == "b" || sta[index+1] == "r") && sta[index+2] == "e") {
            // Jump right
            states.push(movePeg(sta,index,index+2))
          }
        }
        else if(peg == "r") {
          // Check for move left and jump left
          if(sta[index-1] == "e") {
            // Move left
            states.push(movePeg(sta,index,index-1));
          }
          else if((sta[index-1] == "b" || sta[index-1] == "r") && sta[index-2] == "e") {
            // Jump left
            states.push(movePeg(sta,index,index-2));
          }
        }
        else if(peg == "e") {
          // Don't do anything
        }
        else {
          // What on earth happened?
          console.warn("Invalid peg on the board.  What did Eli do?");
        }
      });

      return states;
    }

    function movePeg(sta,i,j) {
      var state = _.clone(sta);
      var p1 = state[i];
      state[i] = state[j];
      state[j] = p1;
      return state;
    }

    function stateHash(sta) {
      // Computets the hash of the state passed.  The hash consists of a string
      // representing the pegs on the board.
      var hash = "";
      _.forEach(sta,function(p) {
        hash += p;
      });
      return hash;
    }

    function updateStateGraph(currentState,newStates) {
      var currentStateHash = stateHash(currentState);
      _.forEach(newStates,function(sta) {
        // Compute the hash of the state
        var hash = stateHash(sta);

        // Add the new state to the neighbors list if it is not already there
        if(!$ctrl.states[currentStateHash].neighbors,hash) {
          $ctrl.states[currentStateHash].neighbors.push(hash);
        }

        // Add the state to the states list if it does not exist.  If the new
        // state does exist, update it's neighbors list
        if(!_.isObject($ctrl.states[hash])) {
          $ctrl.states[hash] = {
            board: sta,
            neighbors: [currentStateHash]
          }
        }
        else {
          // Update the neighbor list if need be
          if(!_.includes($ctrl.states[hash].neighbors,currentStateHash)) {
            $ctrl.states[hash].neighbors.push(currentState);
          }
        }
      });
    }
  }
})();
