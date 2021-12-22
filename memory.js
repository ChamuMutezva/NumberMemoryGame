const numArray4 = [1, 2, 3, 4, 5, 4, 3, 2, 1, 5, 6, 7, 8, 8, 6, 7]; // 4x4 array
const numArray6 = [1, 2, 3, 4, 5, 4, 3, 2, 1, 5, 6, 7, 8, 8, 6, 7, 18, 17,
    16, 15, 14, 13, 12, 11, 10, 9, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9]; // 6x6 array

const modalMenuControl = document.querySelector(".modal-menu-control");
const container = document.querySelector(".container");
const restartButtons = document.querySelectorAll(".restart-button");
let resumeGameBtn = document.querySelector(".resume-game-button");
let resetBtn = document.querySelector(".reset-button");
const setupNewGameButton = document.querySelector(".setup-new-game-button");
const menuSettings = document.querySelector(".seccondary-menu-button");

let selectFour = true; // grid size selector 4X4 or 6X6
let inProgress = false; // to start the game
let gameEnd = false;
let reStartGame = false;
let isPaused = false;

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
    document.querySelector(".modal-start").classList.add("hide-modal-menu-control")
    container.innerHTML = ""
    populateBoard()
    startGame()
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

function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
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

const populateBoard = () => {
    const gridSize = document.getElementsByName("gridSize")
    gridSize.forEach((grid) => {
        if (grid.checked === true) {
            let selectedGrid = grid.value;
            console.log(selectedGrid)
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
        }


    })

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

    if (reStartGame === false) {
        selectFour === true ? shuffle(numArray4) : shuffle(numArray6);
    }

    startTimer();
    inProgress = true;

    if (inProgress) {
        const cards = Array.from(document.querySelectorAll(".game-buttons"));
        cards.forEach((elem, index) => {
            elem.classList.remove("disable-cards")
            selectFour === true ? elem.innerHTML = numArray4[index] : elem.innerHTML = numArray6[index];
            elem.addEventListener("click", function (event) {
                if (elem.classList.contains('open-cards')) {
                    // console.log('Card already opened, click another card');
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

    // const cards = Array.from(document.querySelectorAll(".game-buttons"));
    sec++;

    if (sec > 59) {
        min++;
        sec = 0;
    }

    sec < 10 ? [minHand.innerHTML = `0${min}`, secHand.innerHTML = `0${sec}`, fullTime = `0${min}:0${sec}`] :
        [minHand.innerHTML = `0${min}`, secHand.innerHTML = `${sec}`, fullTime = `0${min}:${sec}`]

    //Stop timer at 2 minutes;
    if (min >= 2) {
        let totalSeconds = (min * 60) + sec
        console.log(totalSeconds)
        resetGame();
        //  endGame();
        modalEnd.classList.remove("hide");
        modalEndTitle.innerHTML = "Game over. Mission not complete";
        modalEndContent.innerHTML = "Better lucky next time";
        stepsTakenValue.innerHTML = stepCount;
        timeTakenValue.innerHTML = fullTime;
        overlay.classList.add("overlay-show");
    }

}

function endGame() {
    const cards = Array.from(document.querySelectorAll(".game-buttons"));
    const modalEnd = document.querySelector(".modal-end");
    const modalEndContent = document.querySelector(".modal-end-content");
    const arrayLength = selectFour === true ? numArray4.length : numArray6.length;
    const timeTakenValue = document.querySelector(".time-taken-value");
    const stepsTakenValue = document.querySelector(".steps-taken-value");
    const overlay = document.querySelector(".overlay");
    let totalSeconds = (min * 60) + sec
    console.log(totalSeconds)

    if (count < arrayLength / 2) {
        count = count + 1;
    }

    if (count === arrayLength / 2) {
        console.log("Welldone , game ended");
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
                console.log(elem);
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
    isPaused ? [clearInterval(interval), overLay.classList.add("overlay-show")] :
        [interval = setInterval(myTimer, 1000), overLay.classList.remove("overlay-show")];
}
