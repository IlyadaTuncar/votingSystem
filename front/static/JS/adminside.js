function createPoll(){
	options = []
	let markedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
	if( markedCheckboxes.length == 0){ 
		console.log("ingen bokser er checked")
		return
	}
	
	for(cb of markedCheckboxes){
		console.log(cb.dataset.vidlink)
		options.push(createOption(cb.dataset.vidlink))
	}
	let poll = {"options" : options, "title": "this is a poll"}
	console.log(poll)
	data = {"poll":"peopoll"}
	postSetPoll(data)
	return
}

//Denne metoden skal senere ta inn tittel og text i tillegg
function createOption(link){
	return {"video_url":link}
}


function postSetPoll(poll){
	$.post('/create_poll', poll);
}