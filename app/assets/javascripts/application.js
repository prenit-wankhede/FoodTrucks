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

var markersArray = [];

function showLoader() {
	$(".loader").show()
} 

function hideLoader() {
	$(".loader").hide()
}

function showMessage(message) {
	$(".message").html(message)
	$(".message").show()
	setTimeout(function(){
		hideMessage()
	}, 5000)
} 

function hideMessage() {
	$(".message").html("")
	$(".message").hide()
}

function initMap() {

	showLoader();
    if (navigator.geolocation) {
    	showMessage("Fetching your current location. Please give permission and wait ...")
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
		document.getElementById('latitude').value = location.coords.latitude
    	document.getElementById('longitude').value = location.coords.longitude
	} else {
		position["lat"] = 37.78
		position["lng"] = -122.43
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

    geocodeCordinates(geocoder, map, marker, infowindow);
}

function geocodeAddress(geocoder, resultsMap, resultMarker, resultInfoWindow) {
	var address = document.getElementById('address').value;
    if(address) {
        showLoader()
        geocoder.geocode({'address': address}, function(results, status) {
            handleGeoCodeResponse(resultInfoWindow, resultMarker, resultsMap, results, status)
        });
    }
}

function geocodeCordinates(geocoder, resultsMap, resultMarker, resultInfoWindow) {
	var latitude = parseFloat(document.getElementById('latitude').value);
	var longitude = parseFloat(document.getElementById('longitude').value);

    if(latitude && longitude) {
        showLoader()
        var location = {lat: latitude, lng: longitude}
        geocoder.geocode({'location': location}, function(results, status) {
            handleGeoCodeResponse(resultInfoWindow, resultMarker, resultsMap, results, status)
        });    
    }
	
}

function handleGeoCodeResponse(resultInfoWindow, resultMarker, resultsMap, results, status){
	if (status === 'OK') {
		resultsMap.setCenter(results[0].geometry.location);
		
		resultMarker.setPosition(results[0].geometry.location)
		resultInfoWindow.setContent(results[0].formatted_address)
		
		document.getElementById('address').value = results[0].formatted_address
    	document.getElementById('latitude').value = results[0].geometry.location.lat()
    	document.getElementById('longitude').value = results[0].geometry.location.lng()

    	showLoader()
    	showMessage("Fetching nearby Food Trucks. Please Wait ...")
    	$.ajax({
    		method: "GET",
    		url: "/api/json/one/trucks.json",
    		data: {
    			latitude: results[0].geometry.location.lat(),
    			longitude: results[0].geometry.location.lng()
    		},
    		success: function (result, status) {
    			if(result && result.trucks.length) {
    				$("#food-truck-div").find("ul").html("")

    				var bounds = new google.maps.LatLngBounds();

    				$.each(markersArray, function(index, marker) {
    					marker.setMap(null)
    				})
    				markersArray = []

    				var truckCount = 0
    				var pushCartCount = 0
    				$.each(result.trucks, function(index, truck) {
    					
    					var position = {lat: parseFloat(truck.latitude), lng: parseFloat(truck.longitude)}
    					bounds.extend(position);
    					var icon
    					if(truck.facilitytype === "Truck") {
    						$("#food-truck-div").find("ul").append('<li class="Truck">' + truck.applicant + ', '+ truck.address + '<br> Serves: ' + truck.fooditems.substring(0,20) + '</li><br>')
    						truckCount = truckCount + 1
    						icon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
    					}
    					if(truck.facilitytype === "Push Cart") {
    						$("#food-truck-div").find("ul").append('<li class="Push-Cart">' + truck.applicant + ', '+ truck.address + '<br> Serves: ' + truck.fooditems.substring(0,20) + '</li><br>')
    						pushCartCount = pushCartCount + 1
    						icon = "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
    					}
    					var marker = new google.maps.Marker({
						  position: position,
						  map: resultsMap,
						  icon: icon
						});
						markersArray.push(marker)

						var infowindow = new google.maps.InfoWindow({
					      content: truck.applicant + "<br>" + truck.address + "<br>" + truck.fooditems
					    });

					    marker.addListener('click', function() {
					      infowindow.open(resultsMap, marker);
					    });
    				})

    				resultsMap.fitBounds(bounds);
    				showMessage("Found " + truckCount + " Trucks (marked in red) and " + pushCartCount + " Push Carts (marked in green).      Click on marker for more info.")
    				
    			} else {
    				showMessage("We could not find any Food Trucks around your location ! Try different location.")
    			}
    			hideLoader()
    		},
    		error: function (result) {
    			hideLoader()
				showMessage("There seems to be a glich in the server. Try again.")
			}
    	})
    
	} else {
		showMessage('Geocode was not successful for the following reason: ' + status);
	}
}