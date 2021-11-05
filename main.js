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

function fadeIn(element, timeToFade = 15, removeElement = false) {
    var op = 0.1;  // Initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1) {
            if (removeElement) {element.parentNode.removeChild(element);}
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, timeToFade);
}

function drawPlayerHand(playerHand) {
    var cardSelector =[];
    playerHand.forEach(function(x) { cardSelector.push(`${x.value}${x.suit}`) })

    var cardsToDisplay = [];
    for (let i = 0; i <= cardSelector.length - 1; i++) {
        cardsToDisplay.push('<p>' + prepCardStringForHTML(cardList.filter(obj => { return obj.cardName === cardSelector[i] })[0].cardEntity) + '</p>')
    }

    document.getElementById('player-cards').innerHTML = '<div class="card-holder" id="ply-card-holder">' + cardsToDisplay.join('') + '</div>';
    document.getElementById('player-cards')
        .insertAdjacentHTML('beforeend', 
            `<h2 class="player-total" id="player-total">Your Total: <span class="col-emphasis">${calculateHValue(playerHValue).postAceOptions.join(' / ')}</span></h2>`)
}

function updateShoeCount(shoe) {
    document.getElementById('remaining-cards').innerHTML = `${shoe.length} cards remaining<br>${shoe.length - safetyCardPosition} until cut card`
    document.getElementById('remaining-cards-2').innerHTML = `${shoe.length} cards remaining<br>${shoe.length - safetyCardPosition} until cut card`
}

function updateConsole(update = 'No console update provided') {
    var parentElement = document.getElementById('blinker').parentNode;
    var newMessage = document.createElement('p');

    newMessage.innerHTML = `> ${update}<br>`;
    parentElement.insertBefore(newMessage, document.getElementById('blinker'))
    // document.getElementById('console').insertAdjacentHTML('afterbegin', `> ${update}<br>`);
}

function introduceRule(rule, styleClass) {
    if (!ruleSet[styleClass]) {
        document.getElementById('rule-set').innerHTML += `<li id="${styleClass}" class="${styleClass}">${rule}</li>`;
        document.getElementById(styleClass).style.visibility = 'visible';
        fadeIn(document.getElementById(styleClass));
        ruleSet[styleClass] = true;

        // Also add to mobile list
        document.getElementById('rules-copy').innerHTML += `<li class="${styleClass}">${rule}</li>`;
        document.getElementById(styleClass).style.visibility = 'visible';
    }

    // If multiple rules are introduced at once, the interval will mess up;
    //  bandaid fix is to catch any rules that have no opacity and assign the correct opacity
    document.querySelectorAll('li[class*=\'-rule\']').forEach(function(x) {if (x.style.opacity === '') { x.style.opacity = 1 }});

}

function addToPlayerHand(playerHand, playerHValue) {
    // Only add if there is currently something in the graphic.
    if (document.getElementById('player-cards').innerHTML != '') {
        // Get all cards except last one and put into a stack
        var cardStack = prepCardStringForHTML(drawCardStack(playerHand, orient = 'diag', removeLastNCards = 1));

        document.getElementById('ply-card-holder').innerHTML = '<p>' + cardStack + '</p>';

        // Get last card in hand
        var lastCard = playerHand[playerHand.length - 1];
        var lastCardName = `${lastCard.value}${lastCard.suit}`;

        // Lookup card graphic and insert at end of the card-holder div
        document.getElementById('ply-card-holder')
            .insertAdjacentHTML('beforeend', 
                '<p id="new-card" class="added-card">' + prepCardStringForHTML(cardList.filter(obj => { return obj.cardName === lastCardName })[0].cardEntity) + '</p>')

        fadeIn(document.getElementById('new-card'));
        document.getElementById('new-card').id = '';

        // Update total
        document.getElementById('player-total').innerHTML = `Your Total: <span class="col-emphasis">${calculateHValue(playerHValue).postAceOptions.join(' / ')}</span>`;
    }
}

