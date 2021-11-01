// Initialise dealer hand
var dealerHand = [];
var dealerHValue = [];

// Initialise player hand
var playerHand = [];
var playerHValue = [];

// Initialise discard rack
var discardRack = [];

// Initialise model of a card deck, with values included
//  Code based on this source https://www.thatsoftwaredude.com/content/6196/coding-a-card-deck-in-javascript
const suits = ["spades", "diamonds", "clubs", "hearts"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function constructDeck(deckNumber) {
	let deck = new Array();
	for(let i = 0; i < suits.length; i++) {
		for(let x = 0; x < values.length; x++) {
            var card
            if (!isNaN(values[x])) {
                card = {value: values[x], suit: suits[i], numericValue: parseInt(values[x]), deckNumber: deckNumber};
            } else if (values[x] === "J" | values[x] === "Q" | values[x] === "K") {
                card = {value: values[x], suit: suits[i], numericValue: 10, deckNumber: deckNumber};
            } else if (values[x] === "A") {
                card = {value: values[x], suit: suits[i], numericValue: 24601, deckNumber: deckNumber};
            }
			deck.push(card);
		}
	}
	return deck;
}

// Normal methods of shuffling an array fall over when
//  attempting to shuffle an array of objects. The following
//  solution ameliorates that: https://stackoverflow.com/a/49555388
//  ---------------------------------------------------------------------------------
//  Shuffle based on Fisher-Yates method (shown to be superior 
//  to Math.random() - .5 method here https://bost.ocks.org/mike/shuffle/compare.html)
function shuffle(array) {
  let i = array.length;
  while (i--) {
    const ri = Math.floor(Math.random() * i);
    [array[i], array[ri]] = [array[ri], array[i]];
  }
  return array;
}

function initiateDeckSetup(shoe) {
    
    // Discard first card
    discardRack.push(shoe.shift())

    // Insert safety card/card cut (between 75 and 61 cards)
    var cardsToRemove = Math.floor(Math.random() * (76 - 61) + 61);
    while (cardsToRemove--) { shoe.pop(); }

}

function purgeHands() {
    // Purge player hand
    if (playerHand.length > 0) {
        var cardsToPurge = playerHand.length
        while (cardsToPurge--) { discardRack.push(playerHand.pop()); }
    }

    // Purge player hand value
    if (playerHValue.length > 0) {
        var cardsToPurge = playerHValue.length
        while (cardsToPurge--) { playerHValue.pop(); }
    }

    // Purge dealer hand
    if (dealerHand.length > 0) {
        var cardsToPurge = dealerHand.length
        while (cardsToPurge--) { discardRack.push(dealerHand.pop()); }
    }

    // Purge dealer hand value
    if (dealerHValue.length > 0) {
        var cardsToPurge = dealerHValue.length
        while (cardsToPurge--) { dealerHValue.pop(); }
    }
}

function dealCards(shoe) {

    purgeHands();

    // Deal cards sequentially, two cards each.
    playerHand.push(shoe.shift());
    dealerHand.push(shoe.shift());
    playerHand.push(shoe.shift());
    dealerHand.push(shoe.shift());

    // Extract numerical values to playerHValue and dealerHValue
    playerHand.forEach(function (item) { playerHValue.push(item.numericValue) });
    dealerHand.forEach(function (item) { dealerHValue.push(item.numericValue) });

}

function calculateHValue(HValueArray) {
    // Initialise return object
    var result = {};
    var HValueArray_copy = JSON.parse(JSON.stringify(HValueArray));
    
    // Count aces and remove them from the hand for now since
    //  their value can vary.
    var aceCounter = 0;

    for (let i = HValueArray_copy.length - 1; i >= 0; i--) {
        if (HValueArray_copy[i] === 24601) {
            aceCounter++;
            HValueArray_copy.splice(i, 1);
        }
    }

    result.aceCounter = aceCounter;
    // console.log(HValueArray);

    // Sum value of remaining items in hand
    var preAceSum = HValueArray_copy.reduce((a, b) => a + b, 0);
    var postAceOptions;

    result.preAceSum = preAceSum;

    // Handle adding Aces.
    //  Since there's such a limited amount of combinations, there's probably no need to 
    //  pursue this programatically.
    //  1 Ace: [(1, 11)]
    //  2 Ace: [(1, 1), (1, 11), (11, 11)]
    //  3 Ace: [(1, 1, 1), (1, 1, 11), (1, 11, 11), (11, 11, 11)]
    //  4 Ace: [(1, 1, 1, 1), (1, 1, 1, 11), (1, 1, 11, 11), (1, 11, 11, 11), (11, 11, 11, 11)]
    if (aceCounter > 0) {

        switch (aceCounter) {
            case 1:
                postAceOptions = [1, 11];
                break;
            case 2:
                postAceOptions = [2, 12, 22];
                break;
            case 3:
                postAceOptions = [3, 13, 23, 33];
                break;
            case 4:
                postAceOptions = [4, 14, 24, 34, 44];
                break;
        }

        for(var i = 0; i < postAceOptions.length; i++) { postAceOptions[i] += preAceSum; }

        // Finally, remove all values that are above 21, but if this causes the length of the array 
        //  to become 0, the hand is bust.
        
        var aceOptionBkup = JSON.parse(JSON.stringify(postAceOptions));

        for (let i = postAceOptions.length - 1; i >= 0; i--) {
            if (postAceOptions[i] > 21) {
                postAceOptions.splice(i, 1);
            }
        }

        if (postAceOptions.length < 1) { 
            // Use minimum of the temp post ace values to display
            result.postAceOptions = [Math.min.apply(null, aceOptionBkup)];
            result.initialState = 'bust';
        } else if (postAceOptions.includes(21)) { 
            // On a (10, Ace) hand, this assumes that the hand is blackjack, not 11
            result.postAceOptions = postAceOptions;
            result.initialState = 'blackjack';
        } else {
            result.postAceOptions = postAceOptions;
            result.initialState = 'none';
        }

    } else {
        result.postAceOptions = [preAceSum];
        if (preAceSum > 21) {
            result.initialState = 'bust';
        } else if (preAceSum === 21) {
            result.initialState = 'blackjack';
        } else {
            result.initialState = 'none';
        }
    }
    return result;
} 

// Operationalise player choice - should be fine to change player hand in place in this.
//  only place where that wouldn't be good is in the sim function
function playerPlay(shoe, playerHand, playerHValue, playerChoice, verbose = false) {
    var result = {};

    if (playerChoice === 'stand') {
        // Do nothing
        result.outcome = 'continueToDealer';
    } else if (playerChoice === 'hit') {
        // Remove card from top of deck and add to player hand.
        // Recalculate values and determine whether the new card makes the hand go bust.
        playerHand.push(shoe.shift());
        playerHValue.push(playerHand[playerHand.length - 1].numericValue);

        if (calculateHValue(playerHValue).postAceOptions.filter(obj => { return obj <= 21 }).length === 0) {
            result.outcome = 'bust';
            result.playerValue = Math.min.apply(null, calculateHValue(playerHValue).postAceOptions);
        } else {
            result.outcome = 'playerCanGoAgain';
        }
    } else if (playerChoie === 'split') {
        // Take current hand and create two new hands - need to determine whether another card is drawn straight away
        // or wait until the player chooses to hit again.
        //  If pair of aces, one card per hand is given then nothing else is allowed.


        result.outcome = 'playerCanGoAgain';
    } else if (playerChoice === 'double') {
        // Only allowed when the total of the original two cards equals 9, 10, or 11.
    }

}


// Takes the hands as arguments but doesn't change them in place
function dealerPlay(shoe, playerHand, playerHValue, dealerHand, dealerHValue, verbose = false) {

    // does the player have two cards of the same value? if so, offer a split
    // then start game; player draws first, then dealer.

    var result = { outcome: 'none' };
    var availableOptions = { stand: true, hit: true, split: false, double: false , insurance: false }; // Deal with double later
    var insuranceThisRound = false;
    var playerCurrentHand;
    var playerSplit;
    var playerSplitTmp1;
    var playerSplitTmp2;
    var dealerCurrentHand;
    var playerChoice;

    var playerHValuetmp = JSON.parse(JSON.stringify(playerHValue));
    var dealerHValuetmp = JSON.parse(JSON.stringify(dealerHValue));
    var playerHandtmp = JSON.parse(JSON.stringify(playerHand));
    var dealerHandtmp = JSON.parse(JSON.stringify(dealerHand));

    // Calculate values for each hand
    playerCurrentHand = calculateHValue(playerHValuetmp);
    dealerCurrentHand = calculateHValue(dealerHValuetmp);

    if (verbose) {
        console.log("Player Hand: ", playerHand);
        console.log("Player Hand after calculation: ", playerCurrentHand);
        console.log("Dealer Hand: ", dealerHand);
        console.log("Dealer Hand after calculation: ", dealerCurrentHand);
    }

    // Check if the user has blackjack
    if (playerCurrentHand.initialState === 'blackjack') {
        if (dealerCurrentHand.initialState === 'blackjack') {
            result.outcome = 'draw';
            result.playerValue = playerCurrentHand.postAceOptions;
            result.dealerValue = dealerCurrentHand.postAceOptions;
            result.note = 'Both player and dealer have blackjack'
        } else {
            result.outcome = 'win';
            result.playerValue = playerCurrentHand.postAceOptions;
            result.dealerValue = dealerCurrentHand.postAceOptions;
            result.note = 'Player has blackjack'
        }
    }
    
    // Dealer peak - if the first card is an Ace then insurance is offered. - FOR LATER
    // if (dealerHand[0].numericValue === 24601) {
    //     availableOptions.insurance = true;
    //     // Prompt user for insurance here; if user accepts:
    //     insuranceThisRound = true;
    //     // Build insurance functionality later - settle it right here (unless it happens later in game)
    //     // if (dealerHand[1].numericValue === 10)
    // }

    // If player's cards have the same value, offer split - FOR LATER
    // if (playerHValuetmp[0] === playerHValuetmp[1]) {
    //     // Offer split, if accepted:
    //     playerSplit = true;
    //     playerSplitTmp1 = playerHandtmp[0];
    //     playerSplitTmp2 = playerHandtmp[1];   
    //     playerHandsInPlay = [playerSplitTmp1, playerSplitTmp2]; 
    // }

    // BEGIN GAME
    //  Player move - FOR LATER; IN DEV, ASSUME PLAYER ALWAYS STANDS
    // while (result.outcome != 'bust' && result.outcome != 'win' && result.outcome != 'draw' && result.outcome != 'lose') {
    //     if (playerSplit) {
    //         // Handle playerSplitTmp1 and playerSplitTmp2 here
    //     } else if (playerChoice === 'hit') {
    //         playerHandtmp.push(shoe.shift());
    //         // playerHandtmp.forEach(function (item) { playerHValuetmp.push(item.numericValue) });
    //         playerHValuetmp.push(playerHandtmp[playerHandtmp.length - 1].numericValue);
    //         playerCurrentHand = calculateHValue(playerHValuetmp);
    
    //         if (playerCurrentHand.initialState === 'bust') {
    //             result.outcome = 'bust';
    //         }
    //     } else if 
    // }
    // Take player hand as given
    //  Filter for options under 21 and choose max of those; if none, then bust.
    if (playerCurrentHand.postAceOptions.filter(obj => { return obj <= 21 }).length > 0) {
        result.playerValue = Math.max.apply(null, playerCurrentHand.postAceOptions.filter(obj => { return obj <= 21 }));
    } else {
        result.playerValue = Math.min.apply(null, playerCurrentHand.postAceOptions);
        result.outcome = 'bust';
    }

    // Dealer move
    // If the dealer's total is 17 or more, dealer must stand
    // If total is under 17, they must continue to take cards until the total is 17 or more at which point they stand.
    while (result.outcome != 'bust' && result.outcome != 'win' && result.outcome != 'draw' && result.outcome != 'lose') {
        // Diagnostics block
        if (verbose) {console.log('BEGINNING DEALER TURN; cards:', dealerHValuetmp, '; options:', dealerCurrentHand.postAceOptions, '; initial state:', dealerCurrentHand.initialState);}
        
        if (dealerHValuetmp.initialState === 'blackjack') {
            if (verbose) {console.log('Dealer has blackjack')};

            if (playerHValuetmp.initialState != 'blackjack') {
                result.outcome = 'lose';
                result.note = 'Dealer has blackjack';
            } else {
                result.outcome = 'draw';
                result.note = 'Both parties have blackjack';
            }

        //  If dealer has one ace and counting it as 11 will bring the card total to 17 or more (but not over 21); the dealer has to count it as 11 and stand.    
        } else if ((dealerHValuetmp.filter(obj => { return obj === 24601 }).length >= 1) && 
            /*(dealerCurrentHand.preAceSum >= 6 && dealerCurrentHand.preAceSum <= 10)*/
            (Math.max.apply(null, dealerCurrentHand.postAceOptions) >= 17 && Math.max.apply(null, dealerCurrentHand.postAceOptions) <= 21)) {
            if (verbose) {console.log('Dealer has ace that can bring total to between 17 and 21')};

            // Dealer hand value will be 11 + other card value; dealer must stand
            result.dealerValue = 11 + dealerCurrentHand.preAceSum

            if (result.dealerValue > result.playerValue) {
                result.outcome = 'lose';
                result.note = 'Dealer hand greater than player hand';
            } else if (result.dealerValue === result.playerValue) {
                result.outcome = 'draw';
                result.note = 'Dealer hand equal to player hand';
            } else if (result.dealerValue < result.playerValue) {
                result.outcome = 'win';
                result.note = 'Player hand greater than dealer hand';
            }

        // If dealer has no options remaining under 21, the dealer goes bust
        } else if (dealerCurrentHand.postAceOptions.filter(obj => { return obj <= 21 }).length === 0) {
            if (verbose) {console.log('Dealer has no options under or equal to 21 - bust')};

            result.dealerValue = Math.min.apply(null, dealerCurrentHand.postAceOptions);
    
            result.outcome = 'win';
            result.note = 'Dealer went bust'; 

        // If dealer's options start at 17 or more, the dealer must stand
        } else if (Math.min.apply(null, dealerCurrentHand.postAceOptions.filter(obj => { return obj <= 21 })) >= 17) {
            if (verbose) {console.log('Dealer\'s options start at 17 or more - must stand')};

            result.dealerValue = Math.min.apply(null, dealerCurrentHand.postAceOptions.filter(obj => { return obj <= 21 }));

            if (result.dealerValue > result.playerValue) {
                result.outcome = 'lose';
                result.note = 'Dealer hand greater than player hand';
            } else if (result.dealerValue === result.playerValue) {
                result.outcome = 'draw';
                result.note = 'Dealer hand equal to player hand';
            } else if (result.dealerValue < result.playerValue) {
                result.outcome = 'win';
                result.note = 'Player hand greater than dealer hand';
            }

        // If dealer's options are lower than 17, dealer must hit until over 17 or bust
        } else if (Math.max.apply(null, dealerCurrentHand.postAceOptions.filter(obj => { return obj <= 21 })) < 17) {
            if (verbose) {console.log('Dealer\'s options max out under 17 - must hit')};
            dealerHandtmp.push(shoe.shift());
            dealerHValuetmp.push(dealerHandtmp[dealerHandtmp.length - 1].numericValue);
            dealerCurrentHand = calculateHValue(dealerHValuetmp);
        }
    }

    return result;

}

// Grab next n cards in deck
function returnForwardCards (shoe, numCards = 40) {

    if (shoe.length >= numCards - 1) {
        var forwardCards =[];

        for (let i = 0; i <= numCards - 2; i++) { forwardCards.push(shoe[i]) }
        return forwardCards;
    }

}

// Retain dealer's first card and the next x - 1 cards in shoe for simulation. 
// Shuffle forwardShoe, deal first card to dealer's hand, simulate a round
//  Retain win/loss/draw status
//  Re-shuffle forwardShoe

// performSim_hit will need to also draw and add another card to the player's hand
// performSim_split will need to fork the hand, then allow for hits until a certain point (likely will need to derive
//   based on basic strategy)
function performSim_stand(n, dealerHand, shoeForSim, numCardsAhead, verbose = false) {
    var result = { iteration: [], outcome: [] };
    var interimShoe = [dealerHand[dealerHand.length - 1]].concat(returnForwardCards(shoeForSim, numCards = numCardsAhead))
    
    for (let i = 0; i <= n - 1; i++) {
        if (verbose) {console.log('Iteration', (i + 1), "/", n)}

        var interimShoetmp = JSON.parse(JSON.stringify(interimShoe));

        // Shuffle interimShoe
        shuffle(interimShoetmp);
        
        // Deal out first card in shoe to dealer's hand
        var dealerHandForSim = [dealerFirstCard].concat(interimShoetmp[0]);
        var dealerHValueForSim = [dealerFirstHValue].concat(dealerHandForSim[dealerHandForSim.length - 1].numericValue)
        
        // Perform round, save outcome to results object
        result.iteration.push(i)

        var roundResult = dealerPlay(interimShoetmp, 
            playerHand = playerHand, playerHValue = playerHValue, 
            dealerHand = dealerHandForSim, dealerHValue = dealerHValueForSim);

        if (verbose) {
            console.log('    Player:', roundResult.playerValue, '; Dealer:', roundResult.dealerValue);
            console.log('    Result:', roundResult.outcome, ';', roundResult.note);
        }
        result.outcome.push(roundResult.outcome);
    }

    return result;
}

// Could this be done with Array.concat(Array(6).fill().map((element, index) => index).forEach(constructDeck))?
const deck_1 = constructDeck(1);
const deck_2 = constructDeck(2);
const deck_3 = constructDeck(3);
const deck_4 = constructDeck(4);
const deck_5 = constructDeck(5);
const deck_6 = constructDeck(6);

// NB: In casino play, the last 60-75 cards will not be used, making things
//  harder on professional card counters.
// NB2: Some JS standards may not yet support forEach, in which case you'll
//  need to define it using https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#polyfill
const shoe = shuffle(deck_1.concat(deck_2, deck_3, deck_4, deck_5, deck_6));

initiateDeckSetup(shoe);

dealCards(shoe); // Outputs numerical values to *Hand and *HValue arrays.

console.log('Player:', playerHand);
console.log('Dealer:', dealerHand);

var dealerFirstCard = dealerHand[0];
var dealerFirstHValue = dealerHValue[0];

// console.log(performSim_stand(n = 1000, dealerHand = dealerHand, shoeForSim = shoe, numCardsAhead = 25, verbose = true));

// Determine which buttons are available to user
if (playerHValue[0] === playerHValue[1]) {
    document.getElementById('split-button').style.display = 'inline';
}

console.log(playerHValue);

if ((calculateHValue(playerHValue).postAceOptions.length === 1) && (calculateHValue(playerHValue).postAceOptions[0] >= 9 && calculateHValue(playerHValue).postAceOptions[0] <= 11)) {
    document.getElementById('double-button').style.display = 'inline';
}

console.log(playerHValue);
// Await user input
var readyForPlayerInput = true;
var playerInputForRound = 'none';

document.getElementById('hit-button').addEventListener('click', function() {
    playerInputForRound = 'hit';
    readyForPlayerInput = false;

    console.log('Player has chosen to hit')

    // Also handle changing the colour of the button when clicking etc.
})



// purgeHands();

//    - Can we get animated graphics? D3; Chart.js; plotly.js?

//    - Could we leave playRound as it is and have the player's logic outside of it? It's good for responding based on dealer.
//        There are some variables in dealerPlay (previously playRound) that can be used for player logic now.
//  So structure should be:
//   create shoe and initiate deck setup
//    WRAP BELOW IN A WHILE-LOOP THAT CONTITUTES THE GAME --- maybe while number of cards remaining in shoe is > 20?
//     In reality, dealer will start shuffling once the safety card has been passed - could use that number as the limit instead of the arbitrary 20
        // // Insert safety card/card cut (between 75 and 61 cards)
        // var cardsToRemove = Math.floor(Math.random() * (76 - 61) + 61);
        // while (cardsToRemove--) { shoe.pop(); }
        // Remove this whole part from initiateGame and just use cardsToRemove as the limit.
//   deal cards and save dealer's first card for simulation purposes
//   if dealer's first card is an ace, offer insurance
//   if player has two cards of same value, offer split
//   accept user input and operationalise it in their hand
//   start dealerPlay to determine outcome.

//  Will need to slightly rejig dealerPlay to handle the two hands if the player splits.