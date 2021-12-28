const numArray4 = [1, 2, 3, 4, 5, 4, 3, 2, 1, 5, 6, 7, 8, 8, 6, 7]; // 4x4 array
const numArray6 = [1, 2, 3, 4, 5, 4, 3, 2, 1, 5, 6, 7, 8, 8, 6, 7, 18, 17,
    16, 15, 14, 13, 12, 11, 10, 9, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9]; // 6x6 array

const iconArray4 = [
    `<i class="fas fa-ambulance"></i>`, `<i class="fab fa-accessible-icon"></i>`, `<i class="fab fa-amazon"></i>`,
    `<i class="fab fa-apple"></i>`, `<i class="fas fa-atlas"></i>`, `<i class="fas fa-balance-scale"></i>`,
    `<i class="fas fa-bell"></i>`, `<i class="fab fa-blackberry"></i>`, `<i class="fas fa-ambulance"></i>`,
    `<i class="fab fa-accessible-icon"></i>`, `<i class="fab fa-amazon"></i>`, `<i class="fab fa-apple"></i>`,
    `<i class="fas fa-atlas"></i>`, `<i class="fas fa-balance-scale"></i>`, `<i class="fas fa-bell"></i>`,
    `<i class="fab fa-blackberry"></i>`
]

const iconArray6 = [
    `<i class="fas fa-ambulance"></i>`, `<i class="fab fa-accessible-icon"></i>`, `<i class="fab fa-amazon"></i>`,
    `<i class="fab fa-apple"></i>`, `<i class="fas fa-atlas"></i>`, `<i class="fas fa-balance-scale"></i>`,
    `<i class="fas fa-bell"></i>`, `<i class="fab fa-blackberry"></i>`, `<i class="fas fa-bug"></i>`,
    `<i class="fas fa-camera"></i>`, `<i class="fab fa-cc-visa"></i>`, `<i class="fas fa-clinic-medical"></i>`,
    `<i class="fas fa-compass"></i>`, `<i class="fas fa-couch"></i>`, `<i class="far fa-copy"></i>`,
    `<i class="fas fa-database"></i>`, `<i class="fab fa-git"></i>`, `<i class="fab fa-grunt"></i>`,
    `<i class="fas fa-ambulance"></i>`, `<i class="fab fa-accessible-icon"></i>`, `<i class="fab fa-amazon"></i>`,
    `<i class="fab fa-apple"></i>`, `<i class="fas fa-atlas"></i>`, `<i class="fas fa-balance-scale"></i>`,
    `<i class="fas fa-bell"></i>`, `<i class="fab fa-blackberry"></i>`, `<i class="fas fa-bug"></i>`,
    `<i class="fas fa-camera"></i>`, `<i class="fab fa-cc-visa"></i>`, `<i class="fas fa-clinic-medical"></i>`,
    `<i class="fas fa-compass"></i>`, `<i class="fas fa-couch"></i>`, `<i class="far fa-copy"></i>`,
    `<i class="fas fa-database"></i>`, `<i class="fab fa-git"></i>`, `<i class="fab fa-grunt"></i>`
]

const modalMenuControl = document.querySelector(".modal-menu-control");
const container = document.querySelector(".container");
const restartButtons = document.querySelectorAll(".restart-button");
let resumeGameBtn = document.querySelector(".resume-game-button");
let resetBtn = document.querySelector(".reset-button");
const setupNewGameButton = document.querySelector(".setup-new-game-button");
const menuSettings = document.querySelector(".secondary-menu-button");

let selectFour = true; // grid size selector 4X4 or 6X6
let inProgress = false; // to start the game
let gameEnd = false;
let reStartGame = false;
let isPaused = false;
let selectedTheme = "num";
let selectedGrid = "";
let selectedPlayer = 1;

let lonePlayer = true;
let doublePlayer = false;
let trioPlayer = false;
let quadPlayer = false;

let tempArray = []; // to hold a max of 2 cards to be matched and reset to empty. 
let stepCount = 0; // count the number of moves during the game
let count = 0; // used to find if all combinations has been meet to win the game at (array.length / 2)
let sec = 0;
let min = 0;
let interval;
let tempIndex = 0;

const scorecard = {
    "player1": 0,
    "player2": 0,
    "player3": 0,
    "player4": 0
}


resetBtn.addEventListener("click", () => {
    document.querySelector(".game-section").classList.add("modal-menu-toggle")
    document.querySelector(".modal-start").classList.remove("hide-modal-menu-control")
    document.querySelector(".overlay").classList.remove("overlay-show")
    resetGame()
    selectTheme()
    selectGridSize()
    shufflePlayCards()
    populateBoard();
    myTimer();
})

