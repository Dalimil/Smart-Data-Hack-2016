var data = null;
var original_data = null;
var timestamps = null;
var layer = null;
var map = null;

function update(time_id){
	var usedT = timestamps.slice(0, time_id+1);
	data.children[0] = rebuild_xml(original_data.children[0], usedT);
	display();
}

function display(){
	if(layer != null){
		map.removeLayer(layer);
	}

	layer = new L.OSM.DataLayer(data)
    layer.setStyle({color: 'black', fillColor: 'orange', fillOpacity: 0.5 });
    layer.addTo(map);

    map.fitBounds(layer.getBounds());
}

$( document ).ready(function(){
	map = L.map('map').setView([50, 0], 3);

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
	 	timestamps = getUniqueTimestamps(xml);
	 	console.log(timestamps);
	 	data = xml;
	 	original_data = xml;
	 	display();
	  }
	});

	
});

function rebuild_xml(g, usedT){
	var z = g.getAttribute("timestamp");
	if(z != null){
		z = z.substr(0, 8);
		var consider = false;
		for(var i = 0;i<usedT.length;i++){
			if(usedT[i].substr(0, 8) == z){
				consider = true;
				break;
			}
		}
		if(consider){
			return g;
		}else{
			return null;
		}
	}else{ // no timestamp
		var g2 = g;
		g2.children = [];
		for(var i=0;i<g.children.length;i++){
			var c = g.children[i];
			var k = rebuild_xml(c, usedT);
			if(k != null){
				g2.children.push(k);
			}
		}
		return g2;
	}
}


function getUniqueTimestamps(xml){
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