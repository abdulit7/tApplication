function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    $('#main').css('margin-left', '250px');
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    $('#main').css('margin-left', '0');
}

$(document).keyup(function (e) {
    if (e.keyCode === 27) {
        if ($('#mySidenav').width() <= 0) {
            openNav();
        } else {
            closeNav();
        }
    }
});