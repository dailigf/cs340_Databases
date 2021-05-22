function redirect(id){
	var url = '/workstations/' + id;
	window.location.href = url;
};
function updateWorkstation(id){
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
	$.ajax({
        	url: '/workstations/' + id,
        	type: 'DELETE',
        	success: function(result){
            		window.location.reload(true);
       		}
   	})
}

