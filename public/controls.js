function deleteControl(id){
	$.ajax({
        	url: '/controls/' + id,
        	type: 'DELETE',
        	success: function(result){
            		window.location.reload(true);
       		}
   	})
}

