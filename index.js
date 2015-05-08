L.mapbox.accessToken = 'pk.eyJ1Ijoia2FtaWN1dCIsImEiOiJMVzF2NThZIn0.WO0ArcIIzYVioen3HpfugQ';

var map = L.mapbox.map('map', 'examples.map-h68a1pf7').setView([10,10],5);
var polys = {
  'type': 'FeatureCollection',
  'features': []
};
var points = {
  'type': 'FeatureCollection',
  'features': []
};
var bboxes = [];

for (var i=0; i<50; i++) {
  var width = 2 * Math.random() + 2;
  var height = 3 * Math.random() + 3;
  var x = Math.random() * 10;
  var y = Math.random() * 10;
  var extent = [x,y,x+width,y+height];
  var bbox = turf.bboxPolygon(extent);
  bboxes.push(bbox);
  turf.pointGrid(extent,0.5,'degrees').features.forEach(function(feature) {
    points.features.push(feature);
  });
}
console.log(points);

polys.features = bboxes;

var extent = turf.extent(polys);
var grid = turf.hexGrid(extent, 1, 'degrees');

grid = turf.count(grid, points, 'pt_count');
grid.features.forEach(function (feature) {
  var style = feature.style = {};
  var pt_count = feature.properties.pt_count;
  style.color = '#2020C9';
  style.weight = 0;
  style.fill = '#9A8FBF';
  style.fillOpacity = 0;
  //if(pt_count >= 0) {
  //style.fillOpacity = 0.00;
  //}
  if(pt_count >= 1) {
    style.fillOpacity = 0.2;
    style.weight = 1;
  } if(pt_count >= 15) {
    style.weight = 2;
    style.fillOpacity = 0.35;
  } if(pt_count >= 25) {
    style.weight = 3;
    style.fillOpacity = 0.55;
  }
  feature.style = style;
});

var griddedLayer = L.geoJson(grid).eachLayer(function (layer) {
    layer.setStyle(layer.feature.style);
  });

var extentLayer = L.geoJson(polys);

gridBtn = document.getElementById('grid-btn');
extentBtn = document.getElementById('extent-btn');

gridBtn.addEventListener('click', attachLayer(gridBtn, griddedLayer));
extentBtn.addEventListener('click', attachLayer(extentBtn, extentLayer));

function colorButton(btn) {
  btn.style['background-color'] = '#2ecc71';
  btn.style['color'] = 'white';
}
function deColorButton(btn) {
  btn.style['background-color'] = 'white';
  btn.style['color'] = 'black';
}
colorButton(extentBtn);
extentLayer.addTo(map);
currentButton = extentBtn;
currentLayer = extentLayer;

function attachLayer(btn,layer) {
  return function() {
    if (currentLayer) {
      map.removeLayer(currentLayer);
    }
    layer.addTo(map);
    currentLayer = layer;
    deColorButton(currentButton);
    currentButton = btn;
    colorButton(btn);
  };
}