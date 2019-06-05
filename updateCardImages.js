
const config = require("./config.json");
const fs = require("fs");
const imageDownloader = require("image-downloader");
const request = require("sync-request");
const unirest = require("unirest");

const hearthstoneCards = require("./json/cards.json");

for (var i = 0; i < hearthstoneCards.length; i++) {
    
    var card = hearthstoneCards[i];
    var options = {
        url: "",
        dest: "hearthstone-card-images/rel/" + card.dbfId + ".png"
    }

    if (!fs.existsSync(options.dest)) {

        console.log(card.dbfId + " " + card.id + " " + card.name);
       
        options.url = "https://art.hearthstonejson.com/v1/render/latest/enUS/512x/" + card.id + ".png";

        imageDownloader.image(options)
            .then(( {filename, image } ) => {
                console.log ("File saved to ", filename);
            })
            .catch((error) => {
                console.log(error);
            });
        
        // return;

    }

}
