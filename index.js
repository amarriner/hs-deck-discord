const config = require("./config.json");
const discord = require("./discord");
const utils = require("./utils.js");

const re = /^!deck (.*)$/;
const nr = /^!nr (.*)$/;
const ah = /^!ah (.*)$/;
const hs = /^!hs ([^-].*)$/;

discord.client.on('ready', () => {
    console.log('I am ready!');
});

discord.client.on("message", message => {

    //
    // Process Hearthstone deckstring
    //
    if (message.content.startsWith("!deck")) {

        var match = re.exec(message.content);
        if (match && match.length > 0) {

            message.channel.send(utils.printDeck(match[1]));
            
        }
        else {
            message.channel.send("***Missing or invalid deck code!***");
        }

    }

    //
    // Get Hearthstone card
    //
    if (message.content.startsWith("!hs")) {

        var match = hs.exec(message.content);
        if (match && match.length > 0) {

            var card = utils.findHearthstoneCardById(match[match.length - 1]);

            if (card) {

                message.channel.send(utils.buildEmbedFromCard(card));
                return;

            }

            var cards = utils.findHearthstoneCardsByName(match[match.length - 1]);

            if (cards.length) {

                if (cards.length > 1) {
                    message.channel.send("Found " + cards.length + " cards (" + cards.map(function (c) { return c.name; }).join(", ") + "), displaying the first one");
                }

                message.channel.send(config.aws.baseUrl + cards[0].dbfId + ".png", utils.buildEmbedFromCard(cards[0]));

                return;
            }

            message.channel.send("Couldn't find matching Hearthstone card!")

        }
    }

    //
    // Get Arkham card
    //
    if (message.content.startsWith("!ah")) {

        var match = ah.exec(message.content);
        if (match && match.length > 0) {

            var card = utils.findArkhamCardById(match[1]);

            if (card) {
                message.channel.send("https://arkhamdb.com" + card.imagesrc);
                return;
            }

            var cards = utils.findArkhamCardsByName(match[1]);

            if (cards.length) {
                if (cards.length > 1) {
                    message.channel.send("Found " + cards.length + " cards (" + cards.map(function (c) { return c.name; }).join(", ") + "), displaying the first one");
                }
                message.channel.send("https://arkhamdb.com" + cards[0].imagesrc);
                return;
            }

            message.channel.send("Couldn't find matching Arkham Horror card!")
        }
    }

    //
    // Get Netrunner card
    //
    if (message.content.startsWith("!nr")) {

        var match = nr.exec(message.content);
        if (match && match.length > 0) {

            var card = utils.findNetrunnerCardById(match[1]);

            if (card) {
                message.channel.send("https://netrunnerdb.com/card_image/{code}.png".replace("{code}", card.code));
                return;
            }

            var cards = utils.findNetrunnerCardsByName(match[1]);

            if (cards.length) {
                if (cards.length > 1) {
                    message.channel.send("Found " + cards.length + " cards (" + cards.map(function (c) { return c.title; }).join(", ") + "), displaying the first one");
                }
                message.channel.send("https://netrunnerdb.com/card_image/{code}.png".replace("{code}", cards[0].code));
                return;
            }

            message.channel.send("Couldn't find matching Netrunner card!")
        }

    }
})

discord.client.login(config.botToken); 
