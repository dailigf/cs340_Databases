function redirect(id) {
    var url = '/app_instances/' + id;
    window.location.href = url;
};
function updateApp_Instances(id) {
    alert('you called updateApp_Instances');
    $.ajax({
        url: '/app_instances/' + id,
        type: 'POST',
        data: $('#update-App_Instances').serialize(),
        success: function (result) {
            window.location.replace("./");
        }
    })
}

function deleteApp_Instance(id) {
    $.ajax({
        url: '/app_instances/' + id,
        type: 'DELETE',
        success: function (result) {
            window.location.reload(true);
        }
    })
}