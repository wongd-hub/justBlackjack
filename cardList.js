const cardList = [
    {
        cardName: 'cardBacking',
        cardEntity:` _____ <br>|<span>\\ ~ /</span>|<br>|<span>}}:{{</span>|<br>|<span>}}:{{</span>|<br>|<span>}}:{{</span>|<br>|<span>/</span>_<span>~</span>_<span>\\</span>|`
    },
    {
        cardName: 'Aspades',
        cardEntity: ` _____ <br>|<span>A</span> .  |<br>| /.\\ |<br>|(_._)|<br>|  |  |<br>|____<span>A</span>|`
    },
    {
        cardName: '2spades',
        cardEntity:` _____ <br>|<span>2</span>    |<br>|  ^  |<br>|     |<br>|  ^  |<br>|____<span>2</span>|`
    },
    {
        cardName: '3spades',
        cardEntity:` _____ <br>|<span>3</span>    |<br>| ^ ^ |<br>|     |<br>|  ^  |<br>|____<span>3</span>|`
    },
    {
        cardName: '4spades',
        cardEntity:` _____ <br>|<span>4</span>    |<br>| ^ ^ |<br>|     |<br>| ^ ^ |<br>|____<span>4</span>|`
    },
    {
        cardName: '5spades',
        cardEntity:` _____ <br>|<span>5</span>    |<br>| ^ ^ |<br>|  ^  |<br>| ^ ^ |<br>|____<span>5</span>|`
    },
    {
        cardName: '6spades',
        cardEntity:` _____ <br>|<span>6</span>    |<br>| ^ ^ |<br>| ^ ^ |<br>| ^ ^ |<br>|____<span>6</span>|`
    },
    {
        cardName: '7spades',
        cardEntity:` _____ <br>|<span>7</span>    |<br>| ^ ^ |<br>|^ ^ ^|<br>| ^ ^ |<br>|____<span>7</span>|`
    },
    {
        cardName: '8spades',
        cardEntity:` _____ <br>|<span>8</span>    |<br>|^ ^ ^|<br>| ^ ^ |<br>|^ ^ ^|<br>|____<span>8</span>|`
    },
    {
        cardName: '9spades',
        cardEntity:` _____ <br>|<span>9</span>    |<br>|^ ^ ^|<br>|^ ^ ^|<br>|^ ^ ^|<br>|____<span>9</span>|`
    },
    {
        cardName: '10spades',
        cardEntity:` _____ <br>|<span>10</span> ^ |<br>|^ ^ ^|<br>|^ ^ ^|<br>|^ ^ ^|<br>|___<span>10</span>|`
    },
    {
        cardName: 'Jspades',
        cardEntity:` _____ <br>|<span>J</span>  ww|<br>| ^ {)|<br>|(.)% |<br>| | % |<br>|__%%<span>J</span>|`
    },
    {
        cardName: 'Qspades',
        cardEntity:` _____ <br>|<span>Q</span>  ww|<br>| ^ {(|<br>|(.)%%|<br>| |%%%|<br>|_%%%<span>Q</span>|`
    },
    {
        cardName: 'Kspades',
        cardEntity:` _____ <br>|<span>K</span>  WW|<br>| ^ {)|<br>|(.)%%|<br>| |%%%|<br>|_%%%<span>K</span>|`
    },
    {
        cardName: 'Aclubs',
        cardEntity:` _____ <br>|<span>A</span> _  |<br>| ( ) |<br>|(_'_)|<br>|  |  |<br>|____<span>A</span>|`
    },
    {
        cardName: '2clubs',
        cardEntity:` _____ <br>|<span>2</span>    |<br>|  &  |<br>|     |<br>|  &  |<br>|____<span>2</span>|`
    },
    {
        cardName: '3clubs',
        cardEntity:` _____ <br>|<span>3</span>    |<br>| & & |<br>|     |<br>|  &  |<br>|____<span>3</span>|`
    },
    {
        cardName: '4clubs',
        cardEntity:` _____ <br>|<span>4</span>    |<br>| & & |<br>|     |<br>| & & |<br>|____<span>4</span>|`
    },
    {
        cardName: '5clubs',
        cardEntity:` _____ <br>|<span>5</span>    |<br>| & & |<br>|  &  |<br>| & & |<br>|____<span>5</span>|`
    },
    {
        cardName: '6clubs',
        cardEntity:` _____ <br>|<span>6</span>    |<br>| & & |<br>| & & |<br>| & & |<br>|____<span>6</span>|`
    },
    {
        cardName: '7clubs',
        cardEntity:` _____ <br>|<span>7</span>    |<br>| & & |<br>|& & &|<br>| & & |<br>|____<span>7</span>|`
    },
    {
        cardName: '8clubs',
        cardEntity:` _____ <br>|<span>8</span>    |<br>|& & &|<br>| & & |<br>|& & &|<br>|____<span>8</span>|`
    },
    {
        cardName: '9clubs',
        cardEntity:` _____ <br>|<span>9</span>    |<br>|& & &|<br>|& & &|<br>|& & &|<br>|____<span>9</span>|`
    },
    {
        cardName: '10clubs',
        cardEntity:` _____ <br>|<span>10</span> & |<br>|& & &|<br>|& & &|<br>|& & &|<br>|___<span>10</span>|`
    },
    {
        cardName: 'Jclubs',
        cardEntity:` _____ <br>|<span>J</span>  ww|<br>| o {)|<br>|o o% |<br>| | % |<br>|__%%<span>J</span>|`
    },
    {
        cardName: 'Qclubs',
        cardEntity:` _____ <br>|<span>Q</span>  ww|<br>| o {(|<br>|o o%%|<br>| |%%%|<br>|_%%%<span>Q</span>|`
    },
    {
        cardName: 'Kclubs',
        cardEntity:` _____ <br>|<span>K</span>  WW|<br>| o {)|<br>|o o%%|<br>| |%%%|<br>|_%%%<span>K</span>|`
    },
    {
        cardName: 'Ahearts',
        cardEntity:` _____ <br>|<span>A</span>_ _ |<br>|( v )|<br>| \\ / |<br>|  .  |<br>|____<span>A</span>|`
    },
    {
        cardName: '2hearts',
        cardEntity:` _____ <br>|<span>2</span>    |<br>|  v  |<br>|     |<br>|  v  |<br>|____<span>2</span>|`
    },
    {
        cardName: '3hearts',
        cardEntity:` _____ <br>|<span>3</span>    |<br>| v v |<br>|     |<br>|  v  |<br>|____<span>3</span>|`
    },
    {
        cardName: '4hearts',
        cardEntity:` _____ <br>|<span>4</span>    |<br>| v v |<br>|     |<br>| v v |<br>|____<span>4</span>|`
    },
    {
        cardName: '5hearts',
        cardEntity:` _____ <br>|<span>5</span>    |<br>| v v |<br>|  v  |<br>| v v |<br>|____<span>5</span>|`
    },
    {
        cardName: '6hearts',
        cardEntity:` _____ <br>|<span>6</span>    |<br>| v v |<br>| v v |<br>| v v |<br>|____<span>6</span>|`
    },
    {
        cardName: '7hearts',
        cardEntity:` _____ <br>|<span>7</span>    |<br>| v v |<br>|v v v|<br>| v v |<br>|____<span>7</span>|`
    },
    {
        cardName: '8hearts',
        cardEntity:` _____ <br>|<span>8</span>    |<br>|v v v|<br>| v v |<br>|v v v|<br>|____<span>8</span>|`
    },
    {
        cardName: '9hearts',
        cardEntity:` _____ <br>|<span>9</span>    |<br>|v v v|<br>|v v v|<br>|v v v|<br>|____<span>9</span>|`
    },
    {
        cardName: '10hearts',
        cardEntity:` _____ <br>|<span>10</span> v |<br>|v v v|<br>|v v v|<br>|v v v|<br>|___<span>10</span>|`
    },
    {
        cardName: 'Jhearts',
        cardEntity:` _____ <br>|<span>J</span>  ww|<br>|   {)|<br>|(v)% |<br>| v % |<br>|__%%<span>J</span>|`
    },
    {
        cardName: 'Qhearts',
        cardEntity:` _____ <br>|<span>Q</span>  ww|<br>|   {(|<br>|(v)%%|<br>| v%%%|<br>|_%%%<span>Q</span>|`
    },
    {
        cardName: 'Khearts',
        cardEntity:` _____ <br>|<span>K</span>  WW|<br>|   {)|<br>|(v)%%|<br>| v%%%|<br>|_%%%<span>K</span>|`
    },
    {
        cardName: 'Adiamonds',
        cardEntity:` _____ <br>|<span>A</span>_ _ |<br>|( v )|<br>| \\ / |<br>|  .  |<br>|____<span>A</span>|`
    },
    {
        cardName: '2diamonds',
        cardEntity:` _____ <br>|<span>2</span>    |<br>|  o  |<br>|     |<br>|  o  |<br>|____<span>2</span>|`
    },
    {
        cardName: '3diamonds',
        cardEntity:` _____ <br>|<span>3</span>    |<br>| o o |<br>|     |<br>|  o  |<br>|____<span>3</span>|`
    },
    {
        cardName: '4diamonds',
        cardEntity:` _____ <br>|<span>4</span>    |<br>| o o |<br>|     |<br>| o o |<br>|____<span>4</span>|`
    },
    {
        cardName: '5diamonds',
        cardEntity:` _____ <br>|<span>5</span>    |<br>| o o |<br>|  o  |<br>| o o |<br>|____<span>5</span>|`
    },
    {
        cardName: '6diamonds',
        cardEntity:` _____ <br>|<span>6</span>    |<br>| o o |<br>| o o |<br>| o o |<br>|____<span>6</span>|`
    },
    {
        cardName: '7diamonds',
        cardEntity:` _____ <br>|<span>7</span>    |<br>| o o |<br>|o o o|<br>| o o |<br>|____<span>7</span>|`
    },
    {
        cardName: '8diamonds',
        cardEntity:` _____ <br>|<span>8</span>    |<br>|o o o|<br>| o o |<br>|o o o|<br>|____<span>8</span>|`
    },
    {
        cardName: '9diamonds',
        cardEntity:` _____ <br>|<span>9</span>    |<br>|o o o|<br>|o o o|<br>|o o o|<br>|____<span>9</span>|`
    },
    {
        cardName: '10diamonds',
        cardEntity:` _____ <br>|<span>10</span> o |<br>|o o o|<br>|o o o|<br>|o o o|<br>|___<span>10</span>|`
    },
    {
        cardName: 'Jdiamonds',
        cardEntity:` _____ <br>|<span>J</span>  ww|<br>| /\\{)|<br>| \\/% |<br>|   % |<br>|__%%<span>J</span>|`
    },
    {
        cardName: 'Qdiamonds',
        cardEntity:` _____ <br>|<span>Q</span>  ww|<br>| /\\{(|<br>| \\/%%|<br>|  %%%|<br>|_%%%<span>Q</span>|`
    },
    {
        cardName: 'Kdiamonds',
        cardEntity:` _____ <br>|<span>K</span>  WW|<br>| /\\{)|<br>| \\/%%|<br>|  %%%|<br>|_%%%<span>K</span>|`
    }
]

