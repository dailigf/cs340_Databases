function deleteControl(id){
	/*Function that is invoked when the deleteConrol button is clicked.  Supplies the controlID for the
	 * target control to the '/controls' route */
	$.ajax({
        	url: '/controls/' + id,
        	type: 'DELETE',
        	success: function(result){
            		window.location.reload(true);
       		}
   	})
}

