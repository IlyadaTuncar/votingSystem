$(document).ready(function() {
    getapi();
    $("#avstemning_button").click(function() {
        let markedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        if (markedCheckboxes.length == 0) {
            alert("ingen bokser er checked")
            return
        } else {
            options = []
            let markedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
            for (cb of markedCheckboxes) {
                //per nå legger vi bare til video linken, men senere skal vi legge til et helt option object
                //et option object inkluderer tittel på mål, tekst beskrivelse, og video link
                options.push(createOption(cb.dataset.title, cb.dataset.vidlink, cb.dataset.dato, cb.dataset.scorer, cb.dataset.scorerlag, cb.dataset.motstander, cb.dataset.thumbnail))
            }
            formaterTitler()
            $("#myModal").modal();
        }
    });
});

options = []

function createPoll() {
    const pollTittel = document.getElementById("pollTittel").value;
    const pollBeskrivelse = document.getElementById("pollBeskrivelse").value;
    const pollSluttDato = document.getElementById("pollSluttDato").value;
	
	$("#feilPollTittel").hide();
	$("#feilBeskrivelse").hide();

    //oppretter et poll object
    let poll = { "title": pollTittel, "poll_description": pollBeskrivelse, "pollSluttDato": pollSluttDato, "options": options }
    
	
	if(!validerPollTittel(pollTittel)){
		$("#feilPollTittel").show();
		return
	}else if(!validerPollBeskrivelse(pollBeskrivelse)){
		$("#feilBeskrivelse").show();
		return
	}
	//poster poll objectet til backend
    //Ikke gjort enda. returner info om hvilken poll id den nye pollen har til nettsiden /opprettetPoll
	if(postSetPoll(poll)){
		window.location.href = '/opprettetPoll'
	} else{
		$("#myModal").modal('hide');
		$("#feilModal").modal();
	}
	return
}

//Denne metoden skal senere ta inn tittel og text i tillegg
//Returnerer et json object
function createOption(title, link, dato, scorer, scorerlag, motstander, thumbnail) {
    return {
        "title": title,
        "video_url": link,
        "dato": dato,
		"scorer":scorer,
		"scorerlag":scorerlag,
        "motstander": motstander,
        "thumbnail": thumbnail
    }
}

function formaterTitler() {
    let table =
        "<div class='list-group'>"
    for (a of options) {
        table +=
            "<li class='list-group-item flex-column align-items-start'>" +
            "<div class='d-flex w-100 justify-content-between'>" +
            "<h5 class='mb-1'>Scoring av&nbsp" + a.scorer + "&nbspmot&nbsp" + a.motstander + "</h5>" +
            "</div>"
        "</li>"
    }
    table +=
        "</div>"
    $("#valgteVideoer").html(table)
}


function postSetPoll(poll){
	let output="";
	/*$.post('/create_poll', poll, function(data){
		console.log(data)
	})*/
	$.ajax({
		url: '/create_poll',
		method: "POST",
		data: JSON.stringify(poll),
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		async: false,
		success: function (data) {
			output=data
        }
	})

	//returner info om suksess eller feil ved oppretting av poll og send det til den nye nettsiden
	if(output=="Poll er opprettet"){
		return true
	} else{
		return false
	}
}

//Her prøver jeg å hente videoer fra api og formatere videoene
const api_url = "https://api.forzasys.com/eliteserien/playlist/?filters=%5B%22official%22%5D&tags=%5B%7B%22action%22:%22goal%22%7D%5D&orderby=date&count=6&from=0"

async function getapi() {
    const response = await fetch(api_url);
    const data = await response.json();

    let table =
        "<div class='content-block row'>" +
        "<div class='container'>" +
        "<div class='row'>"
    for (a of data.playlists) {
        for (b of a.events) {
            for (c of b.tags) {
                table +=
                    "<div class='col-sm'>" +
                    "<input type='checkbox' id='option1' name='option1' data-scorerlag='"+c.team.value+"' data-scorer='" + c.scorer.value + "' data-dato='" + a.game.date + "' data-motstander='" + a.game.visiting_team.name + "' data-title='" + a.description + "' data-vidlink='" + a.video_url + "' data-thumbnail='" + a.thumbnail_url + "'></input>" +
                    "<label id='optionLabel' for='option1'>Velg</label>" +
                    "<video id='my-video' class='video-js vjs-big-play-centered' controls preload='auto' width='320' height='180' poster='" + a.thumbnail_url + "' data-setup='{}'>" +
                    "<source src='" + a.video_url + "' type='application/x-mpegURL' />" +
                    "<p class='vjs-no-js'> To view this video please enable JavaScript, and consider upgrading to a web browser that" +
                    "<a href='https://videojs.com/html5-video-support/' target='_blank'>supports HTML5 video</a>" +
                    "</p>" +
                    "</video>" +
                    "<br>" +
                    "<h6 id='optionNavn'>Scoring av&nbsp" + c.scorer.value + "&nbspmot&nbsp" + a.game.visiting_team.name + "&nbsp&nbsp" + a.game.date + "</h6>" +
                    "<script src='https://vjs.zencdn.net/7.17.0/video.min.js'></script>" +
                    "</div>"
            }
        }
    }
    table += "</div>" +
        "</div>" +
        "</div>"

    $("#nyesteVideoer").html(table)
}


function validerPollTittel(tittel){
	const regexp = /^[a-zA-ZæøåÆØÅ. \-]{2,20}$/;
    const ok = regexp.test(tittel);
    if (!ok || (tittel='')){
        $("#feilPollTittel").html("Poll tittel må fylles ut.")
		return false
	}
    else{
        $("#feilPollTittel").html("");
		return true;
	}
}
function validerPollBeskrivelse(beskrivelse){
	const regexp = /^[a-zA-ZæøåÆØÅ. \-]{2,100}$/;
    const ok = regexp.test(beskrivelse);
    if (!ok || (beskrivelse='')){
        $("#feilBeskrivelse").html("Poll beskrivelse må fylles ut.")
		return false
	}
    else{
        $("#feilBeskrivelse").html("");
		return true;
	}
}