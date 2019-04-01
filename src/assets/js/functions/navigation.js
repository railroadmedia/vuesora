import smoothscroll from 'smoothscroll-polyfill';

export default (function(){
    smoothscroll.polyfill();

    document.addEventListener('DOMContentLoaded', () => {
        const menuButton = document.getElementById('menuButton');
        const navSideBar = document.getElementById('navSideBar');
        const pageLinksContainer = document.getElementById('pageLinks');
        const searchButtons = document.querySelectorAll('.search-button');
        const searchBox = document.getElementById('searchColumn');
        const searchInput = document.getElementById('searchInput');
        const parentLinks = document.querySelectorAll('.parent-button');
        const subNavWrap = document.getElementById('subNavWrap');
        const scrollSubNavRight = document.getElementById('scrollSubNavRight');
        const scrollSubNavLeft = document.getElementById('scrollSubNavLeft');

        let currentSubNavScrollPosition = 0;
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

        document.body.addEventListener('click', event => {
            const element = event.target;

            if(element.getAttribute('id') === 'menuButton'){

            }
        });

        if(menuButton){
            menuButton.addEventListener('click', toggleSideBar);
            backgroundOverlay.addEventListener('click', closeEverything);
            navSideBar.addEventListener('click', event => {
                event.stopPropagation();
            });
        }

        if(searchButtons.length){
            Array.from(searchButtons).forEach(button => {
                button.addEventListener('click', toggleSearchBar);
            })
        }

        if(parentLinks.length){
            Array.from(parentLinks).forEach(link => {
                link.addEventListener('click', toggleChildLinks);
            });
        }

        function toggleSideBar(event){
            event.stopPropagation();

            if(navSideBar.classList.contains('active')){
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

            if(searchBox){
                searchBox.classList.toggle('active');
                // pageLinksContainer.classList.toggle('inactive');

                if(searchBox.classList.contains('active')){
                    searchInput.focus();
                }
                else {
                    searchInput.blur();
                }
            }
        }

        function closeEverything(event){
            event.stopPropagation();

            if(searchBox){
                searchBox.classList.remove('active');
                // pageLinksContainer.classList.remove('inactive');
            }

            menuButton.classList.remove('active');
            navSideBar.classList.remove('active');
            backgroundOverlay.classList.remove('active');
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

            try {
                localStorage.setItem('open_items', JSON.stringify(openItems));
            } catch(e){
                console.warn('Local storage not available in this browser');
            }
        }

        if(subNavWrap){
            subNavWrap.addEventListener('scroll', showOrHideButtons);
        }

        // Scroll the subnav
        function scrollSubNav(backwards = false){
            const amountToScroll = subNavWrap.clientWidth;
            const positionToScrollTo = backwards ? currentSubNavScrollPosition - amountToScroll : currentSubNavScrollPosition + amountToScroll;



            subNavWrap.scrollTo({
                top: 0,
                left: positionToScrollTo,
                behavior: 'smooth'
            });
        }

        // Show or hide the left or right buttons depending on the scroll position
        function showOrHideButtons(){
            const maximumScrollAmount = getMaximumScrollAmount();

            currentSubNavScrollPosition = subNavWrap.scrollLeft;

            if(currentSubNavScrollPosition <= 35){
                currentSubNavScrollPosition = 0;
                scrollSubNavLeft.classList.add('hide');
            }
            else {
                scrollSubNavLeft.classList.remove('hide');
            }

            if(currentSubNavScrollPosition >= (maximumScrollAmount - 35)){
                currentSubNavScrollPosition = maximumScrollAmount;
                scrollSubNavRight.classList.add('hide');
            }
            else {
                scrollSubNavRight.classList.remove('hide');
            }
        }

        // Get the maximum amount the subnav can scroll
        function getMaximumScrollAmount(){
            const amountToScroll = subNavWrap.clientWidth;
            const subNavLinks = document.querySelectorAll('.subnav-link');
            let maximumScrollAmount = 0;

            for(let i = 0; i < subNavLinks.length; i++){
                maximumScrollAmount += subNavLinks[i].clientWidth;
            }

            return maximumScrollAmount - amountToScroll;
        }

        function centerSubNavItems(){
            subNavWrap.classList.add('align-h-center');
            scrollSubNavRight.classList.add('hide');
            scrollSubNavLeft.classList.add('hide');
        }

        function init(){
            const subNavLinks = document.querySelectorAll('.subnav-link');
            const activeSubNavLink = Array.from(subNavLinks).filter(link => {
                if(link.classList.contains('active')){
                    return link;
                }
            });

            if(getMaximumScrollAmount() > 0){
                subNavWrap.classList.remove('align-h-center');

                if(activeSubNavLink.length){
                    currentSubNavScrollPosition = activeSubNavLink[0].offsetLeft;

                    subNavWrap.scrollTo({
                        top: 0,
                        left: currentSubNavScrollPosition - 35
                    });
                }

                showOrHideButtons();
            }
            else {
                centerSubNavItems();
            }
        }

        document.body.addEventListener('click', event => {
            const element = event.target;

            if(element.getAttribute('id') === 'scrollSubNavLeft'){
                scrollSubNav(true);
            }

            if(element.getAttribute('id') === 'scrollSubNavRight'){
                scrollSubNav();
            }
        });

        if(subNavWrap){
            (function(){
                init();
            })();

            window.addEventListener('resize', function(){
                init();
            })
        }
    });
})();