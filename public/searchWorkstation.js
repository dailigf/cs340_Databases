window.addEventListener('load', function(){
	const btn = document.querySelector('#search-btn');
	btn.addEventListener('click', function(e){
		e.preventDefault();
		const searchString = document.querySelector('#searchString').value;
		$.ajax({
			url:	  '/workstations/search',
			type: 	  'GET',
			data: 	  { query: searchString },
			success:  function(response){
				console.log(response);
			}
		})
	});
});

/*
function redirect(id){
	var url = '/workstations/' + id;
	window.location.href = url;
};
function updateWorkstation(id){
	alert('you called updateWorkstation');
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
*/
