
const cards = require("./json/cards.json");
const deckstrings = require("deckstrings");

const findCardById = function(id) {

    for (set in cards) {

        for (c in cards[set]) {
            
            if (cards[set][c]["dbfId"] == id) {
                return cards[set][c];
            }

        }

    }

    return {};

};

const printDeck = function(code) {

    var deckstring = "";

    var decoded = deckstrings.decode(code);
    
    var hero = findCardById(decoded.heroes[0]);
    if (!hero) {
        return "***Missing or invalid deck code!***";
    }

    var maxLength = 0;
    var cards = [];
    for (var i = 0; i < decoded.cards.length; i++) {
        var card = findCardById(decoded.cards[i][0]);

        if (card.name.length > maxLength) {
            maxLength = card.name.length;
        }

        cards.push({
            card: card,
            amount: decoded.cards[i][1]
        });
    }

    if (cards.length === 0) {
        return "***Missing or invalid deck code!***";
    }

    cards.sort(
        function(a, b) {
            if (a.card.cost != b.card.cost) {
                return a.card.cost - b.card.cost;
            }
            else {
                return a.card.name - b.card.name;
            }
        }
    );

    maxLength += 2;
    deckstring = "**" + hero.name + " (" + hero.playerClass + ")**\n";
    deckstring = deckstring + "```";
    for (var j = 0; j < cards.length; j++) {

        var buffer = "";
        for (var k = 0; k < maxLength - cards[j].card.name.length; k++) {
            buffer = buffer + " ";
        }

        deckstring = deckstring + cards[j].card.name + buffer + "(" + cards[j].amount + ")\n";

    }
    deckstring = deckstring + "```";

    return deckstring;
}

module.exports = {
    findCardById: findCardById,
    printDeck: printDeck
};
