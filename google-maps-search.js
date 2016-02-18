
google.maps.event.addDomListener(window, 'load', intilize);
function intilize() {
    var ac = new google.maps.places.Autocomplete(document.getElementById("txtautocomplete"));
    var ac2 = new google.maps.places.Autocomplete(document.getElementById("txtautocomplete2"));

    google.maps.event.addListener(ac, 'place_changed', function () {
        var place = ac.getPlace();
        console.log(place.geometry.location.lat() +", "+place.geometry.location.lng());
        map.setView([place.geometry.location.lat(), place.geometry.location.lng()], 13);
    });

    google.maps.event.addListener(ac2, 'place_changed', function () {
        var place = ac2.getPlace();
        console.log(place.geometry.location.lat() +", "+place.geometry.location.lng());
        map.setView([place.geometry.location.lat(), place.geometry.location.lng()], 13);
        skipIntro();
    });
};