function drawDealerHand(dealerHand) {
    var cardSelector = [];
    dealerHand.forEach(function(x) { cardSelector.push(`${x.value}${x.suit}`) })

    var cardsToDisplay = [];
    cardsToDisplay.push('<p>' + prepCardStringForHTML(cardList.filter(obj => { return obj.cardName === cardSelector[0] })[0].cardEntity) + '</p>');
    cardsToDisplay.push('<p id="dlr-scd-crd">' + prepCardStringForHTML(cardList[0].cardEntity, backing = true) + '</p>');

    document.getElementById('dealer-cards').innerHTML = '<div class="card-holder" id="dlr-card-holder">' + cardsToDisplay.join('') + '</div>';
}

function revealDealerSecondCard(dealerHand) {

    // Only do this if the dealer has two cards currently and the card hasn't been flipped yet
    if (dealerHand.length === 2 & document.getElementsByClassName('dealer-total').length === 0) {
        updateConsole('Revealing dealer\'s second card');

        var cardSelector = `${dealerHand[dealerHand.length - 1].value}${dealerHand[dealerHand.length - 1].suit}`;
        document.getElementById('dlr-scd-crd').innerHTML = prepCardStringForHTML(cardList.filter(obj => { return obj.cardName === cardSelector })[0].cardEntity);

        // Update total
        document.getElementById('dealer-cards').insertAdjacentHTML('beforeend', 
            `<h2 class="dealer-total" id="dealer-total">Dealer Total: <span class="col-emphasis">${calculateHValue(dealerHValue).postAceOptions.join(' / ')}</span></h2>`);
    }

    ruleFAceCards(cardType = 'face', beforeDealReveal = false, playerHand, dealerHand);
    ruleFAceCards(cardType = 'ace', beforeDealReveal = false, playerHand, dealerHand);

}

function addToDealerHand(dealerHand, dealerHValue) {
    // Only add if there is currently something in the graphic.
    if (document.getElementById('dealer-cards').innerHTML != '') {
        // Get all cards except last one and put into a stack
        var cardStack = prepCardStringForHTML(drawCardStack(dealerHand, orient = 'diag', removeLastNCards = 1));

        document.getElementById('dlr-card-holder').innerHTML = '<p>' + cardStack + '</p>';
        
        // Get last card in hand
        var lastCard = dealerHand[dealerHand.length - 1];
        var lastCardName = `${lastCard.value}${lastCard.suit}`;

        // Lookup card graphic and insert at end of the card-holder div
        document.getElementById('dlr-card-holder')
            .insertAdjacentHTML('beforeend', 
                '<p id="new-card" class="added-card">' + prepCardStringForHTML(cardList.filter(obj => { return obj.cardName === lastCardName })[0].cardEntity) + '</p>')

        fadeIn(document.getElementById('new-card'));
        document.getElementById('new-card').id = '';

        // Update total
        document.getElementById('dealer-total').innerHTML = `Dealer Total: <span class="col-emphasis">${calculateHValue(dealerHValue).postAceOptions.join(' / ')}</span>`;
    }
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

    // Purge graphics
    document.getElementById('player-cards').innerHTML = '';
    document.getElementById('dealer-cards').innerHTML = '';
    // document.getElementById('player-total').innerHTML = '';
    // document.getElementById('dealer-total').innerHTML = '';
}

