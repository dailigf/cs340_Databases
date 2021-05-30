function deleteControlInstance(id){
	/*Function called when clicking the delete button for a target controlInstance*/
	$.ajax({
        	url: '/control_instances/' + id,
        	type: 'DELETE',
        	success: function(result){
            		window.location.reload(true);
       		}
   	})
}

