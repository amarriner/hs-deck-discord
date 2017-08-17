const config = require("./config.json");
const discord = require("discord.js");
const utils = require("./utils.js");

const re = /^!deck (.*)$/;
const client = new discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});

client.on("message", message => {
    if (message.content.startsWith("!deck")) {

        var match = re.exec(message.content);
        if (match && match.length > 0) {

            message.channel.send(utils.printDeck(match[1]));
            
        }
        else {
            message.channel.send("***Missing or invalid deck code!***");
        }

    }
})

client.login(config.botToken);