function endOfRoundState() {
    readyForPlayerInput = false;

    document.getElementById('next-round-button').style.display = 'inline';

    // Hide all buttons
    document.getElementById('hit-button').style.display = "none";
    document.getElementById('stand-button').style.display = "none";
    document.getElementById('split-button').style.display = "none";
    document.getElementById('double-button').style.display = "none";
    document.getElementById('insurance-button').style.display = "none";

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

    drawPlayerHand(playerHand);
    drawDealerHand(dealerHand);

    updateConsole('Cards dealt out');

    ruleFAceCards(cardType = 'face', beforeDealReveal = true, playerHand, dealerHand);
    ruleFAceCards(cardType = 'ace', beforeDealReveal = true, playerHand, dealerHand);

    if (dealerHand[0].numericValue === 24601) {
        introduceRule('if the dealer\'s face-up card is an ace, insurance against the dealer having blackjack may be offered to the player', 'insurance-rule');
        updateConsole('Don\'t do it!');
        document.getElementById('insurance-button').style.display = 'inline';
    }

    // Determine which buttons are available to user
    if (calculateHValue(playerHValue).initialState === 'blackjack') {
        if (calculateHValue(dealerHValue).initialState === 'blackjack') {
            // endOfRoundState();
            readyForPlayerInput = false;

            // Hide all buttons
            document.getElementById('hit-button').style.display = "none";
            document.getElementById('stand-button').style.display = "none";
            document.getElementById('split-button').style.display = "none";
            document.getElementById('double-button').style.display = "none";
            document.getElementById('next-round-button').style.display = 'inline';
            revealDealerSecondCard(dealerHand);
            document.getElementById('player-total').innerHTML += ' <span class="col-purp">PUSH</span>';
            updateScore('draw');
            updateConsole('Both player and dealer have blackjack');
        } else if (calculateHValue(dealerHValue).initialState != 'blackjack') {
            // endOfRoundState(); // NOT EVEN THIS WORKS - need to figure out why.
            readyForPlayerInput = false;

            // Hide all buttons
            document.getElementById('hit-button').style.display = "none";
            document.getElementById('stand-button').style.display = "none";
            document.getElementById('split-button').style.display = "none";
            document.getElementById('double-button').style.display = "none";
            document.getElementById('next-round-button').style.display = 'inline';
            revealDealerSecondCard(dealerHand);
            document.getElementById('player-total').innerHTML += ' <span class="col-gree">BLACKJACK</span>';
            updateScore('b');
            updateConsole('Player has blackjack');
        }
    }

    if (playerHValue[0] === playerHValue[1]) { 
        introduceRule('if both cards are worth the same value, the player may split their hand', 'split-rule');
        document.getElementById('split-button').style.display = 'inline'; 
        updateConsole('Player cards have equal value; split option available');
    }

    if ((calculateHValue(playerHValue).postAceOptions.length === 1) && (calculateHValue(playerHValue).postAceOptions[0] >= 9 && calculateHValue(playerHValue).postAceOptions[0] <= 11)) {
        introduceRule('if the player\'s total is <span class="col-emphasis">9</span>, <span class="col-emphasis">10</span>, or <span class="col-emphasis">11</span>, they may double their bet', 'double-rule');
        document.getElementById('double-button').style.display = 'inline';
        updateConsole('Player card sum is between 9 and 11; double option available');
    }

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

    // Sum value of remaining items in hand
    var preAceSum = HValueArray_copy.reduce((a, b) => a + b, 0);
    var postAceOptions;

    result.preAceSum = preAceSum;

    // Handle adding Aces.
    //  Since there's such a limited amount of combinations, there's probably no need to 
    //  pursue this programatically.
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
                updateConsole('Dealer has blackjack');
            } else {
                result.outcome = 'draw';
                result.note = 'Both parties have blackjack';
                updateConsole('Both dealer and player have blackjack');
            }

        //  If dealer has one ace and counting it as 11 will bring the card total to 17 or more (but not over 21); the dealer has to count it as 11 and stand.    
        } else if ((dealerHValuetmp.filter(obj => { return obj === 24601 }).length >= 1) && 
            /*(dealerCurrentHand.preAceSum >= 6 && dealerCurrentHand.preAceSum <= 10)*/
            (Math.max.apply(null, dealerCurrentHand.postAceOptions) >= 17 && Math.max.apply(null, dealerCurrentHand.postAceOptions) <= 21)) {
            if (verbose) {console.log('Dealer has ace that can bring total to between 17 and 21')};
            updateConsole('Dealer has ace/s that will bring sum to between 17 and 21; must stand with this total')
            document.getElementById('dealer-total').innerHTML = `Dealer Total: <span class="col-emphasis">${Math.max.apply(null, dealerCurrentHand.postAceOptions)}</span>`;

            // Dealer hand value will be 11 + other card value; dealer must stand
            //  This bugs out when there are two aces, e.g. A + A + 8 should evaluate to 20, but doing 11 + preAceSum = 19 which isn't correct.
            result.dealerValue = Math.max.apply(null, dealerCurrentHand.postAceOptions) // 11 + dealerCurrentHand.preAceSum

            if (result.dealerValue > result.playerValue) {
                result.outcome = 'lose';
                result.note = 'Dealer hand greater than player hand';
                updateConsole('Dealer has a greater hand');
            } else if (result.dealerValue === result.playerValue) {
                result.outcome = 'draw';
                result.note = 'Dealer hand equal to player hand';
                updateConsole('Dealer hand is equal to player hand');
            } else if (result.dealerValue < result.playerValue) {
                result.outcome = 'win';
                result.note = 'Player hand greater than dealer hand';
                updateConsole('Player has a greater hand');
            }

        // If dealer has no options remaining under 21, the dealer goes bust
        } else if (dealerCurrentHand.postAceOptions.filter(obj => { return obj <= 21 }).length === 0) {
            if (verbose) {console.log('Dealer has no options under or equal to 21 - bust')};
            updateConsole('Dealer has no options under or equal to 21 - bust');

            result.dealerValue = Math.min.apply(null, dealerCurrentHand.postAceOptions);
            document.getElementById('dealer-total').innerHTML += ' <span class="col-oran">BUST</span>';

            result.outcome = 'win';
            result.note = 'Dealer went bust'; 

        // If dealer's options start at 17 or more, the dealer must stand
        } else if (Math.min.apply(null, dealerCurrentHand.postAceOptions.filter(obj => { return obj <= 21 })) >= 17) {
            if (verbose) {console.log('Dealer\'s options start at 17 or more - must stand')};
            updateConsole('Dealer\'s options start at 17 or more - must stand');

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

                updateConsole('Dealer\'s options max out under 17 - must hit');
                dealerHandtmp.push(shoe.shift());
                dealerHValuetmp.push(dealerHandtmp[dealerHandtmp.length - 1].numericValue);
                dealerCurrentHand = calculateHValue(dealerHValuetmp);
                console.log(dealerHandtmp);
                console.log(dealerHValuetmp);
                addToDealerHand(dealerHandtmp, dealerHValuetmp);
                updateShoeCount(shoe);
                ruleFAceCards(cardType = 'face', beforeDealReveal = false, playerHand, dealerHandtmp);
                ruleFAceCards(cardType = 'ace', beforeDealReveal = false, playerHand, dealerHandtmp);

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

function resetForNextRound() {
    readyForPlayerInput = false;

    if (shoe.length <= safetyCardPosition) {
        console.log('Safety card passed; reshuffling deck')
        updateConsole('Cut card passed, re-shuffling deck')

        // Initiate new deck and re-calculate the safety card position
        shoe = shuffle(deck_1.concat(deck_2, deck_3, deck_4, deck_5, deck_6));
        safetyCardPosition = Math.floor(Math.random() * (76 - 61) + 61);
        initiateDeckSetup(shoe); updateConsole('Top card discarded');

        // Deal cards
        dealCards(shoe);

    } else {

        // Purge hands and re-deal cards
        dealCards(shoe);

    }

    document.getElementById('next-round-button').style.display = 'none';
    document.getElementById('hit-button').style = "inline";
    document.getElementById('stand-button').style = "inline";
    readyForPlayerInput = true;
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

function updateScore(outcome) {
    console.log(`Score before update: ${scoreCount}`);
    if (outcome === 'win' || outcome === 'w') {
        scoreCount++

        if (!window.matchMedia("(max-width: 962px)").matches) {
            document.getElementById('score-counter').innerHTML += ` <span id="delta" class="col-gree"'>+1</span>`;
        } else {
            if ((document.querySelector('.page-title').innerHTML.match(/\n/g) || []).length === 2) {
                var t = 0;
                document.querySelector('.page-title').innerHTML = document.querySelector('.page-title').innerHTML.replace(/\n/g, match => ++t === 2 ? `<span id="delta" class="col-gree"'>+1</span>` : match)
            } else {
                document.querySelector('.page-title').innerHTML += `<span id="delta" class="col-gree"'>+1</span>`;
            }
        }

    } else if (outcome === 'blackjack' || outcome === 'b') {
        scoreCount = scoreCount + 1.5;

        if (!window.matchMedia("(max-width: 962px)").matches) {
            document.getElementById('score-counter').innerHTML += ` <span id="delta" class="col-gree"'>+1.5</span>`;
        } else {
            if ((document.querySelector('.page-title').innerHTML.match(/\n/g) || []).length === 2) {
                var t = 0;
                document.querySelector('.page-title').innerHTML = document.querySelector('.page-title').innerHTML.replace(/\n/g, match => ++t === 2 ? ` <span id="delta" class="col-gree"'>+1.5</span>` : match)
            } else {
                document.querySelector('.page-title').innerHTML += `<span id="delta" class="col-gree"'>+1.5</span>`;
            }
        }

    } else if (outcome === 'lose' || outcome === 'l') {
        scoreCount--
       
        if (!window.matchMedia("(max-width: 962px)").matches) {
            document.getElementById('score-counter').innerHTML += ` <span id="delta" class="col-oran"'>-1</span>`;
        } else {
            if ((document.querySelector('.page-title').innerHTML.match(/\n/g) || []).length === 2) {
                var t = 0;
                document.querySelector('.page-title').innerHTML = document.querySelector('.page-title').innerHTML.replace(/\n/g, match => ++t === 2 ? ` <span id="delta" class="col-oran"'>-1</span>` : match)
            } else {
                document.querySelector('.page-title').innerHTML += `<span id="delta" class="col-oran"'>-1</span>`;
            }
        }

    } else if (outcome === 'draw' || outcome === 'd') {

        if (!window.matchMedia("(max-width: 962px)").matches) {
            document.getElementById('score-counter').innerHTML += ` <span id="delta" class="col-emphasis"'>+0</span>`;
        } else {
            if ((document.querySelector('.page-title').innerHTML.match(/\n/g) || []).length === 2) {
                var t = 0;
                document.querySelector('.page-title').innerHTML = document.querySelector('.page-title').innerHTML.replace(/\n/g, match => ++t === 2 ? ` <span id="delta" class="col-emphasis"'>+0</span>` : match)
            } else {
                document.querySelector('.page-title').innerHTML += `<span id="delta" class="col-emphasis"'>+0</span>`;
            }
        }
    } else if (outcome === 'insurance-win' || outcome === 'i-w') {
        scoreCount = scoreCount + 0.5;
        if (!window.matchMedia("(max-width: 962px)").matches) {
            document.getElementById('score-counter').innerHTML += ` <span id="delta" class="col-gree"'>+0.5</span>`;
        } else {
            if ((document.querySelector('.page-title').innerHTML.match(/\n/g) || []).length === 2) {
                var t = 0;
                document.querySelector('.page-title').innerHTML = document.querySelector('.page-title').innerHTML.replace(/\n/g, match => ++t === 2 ? ` <span id="delta" class="col-gree"'>+1.5</span>` : match)
            } else {
                document.querySelector('.page-title').innerHTML += `<span id="delta" class="col-gree"'>+0.5</span>`;
            }
        }
    } else if (outcome === 'insurance-loss' || outcome === 'i-l') {
        scoreCount = scoreCount - 0.5;
        if (!window.matchMedia("(max-width: 962px)").matches) {
            document.getElementById('score-counter').innerHTML += ` <span id="delta" class="col-oran"'>-0.5</span>`;
        } else {
            if ((document.querySelector('.page-title').innerHTML.match(/\n/g) || []).length === 2) {
                var t = 0;
                document.querySelector('.page-title').innerHTML = document.querySelector('.page-title').innerHTML.replace(/\n/g, match => ++t === 2 ? ` <span id="delta" class="col-gree"'>+1.5</span>` : match)
            } else {
                document.querySelector('.page-title').innerHTML += `<span id="delta" class="col-oran"'>-0.5</span>`;
            }
        }
    }

    fadeIn(document.getElementById('delta'), timeToFade = 20, removeElement = true);

    document.getElementById('score-ticker-value').innerHTML = scoreCount;
    document.getElementById('score-ticker-value-2').innerHTML = scoreCount;
    console.log(`Score after update: ${scoreCount}`);
}

function ruleFAceCards(cardType = 'face', beforeDealReveal = true, playerHand, dealerHand) {
    if (beforeDealReveal) {
        if (cardType === 'face') {
            if (playerHand.map(({ value }) => value).includes('K') ||
                playerHand.map(({ value }) => value).includes('Q') ||
                playerHand.map(({ value }) => value).includes('J') ||
                ['K', 'Q', 'J'].includes(dealerHand[0].value)) {
                introduceRule('face cards are worth <span class="col-emphasis">10</span>', 'face-rule');
            }
        } else if (cardType === 'ace') {
            if (playerHand.map(({ value }) => value).includes('A') ||
                ['A'].includes(dealerHand[0].value)) {
                introduceRule('aces are worth <span class="col-emphasis">1</span> or <span class="col-emphasis">11</span>', 'ace-rule');
            }
        }
    } else {
        if (cardType === 'face') {
            if (playerHand.map(({ value }) => value).includes('K') ||
                playerHand.map(({ value }) => value).includes('Q') ||
                playerHand.map(({ value }) => value).includes('J') ||
                dealerHand.map(({ value }) => value).includes('K') ||
                dealerHand.map(({ value }) => value).includes('Q') ||
                dealerHand.map(({ value }) => value).includes('J')) {
                introduceRule('face cards are worth <span class="col-emphasis">10</span>', 'face-rule');
            }
        } else if (cardType === 'ace') {
            if (playerHand.map(({ value }) => value).includes('A') ||
                dealerHand.map(({ value }) => value).includes('A')) {
                introduceRule('aces are worth <span class="col-emphasis">1</span> or <span class="col-emphasis">11</span>', 'ace-rule');
            }
        }

    }
}

// Initiate rule switches
var ruleSet = {'face-rule': false, 'ace-rule': false, 'split-rule': false, 'double-rule': false, 'insurance-rule': false}

// Initialise score counter
var scoreCount = 0;

// Set default timeout (in ms) for dealer turns
var timeOut = 600;

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
var shoe = shuffle(deck_1.concat(deck_2, deck_3, deck_4, deck_5, deck_6));
updateConsole('Six decks initiated and shuffled')

// Insert safety card/card cut (between 75 and 61 cards)
var safetyCardPosition = Math.floor(Math.random() * (76 - 61) + 61);
updateConsole('Cut card inserted')

// Await user input
var faceRuleSwitch = false;
var aceRuleSwitch = false;
var playerInputForRound = 'none';
var readyForPlayerInput = true;

initiateDeckSetup(shoe);
updateConsole('Top card discarded; ready to play')

dealCards(shoe); // Outputs numerical values to *Hand and *HValue arrays.

updateShoeCount(shoe);

console.log('Player:', playerHand);
console.log('Dealer:', dealerHand);

var dealerFirstCard = dealerHand[0];
var dealerFirstHValue = dealerHValue[0];

// console.log(performSim_stand(n = 1000, dealerHand = dealerHand, shoeForSim = shoe, numCardsAhead = 25, verbose = true));

updateConsole('Awaiting user input')

document.getElementById('hit-button').addEventListener('click', function() {

    if (readyForPlayerInput) {

        // Copy off the hand so the original hand is unmodified
        var playerHandtmp = JSON.parse(JSON.stringify(playerHand));
        var playerHValuetmp = JSON.parse(JSON.stringify(playerHValue));

        playerInputForRound = 'hit';
        console.log('Player has chosen to hit'); updateConsole('Player has chosen to hit');
        readyForPlayerInput = false;

        // If player hits, will need to transfer a card from the shoe into their hand
        //  and re-calculate their hand value.
        playerHandtmp.push(shoe.shift());
        playerHValuetmp.push(playerHandtmp[playerHandtmp.length - 1].numericValue);
        console.log(playerHandtmp);
        addToPlayerHand(playerHandtmp, playerHValuetmp); // Draw graphic
        updateShoeCount(shoe);
        ruleFAceCards(cardType = 'face', beforeDealReveal = false, playerHandtmp, dealerHand);
        ruleFAceCards(cardType = 'ace', beforeDealReveal = false, playerHandtmp, dealerHand);

        // Check if their hand exceeds 21; if it does, then the hand is bust; reset the round
        if (Math.min.apply(null, calculateHValue(playerHValuetmp).postAceOptions) > 21) {
            console.log('Player has gone bust'); updateConsole('Player has gone bust');
            document.getElementById('player-total').innerHTML += ' <span class="col-oran">BUST</span>';
            updateScore('lose');

            playerHand = playerHandtmp;
            playerHValue = playerHValuetmp;

            // Show next round button
            revealDealerSecondCard(dealerHand);
            endOfRoundState();
            // document.getElementById('next-round-button').style.display = 'inline';

        } else if (calculateHValue(playerHValuetmp).postAceOptions.includes(21)) {
            console.log('Player has blackjack'); 

            if (calculateHValue(dealerHValue).initialState === 'blackjack') {
                revealDealerSecondCard(dealerHand);
                document.getElementById('player-total').innerHTML += ' <span class="col-purp">PUSH</span>';
                updateScore('draw');
                console.log('Both player and dealer have blackjack');
                updateConsole('Both player and dealer have blackjack');
            } else {
                revealDealerSecondCard(dealerHand);
                document.getElementById('player-total').innerHTML += ' <span class="col-gree">BLACKJACK</span>';
                updateScore('b');
                console.log('Player has blackjack');
                updateConsole('Player has blackjack');
            }

            // Show next round button
            endOfRoundState();
            // document.getElementById('next-round-button').style.display = 'inline';

        } else {
            console.log('No bust, player can go again');
            updateConsole('Player sum under 21, player can make another move');

            playerHand = playerHandtmp;
            playerHValue = playerHValuetmp;

            readyForPlayerInput = true;
        }

    } else { console.log('Game not ready for player input'); }

})

document.getElementById('stand-button').addEventListener('click', function() {

    if (readyForPlayerInput) { // Also add the shoe.length > ... here?

        // Copy off the hand so the original hand is unmodified
        var playerHandtmp = JSON.parse(JSON.stringify(playerHand));
        var playerHValuetmp = JSON.parse(JSON.stringify(playerHValue));
        var dealerHandtmp = JSON.parse(JSON.stringify(dealerHand));
        var dealerHValuetmp = JSON.parse(JSON.stringify(dealerHValue));

        playerInputForRound = 'stand';
        console.log('Player has chosen to stand'); updateConsole('Player has chosen to stand');
        readyForPlayerInput = false;

        // If player stands, transfer to dealer's turn
        //   Reveal dealer's second card
        //   Dealer hits until 17
        //    Either bust or under 21 and beats player
        revealDealerSecondCard(dealerHand);
        var dealerResult = dealerPlay(shoe, playerHandtmp, playerHValuetmp, dealerHandtmp, dealerHValuetmp, verbose = true);

        switch(dealerResult.outcome) {
            case 'win':
                console.log('Player wins');
                document.getElementById('player-total').innerHTML += ' <span class="col-gree">WIN</span>';
                updateScore('win');
                updateConsole('Player wins');
                break;
            case 'lose':
                console.log('Player loses');
                document.getElementById('player-total').innerHTML += ' <span class="col-oran">LOSE</span>';
                updateScore('lose');
                updateConsole('Player loses');
                break;
            case 'draw':
                console.log('Draw');
                document.getElementById('player-total').innerHTML += ' <span class="col-purp">PUSH</span>';
                updateScore('draw');
                updateConsole('Draw');
                break;

        }

        // document.getElementById('next-round-button').style.display = 'inline';
        endOfRoundState();

    } else { console.log('Game not ready for player input'); }

})

document.getElementById('next-round-button').addEventListener('click', resetForNextRound);

document.getElementById('insurance-button').addEventListener('click', function () {
    readyForPlayerInput = false;

    // If second dealer card is a face, then player gains 0.5 and dealer gets blackjack, so player loses
    if (dealerHand[1].numericValue === 10) {
        // Reveal dealer second card
        revealDealerSecondCard(dealerHand);

        // Win insurance
        updateScore('i-w');

        // Lose game
        document.getElementById('player-total').innerHTML += ' <span class="col-oran">LOSE</span>';
        updateScore('l');

        endOfRoundState();

    // If second dealer card is not a face, then player loses 0.5
    } else {
        // Lose insurance
        updateScore('i-l');

        document.getElementById('player-total').innerHTML += ' <span class="col-oran">INSURANCE LOST</span>';

        // Hide insurance button and allow further action.
        document.getElementById('insurance-button').style.display = 'none';
        readyForPlayerInput = true;
    }
    
})

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

setInterval(function () {

    if (!window.matchMedia("(max-width: 962px)").matches) {
        if (document.querySelector('.dropdwn-content-mobile').style.opacity != '' &&
            document.querySelector('.dropdwn-content-mobile').style.height  != '') {
                document.querySelector('.dropdwn-content-mobile').style.opacity = '';
                document.querySelector('.dropdwn-content-mobile').style.height  = '';
            }

        if (document.querySelector('.dropdwn-btn').style.backgroundColor != '' &&
            document.querySelector('.dropdwn-btn').style.color != '') {
                document.querySelector('.dropdwn-btn').style.backgroundColor = '';
                document.querySelector('.dropdwn-btn').style.color = '';
            }

        if (document.querySelector('.dropdwn-btn').innerHTML === 'rules +') {
            document.querySelector('.dropdwn-btn').innerHTML = '+';
            document.querySelector('.dropdwn-btn').style.fontSize = '';
        }

    } else {

        // Change + to 'rules +'
        document.querySelector('.dropdwn-btn').innerHTML = 'rules +';
        document.querySelector('.dropdwn-btn').style.fontSize = '1.3rem';

    }

}, 100);


// Media Queries
//  If mobile, have top-right navbar be clickable - have a different side-bar open
document.querySelector('.navbar-dropdown').onclick = function() {
    if (window.matchMedia("(max-width: 962px)").matches === true) {
        if (document.querySelector('.dropdwn-content-mobile').style.display === '' &&
            document.querySelector('.dropdwn-content-mobile').style.opacity === '' &&
            document.querySelector('.dropdwn-content-mobile').style.height === '') {

                // Navbar
                document.querySelector('.dropdwn-content-mobile').style.opacity = '1';
                document.querySelector('.dropdwn-content-mobile').style.height  = '80vh';

                // Button
                document.querySelector('.dropdwn-btn').style.backgroundColor = '#999999';
                document.querySelector('.dropdwn-btn').style.color = '#2d2d2d';

            } else {

                // Navbar
                document.querySelector('.dropdwn-content-mobile').style.opacity = '';
                document.querySelector('.dropdwn-content-mobile').style.height  = '';

                // Button
                document.querySelector('.dropdwn-btn').style.backgroundColor = '';
                document.querySelector('.dropdwn-btn').style.color = '';

            }
    }
}

document.querySelector('.navbar-dropdown').onmouseenter = function() {
    if (!window.matchMedia('(max-width: 962px)').matches) {
        document.querySelector('.navbar-dropdown .dropdwn-content').style.display = 'block';
        document.querySelector('.navbar-dropdown .dropdwn-content').style.opacity = '1';
        document.querySelector('.navbar-dropdown .dropdwn-content').style.height = '6rem';
    }

}

document.querySelector('.navbar-dropdown').onmouseleave = function() {
    document.querySelector('.navbar-dropdown .dropdwn-content').style.display = '';
    document.querySelector('.navbar-dropdown .dropdwn-content').style.opacity = '';
    document.querySelector('.navbar-dropdown .dropdwn-content').style.height = '';
}
