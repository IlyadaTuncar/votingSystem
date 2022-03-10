
function createPoll(){
	options = []
	let markedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
	if( markedCheckboxes.length == 0){ 
		console.log("ingen bokser er checked")
		return
	}
	
	for(cb of markedCheckboxes){
		//per nå legger vi bare til video linken, men senere skal vi legge til et helt option object
		//et option object inkluderer tittel på mål, tekst beskrivelse, og video link
		options.push(createOption(cb.dataset.vidlink))
	}
	//oppretter et poll object
	let poll = {"options" : options, "title": "this is a poll"}
	
	//poster poll objectet til backend
	postSetPoll(poll)
	return
}

//Denne metoden skal senere ta inn tittel og text i tillegg
//Returnerer et json object
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

$(document).ready(function(){  
	$('#opprett_button').click(function(){  
		 var tittel = $('#tittel').val();  
		 var beskrivelse = $('#beskrielse').val();  
		 if(tittel != '' && beskrivelse != '')  
		 {  
			  $.ajax({  
				   url:"/action",  
				   method:"POST",  
				   data: {tittel:tittel, beskrivelse:beskrivelse},  
				   success:function(data)  
				   {  
						alert(data);  
						if(data == 'No-data')  
						{  
							 alert("Invalid Email Or Password!");  
						}  
						else 
						{  
							 $('#loginModal').hide();  
							 location.reload();  
						}  
				   }  
			  });  
		 }  
		 else 
		 {  
			  alert("Both Fields are required");  
		 }  
	});    
});  