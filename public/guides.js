function deleteGuide(id){
	$.ajax({
        	url: '/guides/' + id,
        	type: 'DELETE',
        	success: function(result){
            		window.location.reload(true);
       		}
   	})
}

function updateGuide(id){
	$.ajax({
		url: '/guides/' + id,
		type: 'POST',
		data: $('#update-guide').serialize(),
		success: function(result){
			window.location.replace("./");
		}
	})
}

