const Connection = {
    _socket: undefined,

    init: function () {
        this._socket = io();
    },

    request: function (type, data) {
        console.log(`${type} request`);
        return new Promise((resolve, reject) => {
            this._socket.emit(
                'request',
                {
                    type: type,
                    data: data,
                },
                response => {
                    if (response.success) {
                        console.log(`${type} request succeeded: response =`, response.data);
                        resolve(response.data);
                    } else {
                        console.log(`${type} request failed: error =`, response.message);
                        reject(response.message);
                    }
                }
            );
        });
    }
};

const User = {
        _districts: undefined,                  // list of Objects (whole database)
        _visited: undefined,                    // list of Strings (districts)
        _distribution: {
            "Baden-Württemberg": [],
            "Bayern": [],
            "Rheinland-Pfalz": [],
            "Nordrhein-Westfalen": [],
            "Saarland": [],
            "Hessen": [],
            "Niedersachsen": [],
            "Schleswig-Holstein": [],
            "Mecklenburg-Vorpommern": [],
            "Berlin": [],
            "Hamburg": [],
            "Bremen": [],
            "Sachsen-Anhalt": [],
            "Sachsen": [],
            "Brandenburg": [],
            "Thüringen": []
        },                   // Object (visited districts per state)
        _current: undefined,                    // String (district)
        _last_discovery: "-",
        _BL: {
            "Baden-Württemberg": "BW",
            "Bayern": "BY",
            "Rheinland-Pfalz": "RP",
            "Nordrhein-Westfalen": "NW",
            "Saarland": "SL",
            "Hessen": "HE",
            "Niedersachsen": "NI",
            "Schleswig-Holstein": "SH",
            "Mecklenburg-Vorpommern": "MV",
            "Berlin": "BE",
            "Hamburg": "HA",
            "Bremen": "BR",
            "Sachsen-Anhalt": "ST",
            "Sachsen": "SN",
            "Brandenburg": "BB",
            "Thüringen": "TH"
        },   // Object (conversion from Abbreviation to full state name)

        setUserAttributes: function (districts, callback) {
            let visited = [];
            let distribution = {
                "Baden-Württemberg": [],
                "Bayern": [],
                "Rheinland-Pfalz": [],
                "Nordrhein-Westfalen": [],
                "Saarland": [],
                "Hessen": [],
                "Niedersachsen": [],
                "Schleswig-Holstein": [],
                "Mecklenburg-Vorpommern": [],
                "Berlin": [],
                "Hamburg": [],
                "Bremen": [],
                "Sachsen-Anhalt": [],
                "Sachsen": [],
                "Brandenburg": [],
                "Thüringen": []
            };

            for (let i = 0; i < districts.length; i++) {
                if (districts[i]["status"] !== "unexplored") {
                    visited.push(districts[i]["district"]);
                    distribution[districts[i]["state"]].push(districts[i]["district"]);
                }
            }
            this._visited = visited;
            this._distribution = distribution;
            callback();
        },

        getAllDistricts: function (callback) {
            Connection.request('All districts', {})
                .then(districts => {
                    this._districts = districts;
                    this.setUserAttributes(districts, callback);
                })
                .catch(error => {
                    ScreenManager.message(error, "bg-danger");
                });
        },

        determineCurrentPos: function (callback) {
            function success(pos) {
                const latitude = pos.coords.latitude;
                const longitude = pos.coords.longitude;

                let latlng = latitude + "," + longitude;

                Connection.request("Reverse-Geocoding", latlng)
                    .then(location => {
                        let area_selector = "administrative_area_level_3";

                        // Find out if administration
                        for (let i = 0; i < location.data.length; i++) {
                            if (location.data[i].types[0] === "administrative_area_level_3") {
                                area_selector = "administrative_area_level_2";
                            }
                        }

                        for (let i = 0; i < location.data.length; i++) {
                            if (location.data[i].types[0] === area_selector) {
                                User._last_discovery = location.data[i].long_name;
                            }
                        }
                        callback(User._last_discovery);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }

            function error() {
                console.log('Retrieving location has failed!');
            }

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success, error);
            } else {
                console.log('This browser does not support Geolocation!');
            }
        },

        resetDatabase: function () {
            Connection.request('Reset Database', {})
                .then(result => {
                    ScreenManager.message(result, "bg-primary");
                    User._last_discovery = "-";
                    ScreenManager.refreshDistricts();
                })
                .catch(error => {
                    console.log(error);
                });
        },
    }
;

