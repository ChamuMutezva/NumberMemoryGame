const numArray = [1, 2, 3, 4, 5, 4, 3, 2, 1];
let tempArray = [];
let count = 0;
let clickCounts = 0;
let sec = 0;
let min = 0;
let interval;
let countUp = 0;
const cards = Array.from(document.querySelectorAll(".gameNum"));
let clicked = false; // to start the game
let gameEnd = false;
let modal = document.querySelector(".modal");
let modalClose = document.querySelector(".modalClose");
let playGame = document.getElementById("startGame");
let resetGame = document.querySelector(".resetGame");
console.log("Use this button to restart the game " + resetGame.value);
console.log(cards);

function reset() {
    const minHand = document.getElementById("minute");
    const secHand = document.getElementById("seconds");
    shuffle(numArray);
    console.log(numArray);
    tempArray = [];
    count = 0;
    clickCounts = 0;
    sec = 0;
    min = 0;
    countUp = 0;
    clicked = false;
    gameEnd = false;
    clearInterval(interval);
    modal.classList.add("hide");
    cards.forEach((elem) => {
        elem.classList.remove('openCards');
        elem.classList.remove('match');
        //elem.innerHTML = ""
         elem.removeEventListener('click', startGame, true)
        console.log(elem);
    })
     
   // minHand.innerHTML = `0${min}`;
   // secHand.innerHTML = `0${sec}`;

     myTimer();
    startGame();
}

resetGame.addEventListener("click", reset);

function shuffle(array) {
    console.log(array.length);
    var currentIndex = array.length,
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
//shuffle here
shuffle(numArray);
playGame.addEventListener("click", startGame, true);

function startGame() {
    if (clicked == true) {
        return;
    }
    if (gameEnd == true) {
        return;
    }

   shuffle(numArray);
    startTimer();
    clicked = true;

    if (clicked) {
        cards.forEach((elem, index, myArray) => {
            console.log(elem);
            elem.innerHTML = numArray[index];
            elem.addEventListener("click", function (event) {
                console.log(event.target);
                console.log(myArray[index]);
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
    //  else {

    //   cards.forEach(elem => {
    //       elem.removeEventListener('click', function (event) {               
    //          console.log("Ayeah , job completed");
    //     })
    //   }) 
    //  }

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
        // modal.style.visibility = "visible";
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