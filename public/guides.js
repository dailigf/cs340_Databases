function deleteGuide(id){
	/*Function that is called when the delete button clicked.  Invoked the '/guides/:id' route.
	 * Appends id parameter*/
	$.ajax({
        	url: '/guides/' + id,
        	type: 'DELETE',
        	success: function(result){
            		window.location.reload(true);
       		}
   	})
}

function updateGuide(id){
	/*Function that is called when the update button is clicked.  Serialized the user input and POSTs
	 * to the '/guides/:id' route*/
	$.ajax({
		url: '/guides/' + id,
		type: 'POST',
		data: $('#update-guide').serialize(),
		success: function(result){
			window.location.replace("./");
		}
	})
}