restartButtons.forEach(restartButton => {

    restartButton.addEventListener("click", () => {
        // document.querySelector(".modal-start").classList.remove("hide-modal-menu-control")
        document.querySelector(".overlay").classList.remove("overlay-show")
        document.querySelector(".game-section").classList.add("modal-menu-toggle")
        resetGame();
        reStartGame = true;
        startGame();
    })

})

modalMenuControl.addEventListener("click", () => {
    document.querySelector(".modal-start").classList.add("hide-modal-menu-control");
    container.innerHTML = "";
    shufflePlayCards();
    populateBoard();
    startGame();
})

function resetGame() {
    const minHand = document.getElementById("minute");
    const secHand = document.getElementById("seconds");
    const modal = document.querySelector(".modal-end");
    const stepsTaken = document.querySelector(".stepsCount")
    const cards = Array.from(document.querySelectorAll(".game-buttons"));

    tempArray = [];
    count = 0;
    stepCount = 0;
    sec = 0;
    min = 0;
    inProgress = false;
    gameEnd = false;
    reStartGame = false;
    isPaused = false;

    clearInterval(interval);
    modal.classList.add("hide");
    stepsTaken == ! null ? stepsTaken.innerHTML = `00` : null;

    cards.forEach(elem => {
        elem.classList.remove("open-cards")
        elem.classList.remove("match")
        elem.classList.add("disable-cards")
    })

}

function shufflePlayCards() {
    shuffle(numArray4)
    shuffle(numArray6)
    shuffle(iconArray4)
    shuffle(iconArray6);
    /*
    console.log(selectedTheme) 
   if (selectedTheme === "num") {
       selectFour ? shuffle(numArray4) : shuffle(numArray6);
   } else if (selectedTheme === "icon") {
       selectFour ? shuffle(iconArray4) : shuffle(iconArray6);
   }*/
}

// Shuffle function from http://stackoverflow.com/a/2450976
// inspiration drawn from https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

const createBoardElements = (el) => {
    const button = document.createElement("button")
    button.classList.add("game-buttons")
    button.innerHTML = el;
    container.appendChild(button)
}

const singlePlayerTemplate =
    `<div class="time-keeper">
        <h3 class="time-title">Time</h3>
        <div class="time-record">
             <span id="minute">00</span>
             <span id="divider">:</span>
             <span id="seconds">00</span>
        </div>
     </div>
     <div class="steps-time-taken">
          <h3 class="steps-title">Moves</h3>
          <span class="stepsCount">00</span>
      </div>`

const doublePlayerTemplate =
    `<div class="players flex2">
         <h3 class="sr-only">2 players involved in this game</h3>
        
         <div data-id="1" class="player player1 active-player">
             <h4>P1</h4>
             <p class="score score1">0</p>
         </div>
         <div data-id="2" class="player player2">
             <h4>P2</h4>
             <p class="score score2">0</p>
         </div>
    </div>`

const triplePlayerTemplate =
    `<div class="players flex2">
         <h3 class="sr-only">2 players involved in this game</h3>
         <div data-id="1" class="player player1 active-player">
             <h4>P1</h4>
             <p class="score score1">0</p>
         </div>
         <div data-id="2" class="player player2">
             <h4>P2</h4>
             <p class="score score2">0</p>
         </div>
         <div data-id="3" class="player player3">
             <h4>P3</h4>
             <p class="score score3">0</p>
         </div>
    </div>`

const quadPlayerTemplate =
    `<div class="players flex2">
         <h3 class="sr-only">2 players involved in this game</h3>
         <div data-id="1" class="player player1 active-player">
             <h4>P1</h4>
             <p class="score score1">0</p>
         </div>
         <div data-id="2" class="player player2">
             <h4>P2</h4>
             <p class="score score2">0</p>
         </div>
         <div data-id="3" class="player player3">
             <h4>P3</h4>
             <p class="score score3">0</p>
         </div>
         <div data-id="4" class="player player4">
             <h4>P4</h4>
             <p class="score score4">0</p>
         </div>
    </div>`

const selectTheme = () => {
    const themes = document.getElementsByName("theme")
    for (const theme of themes) {
        if (theme.checked) {
            selectedTheme = theme.value;
        }
    }
}

const selectGridSize = () => {
    const gridSize = document.getElementsByName("gridSize")
    for (const grid of gridSize) {
        if (grid.checked) {
            selectedGrid = grid.value
        }
    }

}

const selectNumPlayers = () => {
    const players = document.getElementsByName("players");

    for (const player of players) {
        if (player.checked) {
            selectedPlayer = parseInt(player.value)
        }
    }
    console.log(selectedPlayer)
}

