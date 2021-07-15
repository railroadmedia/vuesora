import smoothscroll from 'smoothscroll-polyfill';

export default (function () {
    smoothscroll.polyfill();

    document.addEventListener('DOMContentLoaded', () => {
        const menuButton = document.getElementById('menuButton');
        const colapseButton = document.getElementById('colapseButton');
        const sideBar = document.getElementById('sidebar');
        const navSideBar = document.getElementById('navSideBar');
        const sidebarClose = document.getElementById('sidebar-close');
        const pageLinksContainer = document.getElementById('pageLinks');
        const searchButtons = document.querySelectorAll('.search-button');
        const searchColumn = document.getElementById('searchColumn');
        const searchBox = document.getElementById('searchBox');
        const searchInput = document.getElementById('search-input');
        const toggledSearchInput = document.getElementById('toggled-search-input');
        const searchInputClear = document.getElementById('search-input-clear');
        const parentLinks = document.querySelectorAll('.parent-button');
        const subNavWrap = document.getElementById('subNavWrap');
        const scrollSubNavRight = document.getElementById('scrollSubNavRight');
        const scrollSubNavLeft = document.getElementById('scrollSubNavLeft');
        const platformDropdownTrigger = document.getElementById('platformDropdownTrigger');
        const platformDropdown = document.getElementById('platformDropdown');

        let currentSubNavScrollPosition = 0;
        const backgroundOverlay = document.getElementById('backgroundOverlay');
        const openItems = localStorage.getItem('open_items') ? JSON.parse(localStorage.getItem('open_items')) : [];

        openItems.forEach((item) => {
            const button = document.querySelector(`.page-link.parent[data-remain-open="${item}"] > .parent-button`);
            if (button != null) {
                const childLinks = button.parentElement.querySelector('.child-links');

                button.classList.add('active');
                childLinks.style['max-height'] = `${childLinks.scrollHeight}px`;
            }
        });

        document.body.addEventListener('click', (event) => {
            const element = event.target;

            if (element.getAttribute('id') === 'menuButton') {

            }
        });

        if (menuButton && sidebarClose) {
            menuButton.addEventListener('click', toggleSideBar);
            backgroundOverlay.addEventListener('click', closeEverything);
            navSideBar.addEventListener('click', (event) => {
                event.stopPropagation();
            });
            sidebarClose.addEventListener('click', toggleSideBar);
        }

        if (colapseButton && sideBar && !sideBar.classList.contains('no-collapse')) {
            colapseButton.addEventListener(
                'click',
                function(event) {
                    event.stopPropagation();
                    sideBar.classList.toggle('sidebar-collapsed');
                    if (sideBar.classList.contains('sidebar-collapsed')) {
                        document.body.classList.add('sidebar-collapsed');
                        document.cookie = 'collapsed=true;path=/;max-age=31536000;';
                    } else {
                        document.body.classList.remove('sidebar-collapsed');
                        document.cookie = 'collapsed=false;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;';
                    }
                }
            );
        }
        
        // Platform Dropdown
        if (platformDropdownTrigger && platformDropdown) {
            document.addEventListener('click', function(e){   
                //Open/Close Dropdown
                if (platformDropdownTrigger.contains(e.target)){
                    platformDropdownTrigger.classList.toggle('tw--rotate-180');
                    platformDropdown.classList.toggle('tw-max-h-60');
                }
                //Ensure Dropdown closes when clicking away
                if ( !platformDropdownTrigger.contains(e.target) && !platformDropdown.contains(e.target) ) {
                    platformDropdownTrigger.classList.remove('tw--rotate-180');
                    platformDropdown.classList.remove('tw-max-h-60');
                }
            })
        }

        if (searchInput && toggledSearchInput && searchInputClear) {

            if (searchInput.value) {
                searchInputClear.classList.remove('hide');
            } else {
                searchInputClear.classList.add('hide');
            }

            searchInput.addEventListener(
                'change',
                function(event) {
                    if (searchInput.value != toggledSearchInput.value) {
                        toggledSearchInput.value = searchInput.value;
                    }

                    if (searchInput.value) {
                        searchInputClear.classList.remove('hide');
                    } else {
                        searchInputClear.classList.add('hide');
                    }
                }
            );

            searchInput.addEventListener(
                'keyup',
                function(event) {
                    if (searchInput.value) {
                        searchInputClear.classList.remove('hide');
                    } else {
                        searchInputClear.classList.add('hide');
                    }
                }
            );

            toggledSearchInput.addEventListener(
                'change',
                function(event) {
                    if (toggledSearchInput.value != searchInput.value) {
                        searchInput.value = toggledSearchInput.value;
                    }

                    if (searchInput.value) {
                        searchInputClear.classList.remove('hide');
                    } else {
                        searchInputClear.classList.add('hide');
                    }
                }
            );

            searchInputClear.addEventListener(
                'click',
                function(event) {
                    searchInput.value = '';
                    searchInputClear.classList.add('hide');
                }
            );
        }

        if (searchButtons.length) {
            Array.from(searchButtons).forEach((button) => {
                button.addEventListener('click', toggleSearchBar);
            });
        }

        if (parentLinks.length) {
            Array.from(parentLinks).forEach((link) => {
                link.addEventListener('click', toggleChildLinks);
            });
        }

        function toggleSideBar(event) {
            event.stopPropagation();
            sideBar.classList.remove('sidebar-collapsed');

            if (sideBar.classList.contains('mobile')) {
                menuButton.classList.remove('active');
                sideBar.classList.remove('mobile');
                backgroundOverlay.classList.remove('active');
            } else {
                menuButton.classList.add('active');
                sideBar.classList.add('mobile');
                backgroundOverlay.classList.add('active');
            }
        }

        function toggleSearchBar(event) {
            event.stopPropagation();

            if (searchColumn) {
                searchColumn.classList.toggle('active');
                // pageLinksContainer.classList.toggle('inactive');

                if (searchColumn.classList.contains('active')) {
                    searchBox.classList.remove('hide-xs-only');
                    toggledSearchInput.focus();
                } else {
                    searchBox.classList.add('hide-xs-only');
                    toggledSearchInput.blur();
                }
            }
        }

        function closeEverything(event) {
            event.stopPropagation();

            if (searchColumn) {
                searchColumn.classList.remove('active');
                // pageLinksContainer.classList.remove('inactive');
            }

            menuButton.classList.remove('active');
            sideBar.classList.remove('mobile');
            backgroundOverlay.classList.remove('active');
        }

        function toggleChildLinks(event) {
            event.stopPropagation();
            const buttonClicked = event.target.parentElement;
            const childLinks = buttonClicked.querySelector('.child-links');

            saveToLocalStorage(buttonClicked.dataset.remainOpen);

            event.target.classList.toggle('active');

            if (event.target.classList.contains('active')) {
                childLinks.style['max-height'] = `${childLinks.scrollHeight}px`;
            } else {
                childLinks.removeAttribute('style');
            }
        }

        function saveToLocalStorage(value) {
            const valueExists = openItems.indexOf(value);

            if (valueExists !== -1) {
                openItems.splice(valueExists, 1);
            } else {
                openItems.push(value);
            }

            try {
                localStorage.setItem('open_items', JSON.stringify(openItems));
            } catch (e) {
                console.warn('Local storage not available in this browser');
            }
        }

        if (subNavWrap) {
            subNavWrap.addEventListener('scroll', showOrHideButtons);
        }

        // Scroll the subnav
        function scrollSubNav(backwards = false) {
            const amountToScroll = subNavWrap.clientWidth;
            const positionToScrollTo = backwards ? currentSubNavScrollPosition - amountToScroll : currentSubNavScrollPosition + amountToScroll;

            subNavWrap.scrollTo({
                top: 0,
                left: positionToScrollTo,
                behavior: 'smooth',
            });
        }

        // Show or hide the left or right buttons depending on the scroll position
        function showOrHideButtons() {
            const maximumScrollAmount = getMaximumScrollAmount();

            currentSubNavScrollPosition = subNavWrap.scrollLeft;

            if (currentSubNavScrollPosition <= 0) {
                currentSubNavScrollPosition = 0;
                scrollSubNavLeft.classList.add('hide');
            } else {
                scrollSubNavLeft.classList.remove('hide');
            }

            if (currentSubNavScrollPosition >= maximumScrollAmount) {
                currentSubNavScrollPosition = maximumScrollAmount;
                scrollSubNavRight.classList.add('hide');
            } else {
                scrollSubNavRight.classList.remove('hide');
            }
        }

        // Get the maximum amount the subnav can scroll
        function getMaximumScrollAmount() {
            const amountToScroll = subNavWrap.clientWidth;
            const subNavLinks = document.querySelectorAll('.subnav-link');
            let maximumScrollAmount = 0;

            for (let i = 0; i < subNavLinks.length; i++) {
                maximumScrollAmount += subNavLinks[i].clientWidth;
            }

            return maximumScrollAmount - amountToScroll;
        }

        function centerSubNavItems() {
            subNavWrap.classList.add('align-h-center');
            scrollSubNavRight.classList.add('hide');
            scrollSubNavLeft.classList.add('hide');
        }

        function init() {
            const subNavLinks = document.querySelectorAll('.subnav-link');
            const activeSubNavLink = Array.from(subNavLinks).filter((link) => {
                if (link.classList.contains('active')) {
                    return link;
                }
            });

            if (getMaximumScrollAmount() > 0) {
                subNavWrap.classList.remove('align-h-center');

                if (activeSubNavLink.length) {
                    currentSubNavScrollPosition = activeSubNavLink[0].offsetLeft;

                    subNavWrap.scrollTo({
                        top: 0,
                        left: currentSubNavScrollPosition - 35,
                    });
                }

                showOrHideButtons();
            } else {
                centerSubNavItems();
            }
        }

        document.body.addEventListener('click', (event) => {
            const element = event.target;

            if (element.getAttribute('id') === 'scrollSubNavLeft') {
                scrollSubNav(true);
            }

            if (element.getAttribute('id') === 'scrollSubNavRight') {
                scrollSubNav();
            }
        });

        if (subNavWrap) {
            (function () {
                init();
            }());

            window.addEventListener('resize', () => {
                init();
            });
        }
    });
}());
