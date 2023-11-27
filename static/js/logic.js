// Part 1 - Create the Earthquake Visualization

//set variable to queried json, sample: all above 2.5 in past week
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson"
let url2 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

// initalize the data from our json file
d3.json(url2).then(function(data) {
    console.log(data.features)
    
    createFeatures(data.features)
});

// create function for earthquake features
function createFeatures(earthquakeData) {

    // colorscale: ['#d73027','#fc8d59','#fee08b','#d9ef8b','#91cf60','#1a9850'], obtained from https://colorbrewer2.org/#type=sequential&scheme=BuGn&n=3

    // markerSize function to proportionalize size of earthquake to radius of circle
    function markerSize(rad) {
        return (rad * 2500)
    };

    // getColor function to achieve color category based on depth value
    function getColor(depth) {
        if (depth > 50) return '#d73027';
        else if (depth > 25) return '#fc8d59';
        else if (depth > 10) return '#fee08b';
        else if (depth > 5) return '#d9ef8b';
        else if (depth > 1) return '#91cf60';
        else return '#1a9850';
    }

    //Create earthquake markers to represent earthquake geographical location and using leaflet circle function to specify characteristics
    earthquake_markers = [];

    for (let i =0; i < earthquakeData.length; i++) {
        var magnitude = earthquakeData[i].properties.mag;
        var color_code = earthquakeData[i].geometry.coordinates[2]

        earthquake_markers.push(
            L.circle([earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0]], {
                fillOpacity: .75,
                fillColor: getColor(color_code),
                color: "black",
                opacity: 1,
                weight: 2,
                radius: markerSize(magnitude)}).bindPopup(`<h3>Location: ${earthquakeData[i].properties.place}</h3> <hr> <h2>Depth: ${earthquakeData[i].geometry.coordinates[2]}, Magnitude: ${earthquakeData[i].properties.mag}</h2> <hr> <p>${new Date(earthquakeData[i].properties.time)}</p>`)
        )};

    // create base layer for map
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // group earthquake circles onto earthquake layer
    let earthquake = L.layerGroup(earthquake_markers);

    // plot map, center location specified to San Francisco
    let myMap = L.map("map", {
        center: [37.775, -122.419],
        zoom: 12,
        layers: [street, earthquake]
    });

    // in progress
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend'),
        depths = [-1, 1, 5, 10, 25, 50],
        labels = [];

        for (var i = 0; i < depths.length; i++) {
            var colorBox = '<i style="background:' + getColor(depths[i] + 1) + '"></i>';
            var depthLabel = depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] : '+');
            labels.push('<div>' + colorBox + ' ' + depthLabel + '</div>');
        }

        div.innerHTML = labels.join('')
        return div;
    };

    console.log(getColor(7));

    legend.addTo(myMap);

}