
function createPoll(){
	options = []
	let markedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
	if( markedCheckboxes.length == 0){ 
		alert("ingen bokser er checked")
		console.log("ingen bokser er checked")
		$('#myModal').hide()
		location.reload() 
		return
	}
	
	for(cb of markedCheckboxes){
		//per nå legger vi bare til video linken, men senere skal vi legge til et helt option object
		//et option object inkluderer tittel på mål, tekst beskrivelse, og video link
		options.push(createOption(cb.dataset.vidlink))
	}
	//oppretter et poll object
	let poll = {"options" : options, "title": "this is a poll"}
	
	//poster poll objectet til backend
	postSetPoll(poll)
	$('#myModal').hide()
	location.reload()  
	return
}

//Denne metoden skal senere ta inn tittel og text i tillegg
//Returnerer et json object
function createOption(link){
	return {"video_url":link}
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