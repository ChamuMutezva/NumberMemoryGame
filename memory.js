const numArray4 = [1, 2, 3, 4, 5, 4, 3, 2, 1, 5, 6, 7, 8, 8, 6, 7]; // 4x4 array
const numArray6 = [1, 2, 3, 4, 5, 4, 3, 2, 1, 5, 6, 7, 8, 8, 6, 7, 18, 17,
    16, 15, 14, 13, 12, 11, 10, 9, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9]; // 6x6 array

const modalMenuCtrl = document.querySelector(".modalMenuCtrl");
const container = document.querySelector(".container");
let playBtn = document.getElementById("startGame");
let resetBtn = document.querySelector(".resetBtn");
let selectFour = true; // grid size selector 4X4 or 6X6
let clicked = false; // to start the game
let gameEnd = false;
let tempArray = [];
let count = 0;
let sec = 0;
let min = 0;
let interval;

playBtn.addEventListener("click", () => {
    startGame()
})

resetBtn.addEventListener("click", () => {
    document.querySelector(".modalStart").classList.remove("hideModalMenuCtrl")
    resetGame()
    myTimer();
})

// hide the modal start screen to start the game
modalMenuCtrl.addEventListener("click", () => {
    document.querySelector(".modalStart").classList.add("hideModalMenuCtrl")
    container.innerHTML = ""
    populateBoard()
})

