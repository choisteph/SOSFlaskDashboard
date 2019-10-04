// create svg of map
function createMap() {// Mapbox section
    L.mapbox.accessToken = 'pk.eyJ1Ijoic3RjaG9pIiwiYSI6ImNqd2pkNWN0NzAyNnE0YW8xeTl5a3VqMXQifQ.Rq3qT82-ysDHcMsHGTBiQg';
    layers = {
        'Light': L.mapbox.styleLayer('mapbox://styles/mapbox/light-v10'),
        'Dark': L.mapbox.styleLayer('mapbox://styles/mapbox/dark-v10'),
        'Main': L.mapbox.styleLayer('mapbox://styles/stchoi/cjwky60dk0toy1cm8fnhngzrv')
    };

    map = L.mapbox.map('map')
        .setView(centerMapbox, zoomMapbox)
        .addLayer(layers.Main) // default layer
        .addControl(L.mapbox.geocoderControl('mapbox.places', {autocomplete: true}))
        .setMaxBounds([[36,-92],[52,-80]])
        .setMinZoom(5)

    map.scrollWheelZoom.disable();

    function style(feature) {
        return {
            fillColor: '#adcfe6',
            weight: 2,
            opacity: 1,
            color: '#72add4',
            fillOpacity: 0.30
        };
    }

    L.control.layers(layers).addTo(map); // add basemap control
    featureLayer = L.mapbox.featureLayer().addTo(map);
    const citycountyLayer = L.mapbox.featureLayer(county_geojson, {style : style}).addTo(map);

    latDim = CF.dimension(d => d.lat)
    lngDim = CF.dimension(d => d.lng)
    drawMarkers();

    // spatial filtering on map event
    map.on('moveend zoomend', function() {
        updateAll();
    });
};

// draw map markers
function drawMarkers() {
    const days = numDays();
    for (let pt of latDim.top(Infinity)) {
        const offset = (x.domain()[1] - pt.date) / 86400000;
        featureLayer.addLayer(L.marker([pt.lat, pt.lng], {
            icon: tableIcon,
            opacity: d3.max([1 - (offset-1)/days, 0]),
          })
          .bindPopup(`<p>${formatDate(pt.date)}<br>${pt.county}<br>${pt.Age}, ${pt.Race}, ${pt.Gender}</p>`))
      };
};

function updateMap(bounds) {
    latDim.filter([bounds.getSouth(), bounds.getNorth()])
    lngDim.filter([bounds.getWest(), bounds.getEast()])
    featureLayer.clearLayers()
    drawMarkers()
};
