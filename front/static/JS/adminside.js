$(document).ready(function(){
	$("#avstemning_button").click(function(){
		let markedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
		if( markedCheckboxes.length == 0){ 
			alert("ingen bokser er checked")
			return
		}
		else{
			$("#myModal").modal();
			formaterTitler()
		}
	});
});

options = []
function createPoll(){
	let markedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
	for(cb of markedCheckboxes){
		//per nå legger vi bare til video linken, men senere skal vi legge til et helt option object
		//et option object inkluderer tittel på mål, tekst beskrivelse, og video link
		options.push(createOption(cb.dataset.title, cb.dataset.vidlink))
	}
	console.log(options)
	//oppretter et poll object
	let poll = {"options" : options, "title": "this is a poll"}
	
	//poster poll objectet til backend
	postSetPoll(poll)
	getTitles()
	$('#myModal').hide()
	location.reload()  
	return
}

//Denne metoden skal senere ta inn tittel og text i tillegg
//Returnerer et json object
function createOption(title, link){
	return {"title" : title, 
			"video_url" : link}
}

//Denne metoden printer ut og returnerer kun tittelen på options. skal bli brukt til å liste ut videoene i modalen.
function getTitles(){
	for(a of options){
		console.log(a.title)
		return a.title
	}
}

//Denne må endres slik at mål tittelen blir hentet fra options array.
//Nå er det hardkodet at den kjører 3 ganger og skriver "mål 1" som tittel
function formaterTitler(){
	let hei = "HEIHEI"
	let table = 
		"<div class='list-group'>"
	for(var i = 0; i < 3; i++){
		table+=
		"<a href='#' class='list-group-item list-group-item-action flex-column align-items-start'>" +
		"<div class='d-flex w-100 justify-content-between'>" + 
		"<h5 class='mb-1'>Mål1</h5>" + 
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