
const config = require("./config.json");
const fs = require("fs");
const request = require("sync-request");
var unirest = require("unirest");

const jsonDir = "./json/";
const arkhamPacksUrl = "https://arkhamdb.com/api/public/packs/";

console.log("Beginning Arkham Horror card refresh");
var packs = JSON.parse(request("GET", arkhamPacksUrl).getBody());

var all = [];
for (var i in packs) {

    console.log("Downloading " + packs[i].name);
    var cardsUrl = "https://arkhamdb.com/api/public/cards/" + packs[i].code + ".json";
    var cards = JSON.parse(request("GET", cardsUrl).getBody());

    all = all.concat(cards);
}

fs.writeFileSync(jsonDir + "arkham-cards.json", JSON.stringify(all));
console.log(all.length + " total Arkham Horror cards");

console.log();
console.log("--------------------------------------------------------");
console.log();

const netrunnerCardsUrl = "https://netrunnerdb.com/api/2.0/public/cards";
console.log("Beginning Netrunner card refresh");

var cards = JSON.parse(request("GET", netrunnerCardsUrl).getBody());
fs.writeFileSync(jsonDir + "netrunner-cards.json", JSON.stringify(cards));

console.log();
console.log("--------------------------------------------------------");
console.log();

console.log("Beginning Hearthstone card refresh");

//unirest.get("https://api.hearthstonejson.com/v1/latest/enUS/cards.collectible.json")
unirest.get("https://api.hearthstonejson.com/v1/latest/enUS/cards.json")
    .end(function (result) {
        fs.writeFileSync(jsonDir + "cards.json", JSON.stringify(result.body));
   });
