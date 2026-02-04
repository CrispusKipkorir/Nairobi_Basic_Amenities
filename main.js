// Page title + description (runs first)
// --------------------
document.title = "Nairobi Hospitals, Schools & Highways Map";

let header = document.createElement("header");
header.innerHTML = `
  <h1>Nairobi Hospitals, Schools & Highways</h1>
  <p>
     This interactive map shows the distribution of hospitals , schools , and major highways in Nairobi County. 
      Use the layer control to toggle features and switch between OpenStreetMap and ESRI Satellite basemaps. 
  </p>
`;
document.body.insertBefore(header, document.getElementById("map"));

// Initialize map centered on Nairobi County
let map = L.map("map", {
  center: [-1.2921, 36.8219],
  zoom: 12,
});

// Base maps
let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

let esriImagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  { attribution: "Tiles © Esri" }
);
let cartoLight = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  {
    attribution: "&copy; <a href='https://www.openstreetmap.org/'>OSM</a> &copy; <a href='https://carto.com/'>CARTO</a>"
  }
);

let cartoDark = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  {
    attribution: "&copy; <a href='https://www.openstreetmap.org/'>OSM</a> &copy; <a href='https://carto.com/'>CARTO</a>"
  }
);

//Grouping of basemaps
let baseMaps = {
  "OpenStreetMap": osm,
  "ESRI Satellite": esriImagery,
  "Carto Light": cartoLight,
  "Carto Dark": cartoDark
};


// personalized icons
let hospitalIcon = L.icon({
  iconUrl: "images/hospitals.png",   // hospital sign icon  from saved png
  iconSize: [15, 15],               // icon size
  iconAnchor: [7, 15],
  popupAnchor: [0, -15]
});

let schoolIcon = L.icon({
  iconUrl: "images/schools.png",     // school icon
  iconSize: [15, 15],               // size
  popupAnchor: [0, -15]
});

// Hospitals in Nairobi
let hospitalsLayer = L.geoJSON(null, {
  pointToLayer: (feature, latlng) => L.marker(latlng, { icon: hospitalIcon }),
  onEachFeature: (feature, layer) => {
    layer.bindPopup(`<b> Hospital:</b> ${feature.properties.name || "Unnamed"}`);
  }
});
fetch("data/hospitals.geojson")
  .then(res => res.json())
  .then(data => hospitalsLayer.addData(data).addTo(map));

// Schools in Nairobi
let schoolsLayer = L.geoJSON(null, {
  pointToLayer: (feature, latlng) => L.marker(latlng, { icon: schoolIcon }),
  onEachFeature: (feature, layer) => {
    layer.bindPopup(`<b>📘 School:</b> ${feature.properties.name || "Unnamed"}`);
  }
});
fetch("data/schools.geojson")
  .then(res => res.json())
  .then(data => schoolsLayer.addData(data).addTo(map));

// Highways in Nairobi
let highwaysLayer = L.geoJSON(null, {
  style: { color: "brown", weight: 2 }
});
fetch("data/highways.geojson")
  .then(res => res.json())
  .then(data => highwaysLayer.addData(data).addTo(map));

// Overlay maps
let overlayMaps = {
  "Hospitals": hospitalsLayer,
  "Schools": schoolsLayer,
  "Highways": highwaysLayer
};

// Adding layer control
L.control.layers(baseMaps, overlayMaps).addTo(map);

// Legend
let legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
  let div = L.DomUtil.create("div", "legend");
  div.innerHTML = `
    <h4>Legend</h4>
    <i style="background:red"></i> Highways<br>
    <img src="images/hospitals.png" width="15" height="15"> Hospitals<br>
    <img src="images/schools.png" width="15" height="15"> Schools
  `;
  return div;
};
legend.addTo(map);
