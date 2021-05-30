function selectOS(os){
	/*Function is not really necessary.  When redirected to the update page of a target workstations,
	 * it sets the drop down value to current operating system of the target workstation*/
	var operatingSystem = document.querySelector('#os-selector');
	console.log(os);
	operatingSystem.value = os;
}
