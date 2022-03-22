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
    let table = '<div class="button-container">'
    for (o of options) {
        table += '<button class="tablinks" onclick="openVideo(' + "'" + o.video_url + "'" + ');formaterVideoBeskrivelse(' + "'" + o.scorerlag + "'" + "," + "'" + o.scorer + "'" + "," + "'" + o.motstander + "'" + "," + "'" + o.dato + "'" + ');"><img id="tumbnail" src="' + o.thumbnail + '">' + '<h4 id="buttonTitles">Mål ' + o.scorerlag + '!&nbspScoring av&nbsp' + o.scorer + '&nbspmot&nbsp' + o.motstander + '.</h4></button>'
    }
    table += '</div>'
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