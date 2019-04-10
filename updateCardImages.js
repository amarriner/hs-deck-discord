
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

        console.log(card.dbfId + " " + card.name);

        unirest.get("https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/" + card.id)
            .header("X-RapidAPI-Host", "omgvamp-hearthstone-v1.p.rapidapi.com")
            .header("X-RapidAPI-Key", config.mashapeKey)
            .end(function (result) {

                console.log(result.body[0]);
                
                options.url = result.body[0].img;

                imageDownloader.image(options)
                    .then(( {filename, image } ) => {
                        console.log ("File saved to ", filename);
                    })
                    .catch((error) => {
                        console.log(error);
                    });

            });

        return;

    }

}
