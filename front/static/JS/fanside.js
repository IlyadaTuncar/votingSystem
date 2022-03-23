$(document).ready(function() {
    getPolls()
})

// må lage en funksjon her med en for løkke som oppretter videospilleren, og linken ved hjelp av html kode, akk som i admin


function openVideo(video_url) {
    var videoElm = videojs("videoPlayer");

    if (!videoElm.paused()) {
        videoElm.pause()
    }
    videoElm.src(video_url)
    videoElm.play()

}

function sluttDatoFunksjon(pollSluttDato) {

    var sluttDato = new Date(pollSluttDato);
    var todayDate = new Date();

    todayDate.setHours(0, 0, 0, 0);
    sluttDato.setHours(0, 0, 0, 0);

    if (sluttDato.getTime() < todayDate.getTime()) {
        window.location.href = '/avsluttetPoll'
    }
}

function hentPollTittel(title) {
    let table = '<h1 class="jumbotron-heading">' + title + '</h1>'

    $(".pollTitle").html(table)
}

function hentPollBeskrivelse(poll_description) {
    let table = '<h3>' + poll_description + '</h3>'

    $(".pollBeskrivelse").html(table)
}

function formaterOptions(options) {
    let table =
        '<div class="content py-5 bg-light">' +
        '<div class="container">' +
        '<div class="row">'
    for (o of options) {
        table +=
            '<div class="col-md-4">' +
            '<div class="card md-4 box-shadow">' +
            '<video id ="my-video" class="video-js vjs-big-play-centered card-img-top" controls preload="auto" width="560" height="197" poster=" ' + o.thumbnail +'" data-setup="{}" >' +
            '<source src="' + o.video_url + '" type="application/x-mpegURL" />' +
            '<p class="vjs-no-js"> To view this video please enable Javascript, and consider upgrading to a web browser that' +
            '<a href="https://videojs.com/html5-video-support/" target="_blank">suppoerts HTML5 video</a>' +
            '</p>' +
            '</video>' +
            '<div class="card-body">' +
            '<h6 id="buttonTitles">Scoring av&nbsp' + o.scorer + '&nbspVS&nbsp' + o.motstander + '</h6>' +
            '<div class="d-flex justify-content-between align-items-center">' +
            '<div class="btn-group">' +
            '<button type="button" class="btn btn-sm btn-secondary" data-toggle="modal" data-target="#myModal" type="submit"><strong>Stem på video</strong></button>' +
            '</div>' +
            '<script src="https://vjs.zencdn.net/7.17.0/video.min.js"></script>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>'
    }
    table += '</div>' + '</div>' + '</div>'
    $(".videoTab").html(table)
}

function formaterVideoBeskrivelse(scorerlag, scorer, motstander, dato){
	let table='<div class="beskrivelse">'
		table += '<h4>Mål ' + scorerlag + '!&nbspScoring av&nbsp' + scorer+ '&nbspmot&nbsp' +motstander + '.</h4>'
		table += '<h5>Dato: ' + dato + '</h5>'
		table += '</div>'
	$(".videoBeskrivelse").html(table)
}


function getPolls() {
    $.get('/get_polls', function(data) {
        formaterOptions(data[0].options)
        hentPollTittel(data[0].title)
        hentPollBeskrivelse(data[0].poll_description)
        sluttDatoFunksjon(data[0].pollSluttDato)
    });
}

function getPoll(id) {
    url = '/get_poll/' + id
    $.get(url, function(data) {
        formaterOptions(data.options)
    });
}

//utvid mail sjekken så den fungerer bedre
function sjekkMail(mail){
	if (mail==""){
		return false
	} else{
		return true
	}
}

function createVote() {

	let navn = $("#navn").val()
	let mail = $("#email").val()
	
	//poll_id og option id må sendes ifra databasen. Så kan den bli lagret
	let option_id = "option_id funksjonen er ikke fikset enda"
	let poll_id = "poll funksjonen er ikke fikset enda"
	$("#feilMail").hide();

	if(!sjekkMail(mail)){
		$("#feilMail").show();
		return
	}

	let vote ={"poll_id": poll_id,"option_id": option_id, "navn": navn, "mail": mail}
	let output ="ajax call failed";

	$.ajax({
		url: '/newvote',
		method: "POST",
		data: JSON.stringify(vote),
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		async: false,
		success: function (data) {
			output=data
        }
	})
	console.log(output);
	return;
	
}