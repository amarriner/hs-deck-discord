
const deckstrings = require("deckstrings");

const hearthstoneCards = require("./json/cards.json");
const netrunnerCards = require("./json/netrunner-cards.json");
const arkhamCards = require("./json/arkham-cards.json");

const dustCost = {
    "Common": 40,
    "Rare": 100,
    "Epic": 400,
    "Legendary": 1600
}

const findCardById = function(id) {

    for (c in hearthstoneCards) {
            
        if (hearthstoneCards[c]["dbfId"] == id) {
            return hearthstoneCards[c];
        }

    }

    return {};

};

const findHearthstoneCardById = function(id) {

    for (c in hearthstoneCards) {

        if (hearthstoneCards[c].cardId === id) {
            return hearthstoneCards[c];
        }

    }

    return {};

}

const findHearthstoneCardsByName = function(name) {
    
    var cards = [];
    
    for (c in hearthstoneCards) {
    
        if (hearthstoneCards[c].name.toLowerCase().indexOf(name.toLowerCase()) >= 0 &&
            hearthstoneCards[c].collectible) {
            console.log(hearthstoneCards[c]);
            cards.push(hearthstoneCards[c]);
        }
    
    }
    
    return cards;

}

const findArkhamCardById = function(id) {

    for (i in arkhamCards) {

        if (arkhamCards[i].code === id) {
            return arkhamCards[i];
        }

    }

}

const findArkhamCardsByName = function(name) {

    var cards = [];
    for (i in arkhamCards) {

        if (arkhamCards[i].name.toLowerCase().indexOf(name.toLowerCase()) >= 0) {
            cards.push(arkhamCards[i]);
        }

    }

    return cards;

}

const findNetrunnerCardById = function(id) {

    for (i in netrunnerCards.data) {

        if (netrunnerCards.data[i].code === id) {
            return netrunnerCards.data[i];
        }

    }

}

const findNetrunnerCardsByName = function(name) {

    var cards = [];
    for (i in netrunnerCards.data) {

        if (netrunnerCards.data[i].title.toLowerCase().indexOf(name.toLowerCase()) >= 0) {
            cards.push(netrunnerCards.data[i]);
        }

    }

    return cards;

}

const printDeck = function(code) {

    var deckstring = "";
    var dust = 0;
    var decoded = deckstrings.decode(code);
    
    var hero = findCardById(decoded.heroes[0]);
    if (!hero) {
        return "***Missing or invalid deck code!***";
    }

    var maxLength = 0;
    var cards = [];
    for (var i = 0; i < decoded.cards.length; i++) {
        var card = findCardById(decoded.cards[i][0]);

        if (dustCost[card.rarity]) {
            dust += dustCost[card.rarity];
        }

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
    deckstring = "**" + hero.playerClass + "**\n";
    deckstring += "*" + (decoded.format === 1 ? "Wild" : "Standard") + " ";
    deckstring += " (" + dust.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " dust)*\n";
    deckstring += "```";
    for (var j = 0; j < cards.length; j++) {

        var buffer = "";
        for (var k = 0; k < maxLength - cards[j].card.name.length; k++) {
            buffer = buffer + " ";
        }

        var space = "";
        if (cards[j].card.cost < 10) {
            space = " ";
        }

        deckstring += "[" + cards[j].card.cost + "] " + space + cards[j].card.name + buffer + "(" + cards[j].amount + ")\n";

    }
    deckstring += "```";

    return deckstring;
}

module.exports = {
    findCardById: findCardById,
    findArkhamCardById: findArkhamCardById,
    findArkhamCardsByName: findArkhamCardsByName,
    findHearthstoneCardById: findHearthstoneCardById,
    findHearthstoneCardsByName: findHearthstoneCardsByName,
    findNetrunnerCardById: findNetrunnerCardById,
    findNetrunnerCardsByName: findNetrunnerCardsByName,
    printDeck: printDeck
};
