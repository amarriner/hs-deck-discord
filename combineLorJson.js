const fs = require("fs");

var baseDir = "/home/amarriner/node/lor";

var json = JSON.parse(fs.readFileSync(baseDir + "/core/data/globals-en_us.json", {encoding:'utf8', flag:'r'}));
json.cards = [];

json.sets.forEach(set => {
   var cards = JSON.parse(fs.readFileSync(baseDir  + "/" + set.nameRef.toLowerCase() + "/data/" + set.nameRef.toLowerCase() + "-en_us.json"));
   json.cards = json.cards.concat(cards);
});

fs.writeFileSync("json/lor-cards.json", JSON.stringify(json), {encoding:'utf8', flag:'w'});
