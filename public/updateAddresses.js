function redirect(id) {
    var url = '/addresses/' + id;
    window.location.href = url;
};
function updateAddress(id) {
    alert('you called updateAddress');
    $.ajax({
        url: '/addresses/' + id,
        type: 'POST',
        data: $('#update-address').serialize(),
        success: function (result) {
            window.location.replace("./");
        }
    })
}

function deleteAddress(id) {
    $.ajax({
        url: '/addresses/' + id,
        type: 'DELETE',
        success: function (result) {
            window.location.reload(true);
        }
    })
}