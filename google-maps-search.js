
google.maps.event.addDomListener(window, 'load', intilize);
function intilize() {
    var ac = new google.maps.places.Autocomplete(document.getElementById("txtautocomplete"));
    google.maps.event.addListener(ac, 'place_changed', function () {
        var place = ac.getPlace();
        console.log(place.geometry.location.lat() +", "+place.geometry.location.lng());
        map.setView([place.geometry.location.lat(), place.geometry.location.lng()], 13);
    });
};