



var reRoute = function(route, method) {
	var form = document.createElement("FORM");
	form.setAttribute("action", route);
	form.setAttribute("method", method)
	document.body.appendChild(form);
	form.submit();
}

