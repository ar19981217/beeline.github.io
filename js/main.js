mobMenu = document.querySelector('.navbar-collapse');
function menuBtn(s) {
    mobMenu.classList.toggle('open');
}
window.onresize = function () {
    if (window.innerWidth > 982){
        mobMenu.classList.remove('open');
    }
};
