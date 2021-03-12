const request = require('request');
const fs = require('fs');

const RequestManager = {
    handleRequest: function(type, data){
        switch(type) {
            case "Reverse-Geocoding":
                return this.reverseGeocodingRequest(data);

            case "Visited":
                return this.visitedDistrictsRequest();
        }
    },

    reverseGeocodingRequest: function(data){
        console.log(`Reverse-Geocoding with ${data}`);
        return new Promise ((resolve, reject) => {
            let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${data}&key=${process.env.API_KEY}&language=de`
            request(url, { json: true }, (err, res, body) => {
                if (err) { return console.log(err); }
                console.log(`Reverse-Geocoding finished.`);
                resolve({
                    data: body.results[0].address_components
                })
                reject(err)
            });
        })
    },

    visitedDistrictsRequest: function(){
        console.log('Getting visited districts.')
        return new Promise((resolve, reject) => {
            let raw_districts = fs.readFileSync('./app/visited.json');
            let districts = JSON.parse(raw_districts);
            let visited = {};

            for (const [key, value] of Object.entries(districts)) {
                if(value !== "unexplored"){
                    visited[key] = value;
                }
            }
            console.log('Visited Request finished.')
            resolve(visited)
        });
    }
}

module.exports = RequestManager;