$(document).ready(function() {
    getPolls()
})

// må lage en funksjon her med en for løkke som oppretter videospilleren, og linken ved hjelp av html kode, akk som i admin


function openVideo(event, video_url) {
    var videoElm = videojs("videoPlayer");

    if (!videoElm.paused()) {
        videoElm.pause()
    }
    videoElm.src(video_url)
    videoElm.play()

}



function hentPollBeskrivelse(poll_description) {
    let table = '<div class="container">'

    table += '<h3>' + poll_description + '</h3>'

    table += '</div>'
    $(".pollBeskrivelse").html(table)


}

function hentPollTittel(title) {
    let table = '<div class="container">'

    table += '<h1>' + title + '</h1>'

    table += '</div>'
    $(".pollTitle").html(table)


}

function formaterOptions(options) {
    let table = '<div class="button-container">'
    for (o of options) {
        table += '<button class="tablinks" onclick="openVideo(event, ' + "'" + o.video_url + "'" + ')">' + o.title + '</button>'
    }
    table += '</div>'
    $(".videoTab").html(table)
}


function getPolls() {
    $.get('/get_polls', function(data) {
        console.log(data)
        formaterOptions(data[0].options)
        hentPollTittel(data[0].title)
        hentPollBeskrivelse(data[0].poll_description)
    });
}

function getPoll(id) {
    url = '/get_poll/' + id
    $.get(url, function(data) {
        formaterOptions(data.options)
    });
}