function redirect(id) {
    var url = '/applications/' + id;
    window.location.href = url;
};

function updateApplication(id) {
    alert('you called updateApplication');
    $.ajax({
        url: '/applications/' + id,
        type: 'POST',
        data: $('#update-application').serialize(),
        success: function (result) {
            window.location.replace("./");
        }
    })
}

function deleteApplication(id) {
    $.ajax({
        url: '/applications/' + id,
        type: 'DELETE',
        success: function (result) {
            window.location.reload(true);
        }
    })
}