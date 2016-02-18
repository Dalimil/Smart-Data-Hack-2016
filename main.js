var data = null;
var timestamps = null;
var currentTime = null;
var layer = null;
var map = null;
var compareLen = 10;
var sliderCreated = false;

function init(){
	$("#init-button").addClass('disabled');
	$("#myloader").show();
	var sw = map.getBounds().getSouthWest();
	var ne = map.getBounds().getNorthEast();
	var url = "http://api.openstreetmap.org/api/0.6/map?bbox="+sw.lng+","+sw.lat+","+ne.lng+","+ne.lat;
	console.log("Downloading data... "+url);
	$.ajax({
	  url: url,
	  //url: "data.osm",
	  dataType: "xml",
	  success: function (xml) {
	  	console.log("Data downloaded");
	 	data = osmtogeojson(xml);
	 	console.log(data);
	 	removePoints();
	 	console.log(data);
	 	timestamps = getUniqueTimestamps(data);
	 	console.log(timestamps);
	 	update(timestamps.length-1);

	 	$(".slider-details").show();
		var slider = $("#slider");
		slider.noUiSlider({
			start: [ timestamps.length-1 ],
			step: 1,
			connect: "lower",
			range: {
				'min': [  0 ],
				'max': [ timestamps.length-1 ]
			}
		}, true);

		var k = Math.round($("#slider").val());
		$("#date_field").text((new Date(timestamps[k])).toDateString());
		console.log(k);
		update(k);

		slider.on({
			slide: function() {
				var k = Math.round($("#slider").val());
				$("#date_field").text((new Date(timestamps[k])).toDateString());
				console.log(k);
				update(k);
			}
		});
		$("#myloader").hide();
		$("#init-button").removeClass('disabled');
	  }

	});
}

function updateOnZoom(){
	var z = map.getZoom();
	if(z >= 17){
		$("#render-button").show();
		$("#render-warn").hide();
	}else{
		$("#render-button").hide();
		$("#render-warn").show();
	}
}

function update(time_id){
	currentTime = timestamps[time_id];
	console.log("currentTime: "+currentTime);
	display();
}


var animation = null;
var animationStep = -1;

function updateAnimation(){
	animationStep += 1;
	console.log("anim: "+animationStep);
	if(animationStep >= timestamps.length){
		cancelAnimation();
		return;
	}
	$("#slider").val(animationStep);
	$("#date_field").text((new Date(timestamps[animationStep])).toDateString());
	update(animationStep);
}

function cancelAnimation(){
	console.log("animation ended");
	clearInterval(animation);
	animation = null;
	$("#player-b").html("play_arrow");
}

function playAnimation(){
	if(timestamps == null) return;

	animationStep = -1;
	if(animation != null){
		cancelAnimation();
		return;
	}
	$("#player-b").html("stop");
	animation = setInterval(updateAnimation, 1000);
}

function fromTimestamp(str){
    return new Date(str).getTime();   
}

var geojsonMarkerOptions = {
    radius: 6,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

function display(){
	if(layer != null){
		map.removeLayer(layer);
	}

  	layer = L.geoJson(data, {
		pointToLayer: function (feature, latlng) {
	      	return L.circleMarker(latlng, geojsonMarkerOptions);
		},
		filter: function(feature, layer) {
			if(feature.geometry.type == 'Point') return false; // todo?
		    return (feature.properties.meta.timestamp.substr(0, compareLen) <= currentTime.substr(0,compareLen));
	    }
	});
  	layer.setStyle({color: 'black', fillColor: 'blue', fillOpacity: 0.5 });
  	layer.addTo(map);
  	//map.fitBounds(layer.getBounds());

  	/*
	layer = new L.OSM.DataLayer(data)
    layer.setStyle({color: 'black', fillColor: 'orange', fillOpacity: 0.5 });
    layer.addTo(map);
    map.fitBounds(layer.getBounds());
    */
}

$( document ).ready(function(){
	$('.modal-trigger').leanModal();
	$("#map").css('width', $(document).width());
	var barH = $("#mynavbar").height();
	$("#slider").css('top', (barH + 20)+"px");
	$("#animation-button").css('top', (barH+60)+"px");
	$("#myloader").css('top', (barH-8)+"px");
	$("#slider").css('width', ($(document).width()/3)+"px");
	$("#map").css('top', barH);
	$("#map").css('height', $(document).height()-barH);
	map = L.map('map').setView([44, 0.36], 17);//[50, 0], 3);
/*
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGhoaGhoaGhoaGgiLCJhIjoiY2lrcGRrenhrMDBhaXc4bHMwNXd3emszbiJ9.GSEKdLMRDLkp5HJozOsw_g', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(map);
*/

	L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>'
	}).addTo(map);

	map.on('zoomend', function() {
	    updateOnZoom();
	});

	updateOnZoom();
	//new L.OSM.Mapnik().addTo(map);	
});

function removePoints(){
	for(var i=data.features.length-1;i>=0;i--){
		if(data.features[i].geometry.type == 'Point'){
			data.features.splice(i, 1);
		}
	}
}

function getUniqueTimestamps(data){
	var ts = [];
	for(var i=0;i<data.features.length;i++){
		if(data.features[i].geometry.type != 'Point'){
			ts.push(data.features[i].properties.meta.timestamp);
		}
	}

	ts = ts.sort();
 	for(var i=ts.length-2;i>=0;i--){
 		var a = ts[i+1].substr(0, compareLen);
 		var b = ts[i].substr(0, compareLen);
 		if(a == b){
 			ts.splice(i+1, 1);
 		}
 	}
 	return ts;
}

