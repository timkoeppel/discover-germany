const Connection = {
    _socket: undefined,

    init: function () {
        this._socket = io();
    },

    request: function (type, data) {
        console.log(`${type} request with ${data}`)
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

const Geocoding = {
    determineCurrentPos: function () {
        function success(pos) {
            const latitude = pos.coords.latitude;
            const longitude = pos.coords.longitude;

            let latlng = latitude + "," + longitude;

            Connection.request("Reverse-Geocoding", latlng)
                .then(location => {
                    let lkr;
                    let bdl;
                    let is_city_district = true;

                    // Find out if adminstrion
                    for (let i = 0; i < location.data.length; i++) {
                        if (location.data[i].types[0] === "administrative_area_level_3") {
                            is_city_district = false;
                        }
                    }

                    for (let i = 0; i < location.data.length; i++) {
                        if (is_city_district) {
                            if (location.data[i].types[0] === "administrative_area_level_2") {
                                lkr = location.data[i].long_name;
                            } else if (location.data[i].types[0] === "administrative_area_level_1") {
                                bdl = location.data[i].long_name;
                            }
                        } else {
                            if (location.data[i].types[0] === "administrative_area_level_3") {
                                lkr = location.data[i].long_name;
                            } else if (location.data[i].types[0] === "administrative_area_level_1") {
                                bdl = location.data[i].long_name;
                            }
                        }
                    }
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
    }
};

const ScreenManager = {
    colorVisitedDistricts: function (){
        return;
    },

    init: function () {
        // elements
        const map = document.getElementById('map');
        const map_cont = document.getElementById('map-container');
        const center_btn = document.getElementById('center-btn');
        const discover_btn = document.getElementById('discover-btn');
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
        discover_btn.addEventListener('click', () => {
            Geocoding.determineCurrentPos(() => {

                }
            );

            /*let options = {
                animation: true,
                html: true,
                title: `<b>${dname}</b><br/><i>${123}</i>`,
            };
            let tooltip = new bootstrap.Tooltip(document.getElementById(dname), options);*/
        });


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

        // initialize tooltip with bootstrap/popper.js
        for (let i = 0; i < districts.length; i++) {
            // set initial attributes for all paths
            districts[i].setAttribute('data-bs-toggle', 'tooltip');

            // determine title
            let district_discovered = 'unentdeckt';
            let district_name = districts[i].id.replace(/_/g, ' ');

            // tooltip
            let options = {
                animation: true,
                html: true,
                title: `<b>${district_name}</b><br/><i>${district_discovered}</i>`,
            };
            let tooltip = new bootstrap.Tooltip(districts[i], options);
        }

        // centering to original position
        center_btn.addEventListener('click', () => {
            viewBox = {x: x, y: y, w: width, h: height};
            map.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Connection.init();
    ScreenManager.init();

});