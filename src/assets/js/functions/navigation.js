export default (function(){
    const menuButton = document.getElementById('menuButton');
    const navSideBar = document.getElementById('navSideBar');
    let backgroundOverlay = document.getElementById('backgroundOverlay');

    if(menuButton){
        menuButton.addEventListener('click', toggleSideBar);
        backgroundOverlay.addEventListener('click', toggleSideBar);

        navSideBar.addEventListener('click', event => {
            event.stopPropagation();
        });
    }

    function toggleSideBar(event){
        event.stopPropagation();

        if(menuButton.classList.contains('active')){
            menuButton.classList.remove('active');
            navSideBar.classList.remove('active');
            backgroundOverlay.classList.remove('active');
        }
        else {
            menuButton.classList.add('active');
            navSideBar.classList.add('active');
            backgroundOverlay.classList.add('active');
        }
    }
})();