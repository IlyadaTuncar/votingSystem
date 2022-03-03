let videoList = [
	"https://api.forzasys.com/eliteserien/playlist.m3u8/2962:1633000:1668000/Manifest.m3u8",
	"https://api.forzasys.com/eliteserien/playlist.m3u8/2966:5399000:5434000/Manifest.m3u8",
	"https://api.forzasys.com/eliteserien/playlist.m3u8/2962:5767000:5802000/Manifest.m3u8"
]

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
	
	/*
	console.log("printer nå med foreach")
	videoList.forEach(element => console.log(element));
	console.log("printer nå med index")
	console.log(videoList[0])
	console.log(videoList[1])
	console.log(videoList[2])
	*/


}

function getOptions(){
	$.get('/get_options', function ( data ){	
		newVideos = []
		for(o of data.options){
			newVideos.push(o.video_url)
		}
		updateVideoist(newVideos);
	});
}