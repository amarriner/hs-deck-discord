const config = require("./config.json");
const discord = require("discord.js");
const utils = require("./utils.js");

const re = /^!deck (.*)$/;
const nr = /^!nr (.*)$/;
const ah = /^!ah (.*)$/;
const client = new discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});

client.on("message", message => {

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
    // Get Arkham card
    //
    if (message.content.startsWith("!ah")) {

        var match = ah.exec(message.content);
        if (match && match.length > 0) {

            var card = utils.findArkhamCardById(match[1]);

            if (card) {
                message.channel.send("https://arkhamdb.com/bundles/cards/{code}.png".replace("{code}", card.code));
                return;
            }

            var cards = utils.findArkhamCardsByName(match[1]);                
            
            if (cards.length) {
                if (cards.length > 1) {
                    message.channel.send("Found " + cards.length + " cards (" + cards.map(function(c) { return c.name; }).join(",") + "), displaying the first one"); 
                }
                message.channel.send("https://arkhamdb.com/bundles/cards/{code}.png".replace("{code}", cards[0].code));
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
                    message.channel.send("Found " + cards.length + " cards (" + cards.map(function(c) { return c.title; }).join(",") + "), displaying the first one"); 
                }
                message.channel.send("https://netrunnerdb.com/card_image/{code}.png".replace("{code}", cards[0].code));
                return;
            }
            
            message.channel.send("Couldn't find matching Netrunner card!")
        }

    }
})

client.login(config.botToken); 
