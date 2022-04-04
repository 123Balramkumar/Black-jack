let blackjackGame = {
    you: {
        scoreSpan: "#player_result",
        div: "#player_box",
        score: 0,
    },
    dealer: {
        scoreSpan: "#dealer_result",
        div: "#dealer_box",
        score: 0,
    },
    cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "Q", "J", "A"],
    cardMap: {
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        10: 10,
        J: 10,
        Q: 10,
        K: 10,
        A: [1, 11],
    },
    //these are the differet type of card
    suites: ["♠", "♦", "♣", "♥"],
   wins: 0,
    losses: 0,
    draws : 0,
    isStand: false,
    turnsOver: false,
};
const YOU = blackjackGame["you"];
const DEALER = blackjackGame["dealer"];

// document.querySelector("#playButton").addEventListener("click", blackjackHit);
// document.querySelector("#showButton").addEventListener("click", dealerLogic);
// document.querySelector("#restartButton").addEventListener("click", blackjackDeal);
$("#playButton").click(blackjackHit) //id selector, event, eventhandler
$("#showButton").click(dealerLogic)
$("#restartButton").click(blackjackDeal)

function blackjackHit() {
    if (blackjackGame["isStand"] === false) {
        let card = randomCard();
        showCard(card, YOU);
        updateScore(card, YOU);
        showScore(YOU);
    }
}

function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame["cards"][randomIndex];
}

//function to display card
function showCard(card, activePlayer) {
    if (activePlayer["score"] <= 21) {
        let cardImage = document.createElement("div");
        let randomIndexSuit = Math.floor(Math.random() * 4);
        let singleSuit = blackjackGame["suites"][randomIndexSuit];
        cardImage.className = "card"; ///!!!!
        let objkeys = Object.keys(blackjackGame["cardMap"]);
        for (let i = 0; i < objkeys.length; i++) {
            if (objkeys[i] == card) {
                if (randomIndexSuit == 0 || randomIndexSuit == 2) {
                    cardImage.innerHTML = card + `<div id=suites style="color:black">${singleSuit}</div>`; //!!!
                    cardImage.style.color = "black";
                } else {
                    cardImage.innerHTML = card + `<div id=suites style="color:red">${singleSuit}</div>`; //!!!
                    cardImage.style.color = "red";

                }

            }
        }
        document.querySelector(activePlayer["div"]).appendChild(cardImage);

    }
}


//function to add the score of displayed cards
function updateScore(card, activePlayer) {
    if (card === "A") {
        if ((activePlayer["score"] + blackjackGame["cardMap"][card][1]) <= 21) {
            activePlayer["score"] += blackjackGame["cardMap"][card][1];
        } else {
            activePlayer["score"] += blackjackGame["cardMap"][card][0];
        }
    } else {
        activePlayer["score"] += blackjackGame["cardMap"][card];
    }
}

//function to display score
function showScore(activePlayer) {
    if (activePlayer["score"] > 21) {
        document.querySelector(activePlayer["scoreSpan"]).textContent = "Oops.!!";
        document.querySelector(activePlayer["scoreSpan"]).style.color = "white";
    } else {
        document.querySelector(activePlayer["scoreSpan"]).textContent = activePlayer["score"];
    }
}


//function for starting the next set game
function blackjackDeal() {
    let yourImages = document
        .querySelector("#player_box")
        .querySelectorAll("div");


    for (var i = 0; i < yourImages.length; i++) {
        yourImages[i].remove();
    }
    YOU["score"] = 0;
    document.querySelector("#player_result").textContent = 0;
    document.querySelector("#player_result").style.color = "#ffffff";
    if (blackjackGame["turnsOver"] === true) {
        let dealerImages = document
            .querySelector("#dealer_box")
            .querySelectorAll("div");

        blackjackGame["isStand"] = false;
        for (var i = 0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }
        DEALER["score"] = 0;
        document.querySelector("#dealer_result").textContent = 0;
        document.querySelector("#dealer_result").style.color = "white";

        document.querySelector("#result").textContent = "Let's Play!";
        $("#result").style.color = "black";

        blackjackGame["turnsOver"] = false


    }

}


//function for setting timer of dealer
//promise allowws to associate handlers with an asynchronous action
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

//function for dealer game
async function dealerLogic() {
    blackjackGame["isStand"] = true;

    while (DEALER["score"] < 16 && blackjackGame["isStand"] === true) {
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(800);

    }

    blackjackGame["turnsOver"] = true;
    showResult(computeWinner());
}

//compute winner,update wins losses draws
//using nested loop
function computeWinner() {
    let winner;
    if (YOU["score"] <= 21) {
        if (YOU["score"] > DEALER["score"] || DEALER["score"] > 21) {
            blackjackGame["wins"]++;
            winner = YOU;
        } else if (YOU["score"] < DEALER["score"]) {
            blackjackGame["losses"]++;
            winner = DEALER;
        } else if (YOU["score"] === DEALER["score"]) {
            blackjackGame["draws"]++;
        }
    } else if (YOU["score"] > 21 && DEALER["score"] <= 21) {
        blackjackGame["losses"]++
            winner = DEALER;
    } else if (YOU["score"] > 21 && DEALER["score"] > 21) {
        blackjackGame["draws"]++;
    }
    return winner;
}

//to display the result
//using nested loop
function showResult(winner) {
    let message, messageColor
    if (blackjackGame["turnsOver"] === true) {
        if (winner === YOU) {
            document.querySelector("#wins").textContent = blackjackGame["wins"];
            message = "You won!"
            messageColor = "rgb(37, 23, 79)"

        } else if (winner === DEALER) {
            document.querySelector("#losses").textContent = blackjackGame["losses"];
            message = "You lost";
            messageColor = "white";
        } else {
            document.querySelector("#draws").textContent = blackjackGame["draws"];
            message = "its a draw";
            messageColor = "white"
        }
        document.querySelector("#result").textContent = message;
        document.querySelector("#result").style.color = messageColor;
    }
}
let alertOnce = false;
// function to alert rotate device when the webpage is opened in smaller devices
let limitFunc = function() {
    if (window.innerWidth <= 1000 && alertOnce === false) {
        alert("Rotate Device.");
        alertOnce = true;
    }


}
window.addEventListener("resize", limitFunc); //window size os resized=>event
window.addEventListener("onload", limitFunc);