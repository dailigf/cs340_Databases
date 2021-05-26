function deleteControlInstance(id){
	alert("You will delete Control Instance: " + id);
	$.ajax({
        	url: '/control_instances/' + id,
        	type: 'DELETE',
        	success: function(result){
            		window.location.reload(true);
       		}
   	})
}

