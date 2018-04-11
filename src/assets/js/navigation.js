export default (function(){
    const menuButton = document.getElementById('menuButton');
    const navSideBar = document.getElementById('navSideBar');

    menuButton.addEventListener('click', event => {
        event.stopPropagation();

        menuButton.classList.toggle('active');
        navSideBar.classList.toggle('active');
    });

    navSideBar.addEventListener('click', event => {
        event.stopPropagation();
    });

    document.addEventListener('click', event => {
        event.stopPropagation();

        menuButton.classList.remove('active');
        navSideBar.classList.remove('active');
    });
})();