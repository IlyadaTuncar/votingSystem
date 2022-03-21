$(document).ready(function() {
	getPolls()
})

// må lage en funksjon her med en for løkke som oppretter videospilleren, og linken ved hjelp av html kode, akk som i admin


function openVideo(event, video_url){
	var videoElm = videojs("videoPlayer");
	
	if(!videoElm.paused()){
		videoElm.pause()
	}
	videoElm.src(video_url)
	videoElm.play()
	
}

function formaterOptions(options){
	let table = '<div class="button-container">' 
	for(o of options){
		table += '<button class="tablinks" onclick="openVideo(event, '+"'"+o.video_url+"'"+')">'+o.title+'</button>'
	}
	table += '</div>'
	$(".videoTab").html(table)
}

function getPolls(){
	$.get('/get_polls', function ( data ){
		console.log(data)
		formaterOptions(data[0].options)
	});
}

function getPoll(id){
	url = '/get_poll/'+id
	$.get(url, function ( data ){
		formaterOptions(data.options)
	});
}

$(document).ready(function(){
	getapi();
	$("#stem_button").click(function(){
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
				options.push(createOption(cb.dataset.title, cb.dataset.vidlink, cb.dataset.dato, cb.dataset.motstander))
			}
			formaterTitler()
			$("#myModal").modal();
		}
	});
});

options = []
function createVote(){
	const stemNavn = document.getElementById("stemNavn").value;
	const stemEpost = document.getElementById("stemEpost").value;
	const stemBeskrivelse = document.getElementById("stemBeskrivelse").value;
	//oppretter et poll object
	let poll = {"navn": stemNavn, "Epost": stemEpost, "vote_description": stemBeskrivelse, "options" : options}
	//poster poll objectet til backend
	postSetPoll(poll)
	//$('#myModal').hide()
	location.reload()
	return
}