// Replace spaces with &nbsp; and add proper class to span elements
function prepCardStringForHTML(cardElement, backing = false) {
    if (!backing) {
        var tmp = cardElement.replace(/\s/g, '&nbsp;');
        var t = 0;
        var tmp_1 = tmp.replace(/<span>/g, match => ++t === 1 ? '<span class="col-emphasis">' : match)
                .replace(/<span>/g, '<span class="col-emphasis bottom-pip">');
    
        return tmp_1;
    } else {
        return cardElement.replace(/\s/g, '&nbsp;').replace(/<span>/g, '<span class="card-backing">');
    }
}

function drawCardStack(hand, orient = 'row', removeLastNCards = 0) {
    var handTmp = hand.slice(0, hand.length - removeLastNCards);

    if (handTmp.length === 1) {return null}

    function pullFirstThreeChars(hand, index, orient = 'row') { 
        return cardList
            .filter(obj => {return obj.cardName === hand[index].value + hand[index].suit})[0]
            .cardEntity
            .split('<br>')
            .map(function(el, i) { 
                if (i === 0 && orient === 'diag') {
                    return el
                } else if (i === 1) {
                    return el.slice(0, 16)
                } else {
                    return el.slice(0, 3)
                }
            });
    }

    if (orient === 'row') {

        var leftSides = pullFirstThreeChars(handTmp, 0, 'row');

        // Handle cards between first and last (if they exist)
        for (let j = 1; j <= handTmp.length - 2; j++) {
            var toAdd = pullFirstThreeChars(handTmp, j, 'row');
            for (let k = 0; k <= leftSides.length - 1; k++) { leftSides[k] = leftSides[k] + toAdd[k]; }
        }

        // Add final card on
        var finalCard = cardList
            .filter(obj => {return obj.cardName === handTmp[handTmp.length - 1].value + handTmp[handTmp.length - 1].suit})[0]
            .cardEntity
            .split('<br>');

        for (let j = 0; j <= leftSides.length - 1; j++) { leftSides[j] = leftSides[j] + finalCard[j]; }

        return leftSides.join('<br>');

    } else if (orient === 'diag') {

        var leftSides = pullFirstThreeChars(handTmp, 0, 'diag');

        // Handle cards between first and last (if they exist)
        for (let j = 1; j <= handTmp.length - 2; j++) {
            var toAdd = pullFirstThreeChars(handTmp, j, 'diag');
            var len = leftSides.length;
            for (let k = 0; k <= len; k++) { 
                if (k >= j && k <= len - 1) {
                    leftSides[k] = leftSides[k] + toAdd[k - j];
                } else if (k === len) {
                    leftSides[k] = '   '.repeat(j) + toAdd[k - j];
                }    
            }
        }

        // Add final card on
        var finalCard = cardList
            .filter(obj => {return obj.cardName === handTmp[handTmp.length - 1].value + handTmp[handTmp.length - 1].suit})[0]
            .cardEntity
            .split('<br>');

        var len = leftSides.length;
        for (let j = 0; j <= len; j++) { 
            if (j >= handTmp.length - 1 && j <= len - 1) {
                leftSides[j] = leftSides[j] + finalCard[j - handTmp.length + 1];
            } else if (j === len) {
                leftSides[j] = '   '.repeat(handTmp.length - 1) + finalCard[j - handTmp.length + 1];
            }    
        }

        return leftSides.join('<br>');
    }

}

// var test = prepCardStringForHTML(drawCardStack(playerHand, 'row'))
// document.getElementById('dealer-cards').innerHTML = '<p>' + test + '</p>';

// playerHand.push(shoe.shift());
// document.getElementById('dealer-cards').innerHTML = '<p>' + prepCardStringForHTML(drawCardStack(playerHand, 'diag')) + '</p>';