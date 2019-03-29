


var toInfo = function(value) {
	var id = value
	var url = '/info?id=' + id.replace(/\s/g, '')
	console.log(url)
	reRoute(url,'POST')
	// reRoute2('/info','GET', [{"id":value}])
}