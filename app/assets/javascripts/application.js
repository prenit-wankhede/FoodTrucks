// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require rails-ujs
//= require turbolinks
//= require_tree .

$.ready(function(){

})

function showLoader() {
	$(".loader").show()
} 

function hideLoader() {
	$(".loader").hide()
}

function initMap() {

	showLoader();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setMap);
    } else {
        setMap()
    }
	
}

function setMap(location) {
	var position = {}
	if(location) {
		position["lat"] = location.coords.latitude
		position["lng"] = location.coords.longitude
	} else {
		position["lat"] = 19.0760
		position["lng"] = 72.8777
	}

	var map = new google.maps.Map(document.getElementById('google-map-div'), {
	  zoom: 12,
	  center: position
	});
	var marker = new google.maps.Marker({
	  position: position,
	  map: map,
	  label: "You",
	  draggable:true,
	  icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
	});

	var infowindow = new google.maps.InfoWindow({
      content: "Your location <br> " + position.lat + ", " + position.lng
    });

    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
    
	hideLoader()

	var geocoder = new google.maps.Geocoder();

    document.getElementById('submit-address-button').addEventListener('click', function() {
      geocodeAddress(geocoder, map, marker, infowindow);
    });

    document.getElementById('submit-cordinates-button').addEventListener('click', function() {
      geocodeCordinates(geocoder, map, marker, infowindow);
    });

    marker.addListener('dragend', function(event) {
    	infowindow.setContent("Your location <br> " + event.latLng.lat() + ", " + event.latLng.lng())
    	document.getElementById('latitude').value = event.latLng.lat()
    	document.getElementById('longitude').value = event.latLng.lng()
    	geocodeCordinates(geocoder, map, marker, infowindow);
    });

}

function geocodeAddress(geocoder, resultsMap, resultMarker, resultInfoWindow) {
	var address = document.getElementById('address').value;
	geocoder.geocode({'address': address}, function(results, status) {
		handleGeoCodeResponse(resultInfoWindow, resultMarker, resultsMap, results, status)
	});
}

function geocodeCordinates(geocoder, resultsMap, resultMarker, resultInfoWindow) {
	var latitude = parseFloat(document.getElementById('latitude').value);
	var longitude = parseFloat(document.getElementById('longitude').value);
	var location = {lat: latitude, lng: longitude}

	geocoder.geocode({'location': location}, function(results, status) {
		handleGeoCodeResponse(resultInfoWindow, resultMarker, resultsMap, results, status)
	});
}

function handleGeoCodeResponse(resultInfoWindow, resultMarker, resultsMap, results, status){
	if (status === 'OK') {
		resultsMap.setCenter(results[0].geometry.location);
		
		resultMarker.setPosition(results[0].geometry.location)
		resultInfoWindow.setContent(results[0].formatted_address)
		
		document.getElementById('address').value = results[0].formatted_address
    	document.getElementById('latitude').value = results[0].geometry.location.lat()
    	document.getElementById('longitude').value = results[0].geometry.location.lng()

    	$.ajax({
    		method: "GET",
    		url: "/api/json/one/trucks",
    		data: {
    			latitude: results[0].geometry.location.lat(),
    			longitude: results[0].geometry.location.lng(),
    			address: results[0].formatted_address
    		},
    		success: function (result, status) {
    			alert(JSON.stringify(result))
    		},
    		error: function (result) {
				alert(JSON.stringify(result))
			}
    	})
    
	} else {
		alert('Geocode was not successful for the following reason: ' + status);
	}
}