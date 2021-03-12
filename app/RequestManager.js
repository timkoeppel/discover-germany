const request = require('request');

const RequestManager = {
    handleRequest: function(type, data){
        switch(type){
            case "Reverse-Geocoding":
                return this.reverseGeocodingRequest(data)
            }
    },

    reverseGeocodingRequest: function(data){
        console.log(`Reverse-Geocoding with ${data}`);
        return new Promise ((resolve, reject) => {
            let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${data}&key=${process.env.API_KEY}&language=de`
            request(url, { json: true }, (err, res, body) => {
                if (err) { return console.log(err); }
                console.log(`Reverse-Geocoding succeded.`);
                resolve({
                    data: body.results[0].address_components
                })
            });
        })
    }
}

module.exports = RequestManager;