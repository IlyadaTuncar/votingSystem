$(document).ready(function() {
    getPolls()
})

// må lage en funksjon her med en for løkke som oppretter videospilleren, og linken ved hjelp av html kode, akk som i admin
let pid

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
            '<video id ="my-video" class="video-js vjs-big-play-centered card-img-top" controls preload="auto" width="560" height="197" poster=" ' + o.thumbnail_url +'" data-setup="{}" >' +
            '<source src="' + o.video_url + '" type="application/x-mpegURL" />' +
            '<p class="vjs-no-js"> To view this video please enable Javascript, and consider upgrading to a web browser that' +
            '<a href="https://videojs.com/html5-video-support/" target="_blank">suppoerts HTML5 video</a>' +
            '</p>' +
            '</video>' +
            '<div class="card-body">' +
            '<h6 id="buttonTitles">Scoring av&nbsp' + o.scorer + '&nbspVS&nbsp' + o.motstander + '</h6>' +
            '<br/>' +
			'<div id="vote-text' + o.id +'">'+
			'</div>'+
			'<br/>' +
			'<div id="vote-graph' + o.id + '" style="width:80%; height:8px; background-color:#f1f1f1; display:none;">' +
			'</div>' + 
			'<br/>' +
            '<p style="font-size: 12px">Dato:' + o.dato + '</p>' +
            '<div class="d-flex justify-content-between align-items-center">' +
            '<div class="btn-group">' +
            '<button data-motstander="' + o.motstander + '" data-scorer="' + o.scorer + '" onclick="formaterVideoBeskrivelse(this.id, this.dataset.scorer, this.dataset.motstander)" id="' + o.id + '" class="btn btn-sm btn-secondary" data-toggle="modal" data-target="#myModal" type="submit"><strong>Stem på video</strong></button>' +
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

function formaterVideoBeskrivelse(oid, scorer, motstander){
	let table=
       '<div class="beskrivelse">'
		table += '<h5>Scoring av&nbsp' + scorer + '&nbspmot&nbsp' + motstander + '</h5>'
		table += '</div>'
	$(".videoBeskrivelse").html(table)
	$("#opprettStem_button").data("optionid", oid)
}


function getPolls() {
    $.get('/get_polls', function(data) {
		pid = data.id
        formaterOptions(data.options)
        hentPollTittel(data.title)
        hentPollBeskrivelse(data.poll_description)
        sluttDatoFunksjon(data.pollSluttDato)
    });
}

function getPoll(id) {
    url = '/get_poll/' + id
    $.get(url, function(data) {
        formaterOptions(data.options)
    });
}

//utvid mail sjekken så den fungerer bedre -- Lagd funskjonen. Kan lage flere om dette
function sjekkMail(mail){
    const regexp = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
    const ok = regexp.test(mail);
    if (!ok){
        $("#feilMail").html("Feil format på email. vennligst legg til riktig email")
		return false
	}
    else{
        $("#feilMail").html("");
		return true;
	}
}

function createVote() {
	let email = $("#email").val()
	let option_id = $("#opprettStem_button").data("optionid");
	$("#feilMail").hide();

	if(!sjekkMail(email)){
		$("#feilMail").show();
		return
	}

	let vote ={"poll_id": pid, "option_id": option_id, "email": email}
	let output =""

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
	if (output == "Stemme er registrert") {
		$("#myModal").modal('hide');
		alert("Stemmen din ble registrert. Takk for din stemme!");
		get_live_votes()
        return true
    } else {
		alert("Kunne ikke registrere din stemme. Prøv på nytt!");
        return false
    }
	
}

function get_live_votes(){
	url = '/live_votes/'+pid
	$.get(url, function(data) {
		// data innholder et array med json objekter
			// json objektene i arrayet har nøkklene option_id og vote_count
				// Det vil si id'en til vidoene og antall stemmer den har
		show_live_votes(data);
	});
	return
}

function show_live_votes(live_votes){
	let total_votes = 0
	for(lv of live_votes){
		total_votes += lv.vote_count
	}

	for(lv of live_votes){
		share_of_votes=lv.vote_count/total_votes*100

		let htmlgraph = '#vote-graph' + lv.option_id
		let htmltext = '#vote-text' + lv.option_id

		$(htmltext).text(""+lv.vote_count+" har stemt for dette målet")

		$(htmlgraph).html('<div style="width:'+share_of_votes+'%;background-color: #10253e;height:100%;"></div>')
		$(htmlgraph).show()
	}
	
}