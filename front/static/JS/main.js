$(document).ready(function() {
    getPolls()
})

function openAdmin() {
	window.location.href = '/admin'
}

function openKunde() {
	window.location.href = '/fan'
}

//Funksjon for å hente polls, og legge det inn i en tabell sånn at admin får en oversikt over eksisterende poll.
function getPolls() {
    $.get('/get_all_polls', function(data) {      
		formaterPolls(data)	
    });
}

function formaterPolls(polls) {
	let table = 
	"<table class='table'>" +
		"<thead>" + 
			"<tr><th scope='col'>Poll tittel</th><th scope='col'>Sluttdato</th><th scope='col'>Link</th></tr>" +
		"</thead>" + 
		"<tbody>"
	for (p of polls) {
		table += "<tr>" + 
			"<td>" + p[2] + "</td>" +
			"<td>" + p[4] + "</td>" +
			"<td><a href='http://127.0.0.1:5000/fan'>Gå til poll</a></td>" +
			"</tr>"
	}
	table += "</tbody>" +
	"</table>"
    $("#eksisterendePoll").html(table)
}