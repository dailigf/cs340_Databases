function redirect(id){
	/*Redirect the /workstation page*/
	var url = '/workstations/' + id;
	window.location.href = url;
};
function updateWorkstation(id){
	/*Invoked in /updateWorkstation page for a target workstation.  When clicked, the form inputs
	 * are serialezed and a 'POST' request is sent to the /workstations/:id route */
	$.ajax({
        url: '/workstations/' + id,
        type: 'POST',
        data: $('#update-workstation').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
}

function deleteWorkstation(id){
	/*When the deleteWorkstation button is clicked, this function is invoked.  It submits 'DELETE' 
	 * request to /workstations route and append the id of workstation associated with the button*/
	$.ajax({
        	url: '/workstations/' + id,
        	type: 'DELETE',
        	success: function(result){
            		window.location.reload(true);
       		}
   	})
}

