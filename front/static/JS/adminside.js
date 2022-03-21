$(document).ready(function(){
	getapi();
	$("#avstemning_button").click(function(){
		let markedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
		if( markedCheckboxes.length == 0){ 
			alert("ingen bokser er checked")
			return
		}
		else{
			options = []
			let markedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
			for(cb of markedCheckboxes){
				//per nå legger vi bare til video linken, men senere skal vi legge til et helt option object
				//et option object inkluderer tittel på mål, tekst beskrivelse, og video link
				options.push(createOption(cb.dataset.title, cb.dataset.vidlink, cb.dataset.dato, cb.dataset.motstander, cb.dataset.thumbnail))
			}
			formaterTitler()
			$("#myModal").modal();
		}
	});
});

options = []
function createPoll(){
	const pollTittel = document.getElementById("pollTittel").value;
	const pollBeskrivelse = document.getElementById("pollBeskrivelse").value;
	//oppretter et poll object
	let poll = {"title": pollTittel, "poll_description": pollBeskrivelse, "options" : options}
	//poster poll objectet til backend
	postSetPoll(poll)
	//$('#myModal').hide()
	location.reload()  
	return
}

//Denne metoden skal senere ta inn tittel og text i tillegg
//Returnerer et json object
function createOption(title, link, dato, motstander, thumbnail){
	return {"title" : title, 
			"video_url" : link,
			"dato" : dato,
			"motstander": motstander,
			"thumbnail": thumbnail
		}
}

function formaterTitler(){
	let table = 
		"<div class='list-group'>"
	for(a of options){
		table+=
		"<li class='list-group-item flex-column align-items-start'>" +
		"<div class='d-flex w-100 justify-content-between'>" + 
		"<h5 class='mb-1'>"+a.title+"</h5>" + 
		"</div>"
		"</li>"
	}
	table+=
	"</div>"
	$("#valgteVideoer").html(table)
}


function postSetPoll(poll){
	$.ajax({
		url:'/create_poll',
		method:"POST",
		data:JSON.stringify(poll),
		contentType:"application/json; charset=utf-8",
		dataType:"json",
		success: function(){
			//console.log('Success')
		}
	})
}

//Her prøver jeg å hente videoer fra api og formatere videoene
const api_url = "https://api.forzasys.com/eliteserien/playlist/?filters=%5B%22official%22%5D&tags=%5B%7B%22action%22:%22goal%22%7D%5D&orderby=date&count=6&from=0"

async function getapi() {
    const response = await fetch(api_url);
    const data = await response.json();

	let table = 
		"<div class='content-block row'>" +
		"<div class='container'>" +
		"<div class='row'>"
		for(a of data.playlists){
			for(b of a.events){
				for(c of b.tags){
					table+=
					"<div class='col-sm'>"+
					"<input type='checkbox' id='option1' name='option1' data-dato='"+a.game.date+"' data-motstander='"+a.game.visiting_team.name+"' data-title='"+a.description+"' data-vidlink='"+a.video_url+"' data-thumbnail='"+a.thumbnail_url+"'></input>" +
					"<label id='optionLabel' for='option1'>Velg</label>" +
					"<video id='my-video' class='video-js vjs-big-play-centered' controls preload='auto' width='320' height='180' poster='"+a.thumbnail_url+"' data-setup='{}'>"+
					"<source src='"+a.video_url+"' type='application/x-mpegURL' />"+
					"<p class='vjs-no-js'> To view this video please enable JavaScript, and consider upgrading to a web browser that" + 
					"<a href='https://videojs.com/html5-video-support/' target='_blank'>supports HTML5 video</a>" +
					"</p>" + 
					"</video>" + 
					"<br>"+
					"<h6 id='optionNavn'>Scoring av&nbsp"+c.scorer.value+"&nbspmot&nbsp"+a.game.visiting_team.name+"&nbsp&nbsp"+a.game.date+"</h6>"+
					"<script src='https://vjs.zencdn.net/7.17.0/video.min.js'></script>" + 
					"</div>"
				}
			}
		}
		table+= "</div>" +
		"</div>"+
		"</div>"

		$("#nyesteVideoer").html(table)
}

/*
//Denne funksjonen har blitt brukt til å vise datane fra api'et til forzasys
//Jeg har kommentert den ut, men jeg lar den ligge her i tilfelle noen får bruk for å se på apiet igjen

async function checkApi() {
    const response = await fetch(api_url);
    const data = await response.json();

	console.log(data.playlists)
	for(element of data.playlists){
		console.log("Thumbnail link:"+element.thumbnail_url)
		console.log("HD Thumbnail link:"+element.hd_thumbnail_url)

	}
}
*/