const populateBoard = () => {
    selectTheme()
    selectGridSize()
    shufflePlayCards()
    selectNumPlayers()

    if (selectedTheme === "num") {

        if (selectedGrid === "4") {
            selectFour = true;
            container.classList.add("containerGrid4")
            container.classList.remove("containerGrid6")
            numArray4.forEach(num => {
                createBoardElements(num)
            })
        } else {
            selectFour = false;
            container.classList.add("containerGrid6")
            container.classList.remove("containerGrid4")
            numArray6.forEach(num => {
                createBoardElements(num)
            })
        }

    } else {
        if (selectedGrid === "4") {
            selectFour = true;
            container.classList.add("containerGrid4")
            container.classList.remove("containerGrid6")
            iconArray4.forEach(icon => {
                createBoardElements(icon)
            })
        } else {
            selectFour = false;
            container.classList.add("containerGrid6")
            container.classList.remove("containerGrid4")
            iconArray6.forEach(icon => {
                createBoardElements(icon)
            })
        }

    }

}

populateBoard()

function startGame() {
    const timeStepsRecord = document.querySelector(".time-steps-record");

    if (inProgress == true) {
        return;
    } else {
        stepCount = 0;
    }

    if (gameEnd == true) {
        return;
    }

    if (selectedPlayer === 1) {
        timeStepsRecord.innerHTML = singlePlayerTemplate;
        startTimer();
        inProgress = true;
        lonePlayer = true;
        doublePlayer = false;
        trioPlayer = false;
        quadPlayer = false;
        playGame()
    } else if (selectedPlayer === 2) {
        console.log(selectedPlayer)
        timeStepsRecord.innerHTML = doublePlayerTemplate;
        inProgress = true;
        lonePlayer = false;
        doublePlayer = true;
        trioPlayer = false;
        quadPlayer = false;
        playGame();
    } else if (selectedPlayer === 3) {
        timeStepsRecord.innerHTML = triplePlayerTemplate;
        inProgress = true;
        lonePlayer = false;
        doublePlayer = false;
        trioPlayer = true;
        quadPlayer = false;
        playGame();
    } else if (selectedPlayer === 4) {
        timeStepsRecord.innerHTML = quadPlayerTemplate;
        inProgress = true;
        lonePlayer = false;
        doublePlayer = false;
        trioPlayer = false;
        quadPlayer = true;
        playGame();
    }


}

const playGame = () => {
    if (inProgress) {
        const cards = Array.from(document.querySelectorAll(".game-buttons"));
        cards.forEach((elem) => {
            elem.classList.remove("disable-cards")
            elem.addEventListener("click", function (event) {
                if (elem.classList.contains('open-cards')) {
                    return;
                } else {
                    elem.classList.add('open-cards');
                    compareCards(event.target);
                }
            });

        })
    }
}

const stepsTimerChecker = (numberOfSteps) => {
    const stepsTaken = document.querySelector(".stepsCount")
    numberOfSteps < 10 ? stepsTaken.innerHTML = `0${numberOfSteps}` :
        stepsTaken.innerHTML = `${numberOfSteps}`
}

const numberOfPlayers = () => {
    const players = Array.from(document.querySelectorAll(".player"));

    players.forEach((player, index) => {
        player.classList.remove("active-player")
    })

    if (tempIndex < players.length - 1) {
        tempIndex += 1;
    } else {
        tempIndex = 0
    }
    console.log(tempIndex)
    players[tempIndex].classList.add("active-player")
}

const playersScore = () => {
    const players = Array.from(document.querySelectorAll(".player"));
    let targetDiv;
    let id;
    let calcID;
    for (const player of players) {
        if (player.classList.contains("active-player")) {
            targetDiv = player;
            id = targetDiv.getAttribute("data-id")
        }
    }

    const scoreUpdate = document.querySelector(`.score${id}`)
    calcID = `player${id}`
    console.log(calcID)
    scorecard[calcID] = scorecard[calcID] += 1
    console.log(scorecard)
    console.log(targetDiv)
    console.log(id)
    scoreUpdate.innerHTML = scorecard[calcID]
}

function compareCards(currNum) {
    if (tempArray.length <= 2) { // changed tempArray.length <= 2 to the current
        tempArray.push(currNum);
    }

    if (tempArray.length === 2) {
        stepCount += 1;

        if (lonePlayer) {
            stepsTimerChecker(stepCount);
            // numberOfPlayers();
        }

        if (doublePlayer) {
            console.log("two players involved")
            //  numberOfPlayers()
        }

        if (trioPlayer) {
            console.log("three players battling it out")
            //  numberOfPlayers()
        }

        if (quadPlayer) {
            console.log("four people game")
            // numberOfPlayers()
        }
        /*

        stepCount < 10 ? stepsTaken && (stepsTaken.innerHTML = `0${stepCount}`) :
            stepsTaken.innerHTML = `${stepCount}`
        console.log(stepCount)
        */
        if (tempArray[0].innerHTML == tempArray[1].innerHTML) {
            tempArray[0].classList.add('match');
            tempArray[1].classList.add('match');
            tempArray = [];
            playersScore();
            endGame();
        } else {
            // console.log("No match found");
            setTimeout(function () {
                //   console.log("Remove opened cards");
                tempArray[0].classList.toggle('open-cards');
                tempArray[1].classList.toggle('open-cards');
                tempArray = [];
            }, 500);
            numberOfPlayers()
        }

    }

}

