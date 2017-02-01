function cleanTable() {
  $("#message").text("");
  $("#computer, #player").removeClass("playing");
  var computer = $("#computer").data("account");
  var player = $("#player").data("account");
  computer.won = false;
  player.won = false;  
  for (var i = 1; i <= 9; i++) {
    var idSquare = "#" + (i.toString());
    $(idSquare).text("");
    $(idSquare).removeClass("three-won");
  }
}

function findPositionToPlay(){
  console.log("in playStrategy");
  var symbol = $("#computer").data("account").symbol;
  var center = $("#5").text();
  var corner1 = $("#1").text();
  var corner2 = $("#3").text();
  var corner3 = $("#7").text();
  var corner4 = $("#9").text();
  if (center === "") {
     return "#5";
  } else if (corner1 === "") {
     return "#1";
  } else if (corner2 === "") {
     return "#3";
  } else if (corner3 === "") {
     return "#7";
  } else if (corner4 === "") {
     return "#9";
  } else {
    for (var i = 2; i <= 8; i+=2) {
      if ($("#" + i.toString()).text() === "") {        
        return "#" + i.toString();
        console.log($("#" + i.toString()).text());
        break;
      }
    }
  }
}

function findEmptyPosition(symbol) {
  console.log("in findEmptyPosition");  
  var winCombination = [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], ["1", "4", "7"], ["2", "5", "8"], ["3", "6", "9"], ["1", "5", "9"], ["3", "5", "7"]];
  var i = 0;  
  while (i < winCombination.length) {
    var combination = winCombination[i];
    var countSymbolInCombination = 0;
    var listPositions = [];
    var listIdEmpty = [];    
    for (var j = 0; j < combination.length; j++) {
      var cellPosition = $("#" + combination[j])
      var contentInCell = cellPosition.text();      
      if (contentInCell === symbol) {
        countSymbolInCombination++;
        listPositions.push(cellPosition);
      } else if (contentInCell === "") {
        listIdEmpty.push("#" + combination[j]);
        listPositions.push(cellPosition);
      }
    }    
    var numOfEmptyCells = listIdEmpty.length;
    console.log(countSymbolInCombination + " and one empty: " + numOfEmptyCells);
    if (countSymbolInCombination === 2 && numOfEmptyCells === 1) {
      
      return {emptyPosition: listIdEmpty[0], cellPositionToColor: listPositions};
    } 
    i++;
  } return false;
}

function computeAnswer() {
  var computer = $("#computer").data("account");
  var player = $("#player").data("account");
  var positionToWin = findEmptyPosition(computer.symbol); // an object or false
  var positionToBlock = findEmptyPosition(player.symbol); //false or the "#id" to block player
  
  if (positionToWin !== false) {
    var idCellToWin = findEmptyPosition(computer.symbol).emptyPosition; //object.emptyPosition
    var cellIdListToColor = findEmptyPosition(computer.symbol).cellPositionToColor; 
    
    $(idCellToWin).text(computer.symbol);
    $("#message").text("Computer won!");
    for (var i = 0; i < cellIdListToColor.length; i++) {
      var cellId = cellIdListToColor[i];
      $(cellId).addClass("three-won");
    }
    computer.won = true;
    setTimeout(function() { //they start next game
      $("#computer-score").text(++computer.score);
      flipCoinToStart(); 
    }, 4000);
 
  } else if (positionToBlock !== false) {
      var idCellToBlock = findEmptyPosition(player.symbol).emptyPosition;
      $(idCellToBlock).text(computer.symbol);
      var isATie = checkIfTie();
      if (!isATie) {
        playGame(player); //just play their turn
      } else {
        $("#message").text("It is a tie.");
        setTimeout(function() {
          console.log("it was a tie");
          $("#message").text("");;
          flipCoinToStart();
        }, 4000);
      }
  
  } else {
      var positionId = findPositionToPlay();
      $(positionId).text(computer.symbol);
      var isATie = checkIfTie();
      if (!isATie) {
        playGame(player);
      } else {
        setTimeout(function() {
          console.log("it was a tie");
          flipCoinToStart();
        }, 4000);
      }
  }
}

