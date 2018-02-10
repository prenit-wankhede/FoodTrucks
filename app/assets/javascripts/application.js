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
		position["lat"] = location.coords.latitude
		position["lng"] = location.coords.longitude
	}

	var map = new google.maps.Map(document.getElementById('google-map-div'), {
	  zoom: 12,
	  center: position
	});
	var marker = new google.maps.Marker({
	  position: position,
	  map: map
	});
	hideLoader()
}