function startTimer() {
    if (inProgress == false) {
        interval = setInterval(myTimer, 1000);
    } else {
        return;
    }

}

function myTimer() {
    const overlay = document.querySelector(".overlay");
    const modalEnd = document.querySelector(".modal-end");
    const modalEndContent = document.querySelector(".modal-end-content");
    const modalEndTitle = document.querySelector(".modal-end-title");
    const timeTakenValue = document.querySelector(".time-taken-value");
    const stepsTakenValue = document.querySelector(".steps-taken-value");
    const minHand = document.getElementById("minute");
    const secHand = document.getElementById("seconds");
    let fullTime = 0;

    sec++;
    if (sec > 59) {
        min++;
        sec = 0;
    }

    // minHand and secHand can be null if the singleTemplate was not selected 
    if (minHand === null || secHand === null) {
        return
    }

    sec < 10 ?
        [minHand.innerHTML = `0${min}`, secHand.innerHTML = `0${sec}`, fullTime = `0${min}:0${sec}`] :
        [minHand.innerHTML = `0${min}`, secHand.innerHTML = `${sec}`, fullTime = `0${min}:${sec}`]

    //Stop timer at 5 minutes;
    if (min >= 5) {
        let totalSeconds = (min * 60) + sec;
        const tempStepCount = stepCount;
        console.log(totalSeconds)
        resetGame();
        //  endGame();
        modalEnd.classList.remove("hide");
        modalEndTitle.innerHTML = "Game over. Mission not complete";
        modalEndContent.innerHTML = "Better lucky next time";
        stepsTakenValue.innerHTML = tempStepCount;
        timeTakenValue.innerHTML = fullTime;
        overlay.classList.add("overlay-show");

    }

}

function endGame() {
    const cards = Array.from(document.querySelectorAll(".game-buttons"));
    const modalEnd = document.querySelector(".modal-end");
    const modalEndContent = document.querySelector(".modal-end-content");
    const modalEndTitle = document.querySelector(".modal-end-title");
    const arrayLength = selectFour === true ? numArray4.length : numArray6.length;
    const timeTakenValue = document.querySelector(".time-taken-value");
    const stepsTakenValue = document.querySelector(".steps-taken-value");
    const overlay = document.querySelector(".overlay");
    // let totalSeconds = (min * 60) + sec

    if (count < arrayLength / 2) {
        count = count + 1;
    }

    if (count === arrayLength / 2) {
        // console.log("Welldone , game ended");
        stepsTakenValue.innerHTML = stepCount;
        modalEndTitle.innerHTML = "Game over. here is how you did it...";
        modalEndContent.innerHTML = "You are a winner!!";
        overlay.classList.add("overlay-show");

        if (sec < 10) {
            timeTakenValue.innerHTML = `0${min}:0${sec}`;
        } else {
            timeTakenValue.innerHTML = `0${min}:${sec}`;
        }

        cards.forEach((elem) => {
            if (elem.classList.contains('open-cards')) {
                return;
            } else {
                elem.classList.add('open-cards');
            }

        })

        inProgress = false;
        gameEnd = true;
        clearInterval(interval);
        modalEnd.classList.toggle("hide");

        cards.forEach(elem => {
            elem.removeEventListener('click', function (event) {
                return;
            })
        })

    }
}


setupNewGameButton.addEventListener("click", function () {
    const modalEnd = document.querySelector(".modal-end");
    console.log("set up new game button")
    document.querySelector(".modal-start").classList.remove("hide-modal-menu-control")
    const overlay = document.querySelector(".overlay");
    overlay.classList.remove("overlay-show");
    modalEnd.classList.add("hide");
    resetGame()
    myTimer()
})

menuSettings.addEventListener("click", () => {
    resumePausedGame()
})

resumeGameBtn.addEventListener("click", () => {
    resumePausedGame()
})

const resumePausedGame = () => {
    const overLay = document.querySelector(".overlay")
    document.querySelector(".game-section").classList.toggle("modal-menu-toggle");
    isPaused = !isPaused;
    console.log(isPaused)
    isPaused ?
        [clearInterval(interval), overLay.classList.add("overlay-show")] :
        [interval = setInterval(myTimer, 1000), overLay.classList.remove("overlay-show")];
}


/*

const app = new Realm.App({ id: "<Your App ID>" });
const credentials = Realm.Credentials.anonymous();
try {
  const user = await app.logIn(credentials);
} catch(err) {
  console.error("Failed to log in", err);
}
    */