function checkIfTie() {
  console.log("in checkIfTie");
  var isFinished = true;  
  for (var i = 1; i <= 9; i++) {
    var idSquare = "#" + (i.toString());
    var cellContent = $(idSquare).text();
    if (cellContent === "") {
      isFinished = false;
    }
  }  
  if (isFinished) {$("#message").text("It is a tie.");
  }
  return (isFinished) ? true : false;
}

function checkIfPlayerWon(symbol) {
  var winCombination = [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], ["1", "4", "7"], ["2", "5", "8"], ["3", "6", "9"], ["1", "5", "9"], ["3", "5", "7"]];
  var won = false;
  var i = 0;
 
  while (i < winCombination.length && won === false) {
    var combination = winCombination[i];
    var countSymbol = 0;    
    for (var j = 0; j < combination.length; j++) {
      var content = $("#"+combination[j]).text();
      if (content === symbol) {
        countSymbol++;
        console.log("countSymbol is : " + countSymbol);
      }
    }
    if (countSymbol === 3) {
      won = true;
      break;
    }
    i++;
  } return won; // true or false
}

function addSymbol(countdown) {
  return function(event) {
    clearTimeout(countdown);
    var player = $("#player").data("account");
    var computer = $("#computer").data("account");
    var content = $(event.target).text();
    var iCanClick = !computer.won && !player.won;
    console.log("can I click? - " + iCanClick);
    if (content === "" && iCanClick) {
      var symbol = player.symbol;
      $(event.target).text(symbol);

      var playerWon = checkIfPlayerWon(symbol);
      var isATie = checkIfTie();
      
      if (playerWon) {       
        setTimeout(function() {
          $("#player-score").text(++player.score);
          flipCoinToStart();}, 4000); //actually start the game
        return false; 
      
      } else if (isATie) { 
        $("#message").text("It is a tie.");
        setTimeout(function() {
          $("#message").text("");
          flipCoinToStart();}, 4000);
        return false;    
     
      } else {
          playGame(computer); //plays next turn
      }
    }
  }
}

function playTurn() {
  var countdown = setTimeout( function(){
    var computer = $("#computer").data("account");
    $("#message").text("You lost, time run out!");
    console.log("You lost.");
    $("#computer-score").text(++computer.score);
    setTimeout(function() {flipCoinToStart();}, 2000);
  }, 6000);
  $(".square").click(addSymbol(countdown));

}

function playGame(currentPlayer) { //to call every turn
  if (currentPlayer.computer) {
    $("#player").removeClass("playing");
    $("#computer").addClass("playing");
    setTimeout( function() {
      computeAnswer();
    }, 1000);
  } else {
    $("#computer").removeClass("playing");
    $("#player").addClass("playing");
    playTurn();
  }
}

function flipCoinToStart() {
  cleanTable();
  var player = $("#player").data("account");
  var computer = $("#computer").data("account");
  var first = (Math.floor((Math.random() * 2) + 1) === 1) ? player : computer;
  console.log("the first to play is the computer? -> " + first.computer);
  playGame(first);
}

function createComputerAccount(computerSymbol) {
  var computer = {symbol: computerSymbol,
                  name: "computer",
                  score: 0,
                  computer: true,
                  won: false,
                  };
  $("#computer").data("account", computer);
} 

function createPlayerAccount(playerSymbol) {
  var player = {symbol: playerSymbol,
                name: "You",
                score: 0,
                computer: false,
                won: false,
                };
  $("#player").data("account", player);
}
  
function setUpGame(event) {  
  var playerSymbol = $(event.target).attr("id");
  var computerSymbol = (playerSymbol === "x") ? "o" : "x"; 
  $("#ask-symbol").hide();
  $(".container").show();
  createPlayerAccount(playerSymbol);
  createComputerAccount(computerSymbol);
  flipCoinToStart();
}

function main() {
  $("#ask-symbol").show();
  $(".container").hide();
  $("#x, #o").click(setUpGame);
}

$(document).ready(main);