const ScreenManager = {
    initializeStatistics: function (_last_discovery, _distribution) {
        let last_discovery = document.getElementById('last-discovery');
        let amount_visited = document.getElementById('amount-visited');
        let amount = 0;

        for (const [key, value] of Object.entries(_distribution)) {
            amount += value.length;
        }

        amount_visited.innerHTML = amount + " / 401";
        last_discovery.innerHTML = _last_discovery;
    },

    colorVisitedDistricts: function (visited) {
        // reset color
        let colored = document.getElementsByClassName('visited');
        for (let i = 0; i < colored.length; i++) {
            colored[i].classList.remove('visited');
        }

        // color
        for (let i = 0; i < visited.length; i++) {
            let id = visited[i].replace(/ /g, '_');
            document.getElementById(id).classList.add('visited');
        }
    },

    initializeTooltips: function (districts) {
        let DOM_districts = document.getElementsByClassName('district');

        // works because the 401 DOM_districts and data districts
        // have same order (alphabetically)
        for (let i = 0; i < districts.length; i++) {
            // required attribute for tooltips
            let DOM_district = DOM_districts[i];
            DOM_district.setAttribute('data-bs-toggle', 'tooltip');

            // determine name and discovered status
            let district_status = districts[i]["status"];
            let district_name = districts[i]["district"] + ", " + User._BL[districts[i]["state"]];

            // tooltip
            let options = {
                animation: true,
                html: true,
                title: `<b>${district_name}</b><br/><i>${district_status}</i>`,
            };
            let tooltip = new bootstrap.Tooltip(DOM_district, options);
        }
    },

    message: function (msg, class_type) {
        document.getElementById('message').classList.remove('bg-primary', 'bg-danger', 'bg-success');
        document.getElementById('message').classList.add(class_type);
        document.getElementById('message-body').innerHTML = msg;
        let toastElList = [].slice.call(document.querySelectorAll('.toast'));
        let toastList = toastElList.map(function (toastEl) {
            return new bootstrap.Toast(toastEl);
        });
        toastList.forEach(toast => toast.show());
    },

    refreshDistricts: function () {
        User.getAllDistricts(() => {
            this.colorVisitedDistricts(User._visited);
            this.initializeTooltips(User._districts);
            this.initializeStatistics(User._last_discovery, User._distribution);
        });
    },

    processDiscover: function () {
        User.determineCurrentPos(current => {
                console.log(`Current district: ${current}`);
                Connection.request('Discover', {"current": current})
                    .then(result => {
                        ScreenManager.refreshDistricts();
                        ScreenManager.message(result, "bg-success");
                    })
                    .catch(error => {
                        ScreenManager.message(error, "bg-danger");
                    });
            }
        );
    },

    processReset: function (){
        User.resetDatabase()
    },


    init: function () {
        // elements
        const map = document.getElementById('map');
        const map_cont = document.getElementById('map-container');
        const center_btn = document.getElementById('center-btn');
        const discover_btn = document.getElementById('discover-btn');
        const reset_btn = document.getElementById('reset-btn');
        const districts = document.getElementsByClassName('district');
        const profile_name = document.getElementById('profile-name');

        // map variables
        const svgSize = {w: map.getBBox().width, h: map.getBBox().height};
        const {x, y, width, height} = map.viewBox.baseVal;
        let viewBox = {x: x, y: y, w: width, h: height};
        let isPanning = false;
        let startPoint = {x: 0, y: 0};
        let endPoint = {x: 0, y: 0};
        let scale = 1;

        // discover
        discover_btn.addEventListener('click', this.processDiscover);

        // reset
        reset_btn.addEventListener('click', this.processReset);

        // zoom-in-out
        map_cont.addEventListener("wheel", (e) => {
            e.preventDefault();
            let w = viewBox.w;
            let h = viewBox.h;
            let mx = e.offsetX;//mouse x
            let my = e.offsetY;
            let dw = w * Math.sign(e.deltaY) * 0.05;
            let dh = h * Math.sign(e.deltaY) * 0.05;
            let dx = dw * mx / svgSize.w;
            let dy = dh * my / svgSize.h;
            viewBox = {x: viewBox.x + dx, y: viewBox.y + dy, w: viewBox.w - dw, h: viewBox.h - dh};
            map.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
        });

        // enable panning
        map_cont.addEventListener('mousedown', (e) => {
            isPanning = true;
            startPoint = {x: e.x, y: e.y};
        });

        // panning
        map_cont.addEventListener('mousemove', (e) => {
            if (isPanning) {
                endPoint = {x: e.x, y: e.y};
                let dx = (startPoint.x - endPoint.x) / scale;
                let dy = (startPoint.y - endPoint.y) / scale;
                let movedViewBox = {x: viewBox.x + dx, y: viewBox.y + dy, w: viewBox.w, h: viewBox.h};
                map.setAttribute('viewBox', `${movedViewBox.x} ${movedViewBox.y} ${movedViewBox.w} ${movedViewBox.h}`);
            }
        });

        // end panning while on map
        map_cont.addEventListener('mouseup', (e) => {
            if (isPanning) {
                endPoint = {x: e.x, y: e.y};
                let dx = (startPoint.x - endPoint.x) / scale;
                let dy = (startPoint.y - endPoint.y) / scale;
                viewBox = {x: viewBox.x + dx, y: viewBox.y + dy, w: viewBox.w, h: viewBox.h};
                map.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
                isPanning = false;
            }
        });

        // end panning when leaving map
        map_cont.addEventListener('mouseleave', () => {
            isPanning = false;
        });

        // centering to original position
        center_btn.addEventListener('click', () => {
            viewBox = {x: x, y: y, w: width, h: height};
            map.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
        });

        // Set up map visited
        this.refreshDistricts();


    }
};

document.addEventListener('DOMContentLoaded', () => {
    Connection.init();
    ScreenManager.init();

});