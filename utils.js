
const config = require("./config.json")
const deckstrings = require("deckstrings");
const discord = require("./discord");

const hearthstoneCards = require("./json/cards.json");
const netrunnerCards = require("./json/netrunner-cards.json");
const arkhamCards = require("./json/arkham-cards.json");

const dustCost = {
    "COMMON": 40,
    "RARE": 100,
    "EPIC": 400,
    "LEGENDARY": 1600
}

function parseCardFlavor(str) {

    if (!str) {
        return "";
    }

    var parsedString = str.replace(/\n/g, " ")
        .replace(/<\/?i>/g, "**");

    return parsedString;

}

function parseCardText(str) {

    var exp;
    var match;

    if (!str) {
        return "";
    }

    var parsedString = str.replace(/\n/g, " ")
        .replace(/^\[x\]/, "")
        .replace(/<\/?i>/g, "*")
        .replace(/<\/?b>/g, "**")
        .replace(/\$/g, "");

    //
    // Replace the singular/plural stuff
    //
    exp = /@ \|([0-9])\(([a-zA-Z]*), ([a-zA-Z]*)\)/;
    match = exp.exec(parsedString);
    if (match && match.length > 0) {

        var num = match[match.length - 3];
        const singluar = match[match.length - 2];
        const plural = match[match.length - 1];

        //
        // I think all the card text has the max value ??? so I'm 
        // just setting the number back to one so it shows the way 
        // the card reads in the collection.......I think...
        //
        num = 1;

        parsedString = parsedString.replace(exp, num + " " + ( num > 1 ? plural : singluar ));

    }
    
    return parsedString;

}

const buildEmbedFromCard = function(card) {

    const manaEmoji = discord.client.emojis.find(emoji => emoji.name === "costmana");
    
    const attackEmoji = (card.type !== "SPELL" ? 
        discord.client.emojis.find(emoji => emoji.name === (card.type === "WEAPON" ? "attackweapon" : "attackminion")) + " " : "");
    
    const attack = (card.type !== "SPELL" ? card.attack : "");

    const healthEmoji = (card.type !== "SPELL" ?
        discord.client.emojis.find(emoji => emoji.name === (card.type === "WEAPON" ? "durability" : "health")) + " " : "");


    const health = (card.type !== "SPELL" ? (card.type === "WEAPON" ? card.durability : card.health) : "");
    
    const classEmoji = (card.cardClass !== "NEUTRAL" ? 
        " " + discord.client.emojis.find(emoji => emoji.name === card.cardClass.toLowerCase()) : "");
    
    const rarityEmoji = (card.rarity !== "FREE" ?
        " " + discord.client.emojis.find(emoji => emoji.name === "rarity" + card.rarity.toLowerCase()) : "");
    
    const setEmoji = (card.set !== "CORE" ? 
        discord.client.emojis.find(emoji => emoji.name === "set" + card.set.toLowerCase()) : "");

    var embed = new discord.RichEmbed();
    // embed.title = card.name;
    // embed.description = parseCardText(card.text);
    embed.url = config.aws.baseUrl + card.dbfId + ".png";
    embed.color = 30750;
    embed.timestamp = new Date();
    embed.thumbnail = {
        "url": config.aws.baseUrl + card.dbfId + ".png"
    };
    embed.footer = {
        "icon_url": "https://cdn.discordapp.com/app-icons/347801865431416833/d38ce6960e1d11f89e229b5e32bdbf34.png",
        "text": "hs-deck-discord"
    };
    embed.author = {
        "name": card.name,
        "url": config.aws.baseUrl + card.dbfId + ".png",
        "icon_url": "https://cdn.discordapp.com/app-icons/347801865431416833/d38ce6960e1d11f89e229b5e32bdbf34.png"
    };
    embed.fields = [
        {
            "name": manaEmoji + " " + card.cost + " " + attackEmoji + attack + " " + healthEmoji + health + 
                    classEmoji + setEmoji,
            "value": (card.rarity !== "FREE" ? card.rarity.toUpperCase() + " " : "") + card.type
        },
        {
            "name": (card.text ? parseCardText(card.text) : "\u200b"),
            "value": "*" + parseCardFlavor(card.flavor) + "*\n\n**Artist:** " + card.artist
        }
    ]

    return embed;

};

const findCardById = function(id) {

    for (c in hearthstoneCards) {
            
        if (hearthstoneCards[c].dbfId == id) {
            return hearthstoneCards[c];
        }

    }

    return false;

};

const findHearthstoneCardById = function(id) {

    for (c in hearthstoneCards) {

        if (hearthstoneCards[c].dbfId === id) {
            return hearthstoneCards[c];
        }

    }

    return false;

}

const findHearthstoneCardsByName = function(name) {
    
    var exactMatch;
    var cards = [];
    
    for (c in hearthstoneCards) {
    
        if (hearthstoneCards[c].name.toLowerCase() == name.toLowerCase() &&
            hearthstoneCards[c].collectible) {
                exactMatch = hearthstoneCards[c];
        }
        else if (hearthstoneCards[c].name.toLowerCase().indexOf(name.toLowerCase()) >= 0 &&
            hearthstoneCards[c].collectible) {

            cards.push(hearthstoneCards[c]);

        }
    
    }
    
    if (exactMatch) {
        cards.unshift(exactMatch);
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
    deckstring = "**" + hero.cardClass + "**\n";
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
    buildEmbedFromCard: buildEmbedFromCard,
    findCardById: findCardById,
    findArkhamCardById: findArkhamCardById,
    findArkhamCardsByName: findArkhamCardsByName,
    findHearthstoneCardById: findHearthstoneCardById,
    findHearthstoneCardsByName: findHearthstoneCardsByName,
    findNetrunnerCardById: findNetrunnerCardById,
    findNetrunnerCardsByName: findNetrunnerCardsByName,
    printDeck: printDeck
};
