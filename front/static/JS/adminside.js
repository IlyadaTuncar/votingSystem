
function createPoll(){
	options = []
	let markedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
	if( markedCheckboxes.length == 0){ 
		console.log("ingen bokser er checked")
		return
	}
	
	for(cb of markedCheckboxes){
		options.push(createOption(cb.dataset.vidlink))
	}
	let poll = {"options" : options, "title": "this is a poll"}
	postSetPoll(poll)
	return
}

//Denne metoden skal senere ta inn tittel og text i tillegg
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