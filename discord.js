const discord = require("discord.js");

var client = new discord.Client();

var RichEmbed = discord.RichEmbed;

module.exports = {
    client: client,
    RichEmbed: RichEmbed
};