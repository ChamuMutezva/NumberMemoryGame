const numArray4 = [1, 2, 3, 4, 5, 4, 3, 2, 1, 5, 6, 7, 8, 8, 6, 7]; // 4x4 array
const numArray6 = [1, 2, 3, 4, 5, 4, 3, 2, 1, 5, 6, 7, 8, 8, 6, 7, 18, 17,
    16, 15, 14, 13, 12, 11, 10, 9, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9]; // 6x6 array

const modalMenuControl = document.querySelector(".modal-menu-control");
const container = document.querySelector(".container");
const restartButton = document.querySelector(".restart-button");
let playBtn = document.getElementById("start-game");
let resetBtn = document.querySelector(".reset-button");
let selectFour = true; // grid size selector 4X4 or 6X6
let clicked = false; // to start the game
let gameEnd = false;
let tempArray = [];
let stepCount = 0;
let count = 0;
let sec = 0;
let min = 0;
let interval;

playBtn.addEventListener("click", () => {
    startGame()
})

resetBtn.addEventListener("click", () => {
    document.querySelector(".modal-start").classList.remove("hide-modal-menu-control")
    resetGame()
    myTimer();
})

restartButton.addEventListener("click", () => {
    document.querySelector(".modal-start").classList.remove("hide-modal-menu-control")
    document.querySelector(".overlay").classList.remove("overlay-show")
    resetGame()
})

// hide the modal start screen to start the game
modalMenuControl.addEventListener("click", () => {
    document.querySelector(".modal-start").classList.add("hide-modal-menu-control")
    container.innerHTML = ""
    populateBoard()
})

function resetGame() {
    const minHand = document.getElementById("minute");
    const secHand = document.getElementById("seconds");
    const modal = document.querySelector(".modal-end");
    const cards = Array.from(document.querySelectorAll(".game-buttons"));

    tempArray = [];
    count = 0;
    sec = 0;
    min = 0;
    clicked = false;
    gameEnd = false;
    clearInterval(interval);
    modal.classList.add("hide");

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

    if (clicked == true) {
        return;
    } else {
        stepCount = 0;
    }

    if (gameEnd == true) {
        return;
    }

    selectFour === true ? shuffle(numArray4) : shuffle(numArray6);
    startTimer();
    clicked = true;

    if (clicked) {
        const cards = Array.from(document.querySelectorAll(".game-buttons"));
        cards.forEach((elem, index) => {
            elem.classList.remove("disable-cards")          
            selectFour === true ? elem.innerHTML = numArray4[index] : elem.innerHTML = numArray6[index];
            elem.addEventListener("click", function (event) {
                if (elem.classList.contains('open-cards')) {
                    console.log('Card already opened, click another card');
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
    if (tempArray.length <= 2) {
        tempArray.push(currNum);
    }

    if (tempArray.length === 2) {
        stepCount += 1;
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
    if (clicked == false) {
        interval = setInterval(myTimer, 1000);
    } else {
        return;
    }

}

function myTimer() {
    const minHand = document.getElementById("minute");
    const secHand = document.getElementById("seconds");
    const cards = Array.from(document.querySelectorAll(".game-buttons"));
    sec++;

    if (sec > 59) {
        min++;
        sec = 0;
    }

    if (sec < 10) {
        minHand.innerHTML = `0${min}`;
        secHand.innerHTML = `0${sec}`;
    } else {
        minHand.innerHTML = `0${min}`;
        secHand.innerHTML = `${sec}`;
    }


    //Stop timer at 2 minutes;
    if (min >= 2) {       
        endGame();
        // resetGame();
    }
}

function endGame() {
    const cards = Array.from(document.querySelectorAll(".game-buttons"));
    let modalEnd = document.querySelector(".modal-end");
    const modalEndContent = document.querySelector(".modal-end-content");
    const setupNewGameButton = document.querySelector(".setup-new-game-button");
    const arrayLength = selectFour === true ? numArray4.length : numArray6.length;
    const timeTakenValue = document.querySelector(".time-taken-value");
    const stepsTakenValue = document.querySelector(".steps-taken-value");
    const overlay = document.querySelector(".overlay")


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
        clicked = false;
        gameEnd = true;
        clearInterval(interval);
        modalEnd.classList.toggle("hide");
        cards.forEach(elem => {
            elem.removeEventListener('click', function (event) {
                return;
            })
        })

    } else {
        modalEndContent.innerHTML = "You have lost the game!! Try again";
        timeTakenValue.innerHTML = `0${min}:${sec}`;
        stepsTakenValue.innerHTML = stepCount;
        overlay.classList.add("overlay-show");
    }

    setupNewGameButton.addEventListener("click", function () {
        const overlay = document.querySelector(".overlay");
        overlay.classList.remove("overlay-show");
        modalEnd.classList.add("hide");
        resetGame()
        reset()
    })

}

function reset() {
    const minHand = document.getElementById("minute");
    const secHand = document.getElementById("seconds");
    const modalEnd = document.querySelector(".modal-end");
    const cards = Array.from(document.querySelectorAll(".game-buttons"));


    tempArray = [];
    count = 0;
    sec = 0;
    min = 0;
    clicked = false;
    gameEnd = false;
    clearInterval(interval);
    modalEnd.classList.add("hide");


    cards.forEach(elem => {
        elem.classList.remove("open-cards")
        elem.classList.remove("match")
    })


    myTimer();
}
