
function initMap() {
	var address = document.getElementById("address").innerText;
	var map = new google.maps.Map( document.getElementById('map'), {zoom: 12});
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address': address}, function(results, status) {
	  if (status == 'OK') {
	    map.setCenter(results[0].geometry.location);
	    var marker = new google.maps.Marker({
	        map: map,
	        position: results[0].geometry.location
	    });
	  } 
	});
}




var date = document.getElementById('date1')
var longDateStr = moment(date.innerText, 'Y/M/D').format('dddd MMMM D Y');
date.innerText = longDateStr;

