const numArray = [1, 2, 3, 4, 5, 4, 3, 2, 1];
let tempArray = [];
let count = 0;
const cards = Array.from(document.querySelectorAll(".gameNum"));
let clicked = true;
let modal = document.querySelector(".modal");
let modalClose = document.querySelector(".modalClose");
console.log(cards);

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
shuffle(numArray);

if (clicked == true) {
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
} else {

    cards.forEach(elem => {
        elem.removeEventListener('click', function (event) {
            console.log("Ayeah , job completed");
        })
    })


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
        clicked = false;    
        modal.style.visibility = "visible";
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
    modal.style.visibility = "hidden";
})