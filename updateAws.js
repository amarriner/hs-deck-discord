var AWS = require('aws-sdk');
var fs = require('fs');
var config = require('./config.json');
var cards = require('./json/cards.json');

//
// Set AWS credentials
//
AWS.config.update({
    accessKeyId: config.aws.accessKeyId, 
    secretAccessKey: config.aws.secretAccessKey,
    region: config.aws.region
});

//
// Instantiate S3 object
//
var s3 = new AWS.S3();

//
// Get the list of objects currently in the S3 bucket
//
s3.listObjects({
    Bucket: config.aws.bucketName
}, function(err, data) {

    if (err) { 
        console.log(err);
        return;
    }

    //
    // Loop through the cards in the HS JSON file
    //
    for (i in cards) {
        var c = cards[i];

        //
        // Only consider collectible cards
        //
        if (c.collectible) {

            //
            // Check to see if this card is already in the S3 bucket
            //
            var isInBucket = data.Contents.find(obj => {
                return obj.Key == c.dbfId + ".png"
            });

            //
            // If not, upload it
            //
            if (!isInBucket) {
                console.log("Uploading " + c.name + " :: " + c.dbfId + " :: " + c.id);


                (function (filename) {
                    fs.readFile("hearthstone-card-images/rel/" + filename, function (err, data) {

                        if (err) {
                            console.log(err);
                            return;
                        }

                        var base64data = new Buffer.from(data, 'binary');

                        s3.putObject({
                            Bucket: config.aws.bucketName,
                            Key: filename,
                            Body: base64data,
                            ACL: 'public-read'
                        },function (resp) {

                            if (err) {
                                console.log(err);
                                return;
                            }

                            console.log(arguments);
                            console.log('Successfully uploaded ' + filename);

                        });

                    });
                }(c.dbfId + ".png"));

            }
        }
    }
});
