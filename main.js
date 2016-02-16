$( document ).ready(function(){
	var map = L.map('map').setView([50, 0], 3);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGhoaGhoaGhoaGgiLCJhIjoiY2lrcGRrenhrMDBhaXc4bHMwNXd3emszbiJ9.GSEKdLMRDLkp5HJozOsw_g', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(map);

	var sw = map.getBounds()._southWest;
	var ne = map.getBounds()._northEast;

	//new L.OSM.Mapnik().addTo(map);
	$.ajax({
	  //url: "http://api.openstreetmap.org/api/0.6/map?bbox="+sw.lon+","+sw.lat+","+ne.lon+","+ne.lat;
	  url: "data.osm",
	  dataType: "xml",
	  success: function (xml) {
	 	console.log(xml);
	 	var timestamps = getUniqueTimestamps(xml);

	 	console.log(timestamps);

	    var layer = new L.OSM.DataLayer(xml)
	    layer.setStyle({color: 'black', fillColor: 'orange', fillOpacity: 0.5 });
	    layer.addTo(map);

	    map.fitBounds(layer.getBounds());
	  }
	});

	function getUniqueTimestamps(g){
		var timestamps = getTimestamps(xml.children[0]).split(";").sort();
	 	for(var i=timestamps.length-2;i>=0;i--){
	 		var a = timestamps[i+1].substr(0, 8);
	 		var b = timestamps[i].substr(0, 8);
	 		if(a == b){
	 			timestamps.splice(i+1, 1);
	 		}
	 	}
	 	return timestamps;
	}

	function getTimestamps(g){
		var ans = "";
		for(var i=0;i<g.children.length;i++){
			var c = g.children[i];
			var k = getTimestamps(c);
			if(k.length > 0){
				if(ans.length > 0){
					ans += ";";
				}
				ans += k;
			}
		}
		var z = g.getAttribute("timestamp");
		if(z != null){
			if(ans.length > 0){
				ans += ";";
			}
			ans += z;
		}
		return ans;
	}
});

