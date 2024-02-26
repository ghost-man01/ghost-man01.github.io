let player = {
    name: "Siddhant",
    chips: 500
}

let cards = []
let sum = 0
let hasBlackjack = false
let isAlive = false
let message = ""
let messageEl = document.getElementById("message-el")
let sumEl = document.getElementById("sum-el")
let cardsEl = document.querySelector("#cards-el")
let playerEl = document.querySelector("#player-el")

playerEl.textContent = player.name + ": $" + player.chips
// console.log(cards)

function getRandomCard() {
    let randomNumbers = Math.floor(Math.random() * 13) + 1
    if(randomNumbers > 10) {
        return 10
    } else if (randomNumbers < 2) {
        return 11
    } else {
        return randomNumbers
    }
}
function startGame() {
    isAlive = true
    let firstCard = getRandomCard()
    let secondCard = getRandomCard()
    cards = [firstCard, secondCard]
    sum = firstCard + secondCard
    renderGame()
}

function renderGame() {
    if (sum < 21) {
        message = "Do you want to draw a new card?" 
        isAlive = true
    } else if (sum === 21) {
        message = "You've got Blackjack!"
        hasBlackjack = true
        isAlive = true
    } else {
        message = "You're out of Game!"
        isAlive = false
        
    }
    cardsEl.textContent = "Cards: "
    for (let i = 0; i < cards.length; i++) {
        cardsEl.textContent += cards[i] + " "
    }
    sumEl.textContent = "Sum: " + sum
    messageEl.textContent = message

}

function newCard() {
    if (isAlive === true && hasBlackjack === false) {

        messageEl.textContent = "Drawing a New Card from Deck"
        let newCard = getRandomCard() 
        cards.push(newCard)
        sum += newCard
        renderGame()
    }

}