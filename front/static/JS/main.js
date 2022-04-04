$(document).ready(function() {
    getPolls()
})

function openAdmin() {
	window.location.href = '/admin'
}

function openOversikt() {
	window.location.href = '/opprettetPoll'
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
			"<tr><th scope='col'>Avstemning tittel</th><th scope='col'>Sluttdato</th><th scope='col'>Link</th></tr>" +
		"</thead>" + 
		"<tbody>"
	for (p of polls) {
		let url = "http://127.0.0.1:5000/fan/"+p[0];
		table += "<tr>" + 
			"<td>" + p[2] + "</td>" +
			"<td>" + p[4] + "</td>" +
			"<td><a href='" +url+ "'>Gå til avstemning</a></td>" +
			"</tr>"
	}
	table += "</tbody>" +
	"</table>"
    $("#eksisterendePoll").html(table)
}