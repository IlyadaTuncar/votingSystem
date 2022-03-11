$(document).ready(function() {
	getOptions()
})

let videoList = []

function updateVideoist(newList){
	videoList = newList
}

function openVideo(event, videoNr){
	var videoElm = videojs("videoPlayer");
    //console.log(videoNr)

	if(!videoElm.paused()){
		//console.log("pause")
		videoElm.pause()
	}
	if (videoNr=="video1"){
		//console.log("kjører if fra video 1")
		videoElm.src(videoList[0])
	} else if(videoNr=="video2"){
		//console.log("kjører if fra video 2")
		videoElm.src(videoList[1])
	} else if(videoNr=="video3"){
		//console.log("kjører if fra video 3")
		videoElm.src(videoList[2])
	}
	videoElm.play()
}

function getOptions(){
	$.get('/get_options', function ( data ){	
		newVideos = []
		for(o of data.options){
			newVideos.push(o.video_url)
		}
		updateVideoist(newVideos);
		console.log("NEW VIDEOES")
		console.log(newVideos)
	});
}

