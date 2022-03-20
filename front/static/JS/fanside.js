$(document).ready(function() {
	getOptions()
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

function getOptions(){
	$.get('/get_options', function ( data ){
		formaterOptions(data[0].options)
	});
}

