export default (function(){
    const menuButton = document.getElementById('menuButton');
    const navSideBar = document.getElementById('navSideBar');
    const searchIcon = document.getElementById('searchIcon');
    const searchBox = document.getElementById('searchBox');
    const searchInput = document.getElementById('searchInput');
    const parentLinks = document.querySelectorAll('.parent-button');
    let backgroundOverlay = document.getElementById('backgroundOverlay');
    let openItems = localStorage.getItem('open_items') ? JSON.parse(localStorage.getItem('open_items')) : [];

    openItems.forEach(item => {
        let button = document.querySelector('.page-link.parent[data-remain-open="' + item + '"] > .parent-button');
        if(button != null){
            const childLinks = button.parentElement.querySelector('.child-links');

            button.classList.add('active');
            childLinks.style['max-height'] = childLinks.scrollHeight + 'px';
        }
    });

    if(menuButton){
        menuButton.addEventListener('click', toggleSideBar);
        backgroundOverlay.addEventListener('click', toggleSideBar);

        navSideBar.addEventListener('click', event => {
            event.stopPropagation();
        });
    }

    if(searchIcon){
        searchIcon.addEventListener('click', toggleSearchBar);
    }

    if(parentLinks.length){
        Array.from(parentLinks).forEach(link => {
            link.addEventListener('click', toggleChildLinks);
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

    function toggleSearchBar(event){
        event.stopPropagation();

        searchBox.classList.toggle('active');

        if(searchBox.classList.contains('active')){
            searchInput.focus();
        }
        else {
            searchInput.blur();
        }
    }

    function toggleChildLinks(event){
        event.stopPropagation();

        const buttonClicked = event.target.parentElement;
        const childLinks = buttonClicked.querySelector('.child-links');

        saveToLocalStorage(buttonClicked.dataset['remainOpen']);

        event.target.classList.toggle('active');

        if(event.target.classList.contains('active')){
            childLinks.style['max-height'] = childLinks.scrollHeight + 'px';
        }
        else {
            childLinks.removeAttribute('style');
        }
    }

    function saveToLocalStorage(value){
        let valueExists = openItems.indexOf(value);

        if(valueExists !== -1){
            openItems.splice(valueExists, 1);
        }
        else {
            openItems.push(value);
        }

        localStorage.setItem('open_items', JSON.stringify(openItems));
    }
})();