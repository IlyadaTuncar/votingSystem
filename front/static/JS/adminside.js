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
				options.push(createOption(cb.dataset.title, cb.dataset.vidlink))
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
function createOption(title, link){
	return {"title" : title, 
			"video_url" : link}
}

function formaterTitler(){
	let table = 
		"<div class='list-group'>"
	for(a of options){
		table+=
		"<a href='#' class='list-group-item list-group-item-action flex-column align-items-start'>" +
		"<div class='d-flex w-100 justify-content-between'>" + 
		"<h5 class='mb-1'>"+a.title+"</h5>" + 
		"</div>"
		"</a>"
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
			table+=
			"<div class='col-sm'>"+
			"<input type='checkbox' id='option1' name='option1' data-title='"+a.description+"' data-vidlink='"+a.video_url+"'></input>" +
			"<label id='optionLabel' for='option1'>Velg</label>" +
			"<h6 id='optionNavn'>"+a.description+"</h6>"+
			"<video id='my-video' class='video-js vjs-big-play-centered' controls preload='auto' width='320' height='180' poster='"+a.thumbnail_url+"' data-setup='{}'>"+
			"<source src='"+a.video_url+"' type='application/x-mpegURL' />"+
			"<p class='vjs-no-js'> To view this video please enable JavaScript, and consider upgrading to a web browser that" + 
			"<a href='https://videojs.com/html5-video-support/' target='_blank'>supports HTML5 video</a>" +
			"</p>" + 
			"</video>" + 
			"<script src='https://vjs.zencdn.net/7.17.0/video.min.js'></script>" + 
			"</div>"
		}
		table+= "</div>" +
		"</div>"+
		"</div>"

		$("#nyesteVideoer").html(table)
}
