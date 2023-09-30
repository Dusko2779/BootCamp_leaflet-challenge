// Create a map object
let mymap = L.map("map", {
    center: [-10, 140],
    zoom: 3
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mymap);
  
  // Load the GeoJSON data.
  let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // Get the data with d3.
  d3.json(geoData).then(function (data) {
    console.log(data);
  
    // Updated function to determine marker color based on depth
    function getDepthColor(depth) {
      if (depth >= -10 && depth <= 10) {
        return 'green'; 
      } else if (depth > 10 && depth <= 30) {
        return 'orange'; 
      } else if (depth > 30 && depth <= 50) {
        return 'yellow'; 
      } else if (depth > 50 && depth <= 70) {
        return 'red'; 
      } else if (depth > 70 && depth <= 90) {
        return 'purple'; 
      } else {
        return 'blue';
      }
    }
  
    // Loop through the earthquake data and create markers
    data.features.forEach(function (earthquake) {
      // Extract earthquake properties
      let magnitude = earthquake.properties.mag;
      let depth = earthquake.geometry.coordinates[2];
      let place = earthquake.properties.place;
  
      // Define marker size based on magnitude
      let markerSize = magnitude * 5;
  
      // Define marker color based on depth
      let markerColor = getDepthColor(depth);
  
      // Create a circle marker and bind a popup
      L.circleMarker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
        radius: markerSize,
        fillColor: markerColor,
        color: 'gray',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).bindPopup(`<strong>Location:</strong> ${place}<br><strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth} km`).addTo(mymap);
    });
  
    // Function to add a legend to the map
    function addLegend(position, title, depthRanges) {
      let legend = L.control({ position: position });
  
      legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = `<strong>${title}</strong><br>`;
  
        // Loop through depthRanges and display each range with a color
        for (let i = 0; i < depthRanges.length; i++) {
          let color = getDepthColor(depthRanges[i]);
          let nextDepth = depthRanges[i + 1];
          let rangeLabel = nextDepth ? `${depthRanges[i]}-${nextDepth}` : `${depthRanges[i]}+`;
  
          // Add a colored square next to the depth range label
          div.innerHTML +=
            '<i class="legend-color" style="background:' + color + '"></i> ' +
            rangeLabel + ' km<br>';
        }
  
        return div;
      };
  
      legend.addTo(mymap);
    }
  
    // Add a legend for earthquake depths (in km) to the "legend" div
    addLegend('bottomright', 'Depth (km)', [-10, 11, 31, 51, 71, 91]);
  
  });