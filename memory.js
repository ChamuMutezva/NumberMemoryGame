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

let tempArray = [];
let stepCount = 0;
let count = 0;
let sec = 0;
let min = 0;
let interval;

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

// hide the modal start screen to start the game
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
    stepsTaken.innerHTML = `00`

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

const populateBoard = () => {
    selectTheme()
    selectGridSize()
    shufflePlayCards()

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

    if (inProgress == true) {
        return;
    } else {
        stepCount = 0;
    }

    if (gameEnd == true) {
        return;
    }


    startTimer();
    inProgress = true;

    if (inProgress) {
        const cards = Array.from(document.querySelectorAll(".game-buttons"));
        cards.forEach((elem, index) => {
            elem.classList.remove("disable-cards")
            //selectFour === true ? elem.innerHTML = numArray4[index] : elem.innerHTML = numArray6[index];
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


function compareCards(currNum) {
    const stepsTaken = document.querySelector(".stepsCount")
    if (tempArray.length <= 2) { // changed tempArray.length <= 2 to the current
        tempArray.push(currNum);
    }

    if (tempArray.length === 2) {
        stepCount += 1;
        stepCount < 10 ? stepsTaken.innerHTML = `0${stepCount}` :
            stepsTaken.innerHTML = `${stepCount}`
        console.log(stepCount)

        if (tempArray[0].innerHTML == tempArray[1].innerHTML) {
            tempArray[0].classList.add('match');
            tempArray[1].classList.add('match');
            tempArray = [];
            endGame();
        } else {
            console.log("No match found");
            setTimeout(function () {
                console.log("Remove opened cards");
                tempArray[0].classList.toggle('open-cards');
                tempArray[1].classList.toggle('open-cards');
                tempArray = [];
            }, 500);
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

    sec < 10 ? [minHand.innerHTML = `0${min}`, secHand.innerHTML = `0${sec}`, fullTime = `0${min}:0${sec}`] :
        [minHand.innerHTML = `0${min}`, secHand.innerHTML = `${sec}`, fullTime = `0${min}:${sec}`]

    //Stop timer at 5 minutes;
    if (min >= 5) {
        let totalSeconds = (min * 60) + sec
        console.log(totalSeconds)
        //  endGame();
        modalEnd.classList.remove("hide");
        modalEndTitle.innerHTML = "Game over. Mission not complete";
        modalEndContent.innerHTML = "Better lucky next time";
        stepsTakenValue.innerHTML = stepCount;
        timeTakenValue.innerHTML = fullTime;
        overlay.classList.add("overlay-show");
        resetGame();
    }

}

function endGame() {
    const cards = Array.from(document.querySelectorAll(".game-buttons"));
    const modalEnd = document.querySelector(".modal-end");
    // const modalEndContent = document.querySelector(".modal-end-content");
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

