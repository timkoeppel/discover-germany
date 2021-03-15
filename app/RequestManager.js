const request = require('request');
const fs = require('fs');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const RequestManager = {
    handleRequest: function (type, data) {
        switch (type) {
            case "Reverse-Geocoding":
                return this.reverseGeocodingRequest(data);

            case "All districts":
                return this.allDistrictsRequest();

            case "Discover":
                return this.discoverRequest(data);

            case "State distribution":
                return this.getStateDistribution();

            case "Reset Database":
                return this.resetDatabase();
        }
    },

    reverseGeocodingRequest: function (data) {
        console.log(`Reverse-Geocoding with ${data}`);
        return new Promise((resolve, reject) => {
            let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${data}&key=${process.env.API_KEY}&language=de`;
            request(url, {json: true}, (err, res, body) => {
                if (err) {
                    return console.log(err);
                }
                console.log(`Reverse-Geocoding finished.`);
                resolve({
                    data: body.results[0].address_components
                });
                reject(err);
            });
        });
    },

    allDistrictsRequest: function () {
        console.log('Getting all districts...');
        return new Promise((resolve, reject) => {
            let raw_districts = fs.readFileSync('./app/districts.json');
            resolve(JSON.parse(raw_districts)["districts"]);
        });
    },

    discoverRequest: function (data) {
        console.log(`Check discovery with ${data["current"]}...`);
        return new Promise((resolve, reject) => {
            let current = data["current"];
            let raw_districts = fs.readFileSync('./app/districts.json');
            let districts = JSON.parse(raw_districts)["districts"];
            let undiscovered = false;

            for (let i = 0; i < districts.length; i++) {
                if (districts[i]["district"] === current && districts[i]["status"] === "unexplored") {
                    let date = new Date();
                    let day = date.getDate() + ". " + MONTHS[date.getMonth()] + " " + date.getFullYear();

                    this.updateDatabase(districts[i]["district"], day);
                    undiscovered = true;
                }
            }
            if (undiscovered) {
                resolve(`Congratulation! You just discovered <b>${current}</b>`);
            } else {
                reject(`<b>${current}</b> already discovered!`);
            }
        });
    },

    updateDatabase: function (district, date) {
        let raw_districts = fs.readFileSync('./app/districts.json');
        let districts = JSON.parse(raw_districts)["districts"];

        for (let i = 0; i < districts.length; i++) {
            if (districts[i]["district"] === district) {
                districts[i]["status"] = date;
                break;
            }
        }
        let districts_JSON = {
            "districts": districts
        };

        fs.writeFileSync('./app/districts.json', JSON.stringify(districts_JSON));
    },

    resetDatabase: function () {
        fs.createReadStream('./app/init.json').pipe(fs.createWriteStream('./app/districts.json'));

        return new Promise((resolve, reject) => {
            resolve("Reset successful!")
        })
    },

    getStateDistribution: function (){
        let raw_districts = fs.readFileSync('./app/districts.json');
        let districts = JSON.parse(raw_districts)["districts"];
        let distribution = {};

        return new Promise((resolve, reject) => {
            for (let i = 0; i < districts.length; i++) {
                if (districts[i]["status"] !== "unexplored") {
                    if(districts["state"] in distribution){
                        distribution[districts["state"]] += 1;
                    }else{
                        distribution[districts["state"]] = 1;
                    }
                }
            }
            resolve(distribution)
        })

    },
};

module.exports = RequestManager;