function resetGame() {   
    const minHand = document.getElementById("minute");
    const secHand = document.getElementById("seconds");
    const modal = document.querySelector(".modalEnd");
    const cards = Array.from(document.querySelectorAll(".gameNum"));

    tempArray = [];
    count = 0;
    sec = 0;
    min = 0;
    clicked = false;
    gameEnd = false;
    clearInterval(interval);
    modal.classList.add("hide");

    cards.forEach(elem => {
        elem.classList.remove("openCards")
        elem.classList.remove("match")
        elem.classList.add("disableCards")
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
    button.classList.add("gameNum")
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
    console.log(clicked)
    console.log(gameEnd)
/*
    if (clicked == true) {
        return;
    }

    if (gameEnd == true) {
        return;
    }
*/
    selectFour === true ? shuffle(numArray4) : shuffle(numArray6);
    startTimer();
    clicked = true;

    if (clicked) {
        const cards = Array.from(document.querySelectorAll(".gameNum"));
        cards.forEach((elem, index) => {
            elem.classList.remove("disableCards")
            //  console.log(elem);
            selectFour === true ? elem.innerHTML = numArray4[index] : elem.innerHTML = numArray6[index];
            elem.addEventListener("click", function (event) {
                if (elem.classList.contains('openCards')) {
                    console.log('Card already opened, click another card');
                    return;
                } else {
                    elem.classList.add('openCards');
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

        if (tempArray[0].innerHTML == tempArray[1].innerHTML) {
            tempArray[0].classList.add('match');
            tempArray[1].classList.add('match');
            console.log("We have a match");
            tempArray = [];
            console.log(count);
            endGame();
        } else {
            console.log("No match found");
            setTimeout(function () {
                console.log("Remove opened cards");
                tempArray[0].classList.toggle('openCards');
                tempArray[1].classList.toggle('openCards');
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
    const cards = Array.from(document.querySelectorAll(".gameNum"));
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
       // clearInterval(interval);
        resetGame();
       /*
        cards.forEach(elem => {
            return elem.removeEventListener('click', startGame, false)
        })
        */
    }
}

function endGame() {
    const cards = Array.from(document.querySelectorAll(".gameNum"));
    let modalEnd = document.querySelector(".modalEnd");
    const modalClose = document.querySelector(".modalClose");
    const arrayLength = selectFour === true ? numArray4.length : numArray6.length

    if (count < arrayLength / 2) {
        count = count + 1;
    }

    if (count === arrayLength / 2) {
        console.log("Welldone , game ended");
        cards.forEach((elem) => {
            if (elem.classList.contains('openCards')) {
                return;
            } else {
                elem.classList.add('openCards');
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

    }

    modalClose.addEventListener("click", function () {
        modalEnd.classList.add("hide");
        resetGame()
        reset()
    })

}

function reset() {
    const minHand = document.getElementById("minute");
    const secHand = document.getElementById("seconds");
    const modalEnd = document.querySelector(".modal");
    const cards = Array.from(document.querySelectorAll(".gameNum"));


    tempArray = [];
    count = 0;
    sec = 0;
    min = 0;
    clicked = false;
    gameEnd = false;
    clearInterval(interval);
    modalEnd.classList.add("hide");


    cards.forEach(elem => {
        elem.classList.remove("openCards")
        elem.classList.remove("match")
    })


    myTimer();
}






/*
let tempArray = [];
let count = 0;
let sec = 0;
let min = 0;
let interval;

const cards = Array.from(document.querySelectorAll(".gameNum"));
let clicked = false; // to start the game
let gameEnd = false;
let modal = document.querySelector(".modal");
let modalClose = document.querySelector(".modalClose");
let playBtn = document.getElementById("startGame");
let resetBtn = document.querySelector(".resetBtn");
console.log("Use this button to restart the game " + resetBtn.value);
console.log(cards);

modalMenuCtrl.addEventListener("click", ()=> {
    document.querySelector(".modalStart").classList.add("hideModalMenuCtrl")
})

function reset() {
    const minHand = document.getElementById("minute");
    const secHand = document.getElementById("seconds");

    console.log(numArray);
    tempArray = [];
    count = 0;
    sec = 0;
    min = 0;
    clicked = false;
    gameEnd = false;
    clearInterval(interval);
    modal.classList.add("hide");


    cards.forEach(elem => {
        elem.classList.remove("openCards")
        elem.classList.remove("match")
    })


    myTimer();  
}

resetBtn.addEventListener("click", reset);



//shuffle here
//shuffle(numArray);
playBtn.addEventListener("click", startGame);

function startGame() {
    if (clicked == true) {
        return;
    }
    if (gameEnd == true) {
        return;
    }

   // container.
    shuffle(numArray);
    startTimer();
    clicked = true;

    if (clicked) {
        cards.forEach((elem, index, myArray) => {
            //  console.log(elem);
            elem.innerHTML = numArray[index];
            elem.addEventListener("click", function (event) {
                // console.log(event.target);
                // console.log(myArray[index]);
                if (elem.classList.contains('openCards')) {
                    console.log('Card already opened, click another card');
                    return;
                } else {
                    elem.classList.add('openCards');
                    //compareCards(numArray[index]);
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

        if (tempArray[0].innerHTML == tempArray[1].innerHTML) {
            tempArray[0].classList.add('match');
            tempArray[1].classList.add('match');
            console.log("We have a match");
            tempArray = [];
            console.log(count);
            endGame();
        } else {
            console.log("No match found");
            setTimeout(function () {
                console.log("Remove opened cards");
                tempArray[0].classList.toggle('openCards');
                tempArray[1].classList.toggle('openCards');
                tempArray = [];
            }, 500);
        }
        // console.log(tempArray[0].classList.contains('openCards'));
        //console.log(tempArray[1].classList.contains('openCards'));
        // tempArray = [];
    }

}

function endGame() {
    if (count < 4) {
        count = count + 1;
    }

    if (count === 4) {
        console.log("Welldone , game ended");
        cards.forEach((elem) => {
            if (elem.classList.contains('openCards')) {
                return;
            } else {
                elem.classList.add('openCards');
                console.log(elem);
            }

        })
        clicked = false;
        gameEnd = true;
        clearInterval(interval);       
        modal.classList.toggle("hide");        
        cards.forEach(elem => {
            elem.removeEventListener('click', function (event) {
                //console.log("Ayeah , job completed");
                return;
            })
        })

    }
}


    // close the modal box
    modalClose.addEventListener("click", function () {
        // modal.style.visibility = "hidden";
        modal.classList.toggle("hide");
        reset()
    })

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
    sec++;

    if (sec > 59) {
        min++;
        sec = 0;
    }

    if (sec < 10) {
        // console.log(`0${min}:0${sec}`);
        minHand.innerHTML = `0${min}`;
        secHand.innerHTML = `0${sec}`;
    } else {
        // console.log(`0${min}:${sec}`);
        minHand.innerHTML = `0${min}`;
        secHand.innerHTML = `${sec}`;
    }


    //Stop timer at 2 minutes;
    if (min >= 2) {
        clearInterval(interval);

        cards.forEach(elem => {
            return elem.removeEventListener('click', startGame, false)
        })
    }
}

const winnerTemplate = `<h1>Congradulations hooray</h1>
        <div class="congradulations"><i class="fa fa-trophy"></i></div>
        <input type="button" value="Close" class="modalClose"/>
`
*/