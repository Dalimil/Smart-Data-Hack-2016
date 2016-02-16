$( document ).ready(function(){
	var map = L.map('map').setView([51.505, -0.09], 1);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGhoaGhoaGhoaGgiLCJhIjoiY2lrcGRrenhrMDBhaXc4bHMwNXd3emszbiJ9.GSEKdLMRDLkp5HJozOsw_g', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(map);

	//new L.OSM.Mapnik().addTo(map);
	$.ajax({
	  url: "data.osm",
	  // or "http://www.openstreetmap.org/api/0.6/way/52477381/full"
	  dataType: "xml",
	  success: function (xml) {
	    var layer = new L.OSM.DataLayer(xml)
	    layer.setStyle({color: 'black', fillColor: 'orange', fillOpacity: 0.5 });
	    layer.addTo(map);
	    map.fitBounds(layer.getBounds());
	  }
	});
});




