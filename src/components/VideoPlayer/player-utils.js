export default {
    /**
     * Get an elements X and Y coordinates in the current viewport
     *
     * @param {Element|HTMLElement} element - the html element to get the coordinates of
     * @returns {Object} - object with x and y coords as props
     */
    getElementPosition(element) {
        let el = element;
        const positions = {
            x: 0,
            y: 0,
        };

        while (el) {
            if (el.tagName === 'BODY') {
                // deal with browser quirks with body/window/document and page scroll
                const xScroll = el.scrollLeft || document.documentElement.scrollLeft;
                const yScroll = el.scrollTop || document.documentElement.scrollTop;

                positions.x += (el.offsetLeft - xScroll + el.clientLeft);
                positions.y += (el.offsetTop - yScroll + el.clientTop);
            } else {
                // for all other non-BODY elements
                positions.x += (el.offsetLeft - el.scrollLeft + el.clientLeft);
                positions.y += (el.offsetTop - el.scrollTop + el.clientTop);
            }

            el = el.offsetParent;
        }

        return positions;
    },

    /**
     * Get the current x and y coordinates of a mouse or touch event relative to a dom element
     *
     * @param {Object} event - the mouse or touch event
     * @param {Element|HTMLElement} element - the html element
     * @returns {Object} - object with x and y coords as props
     */
    getMousePosition(event, element) {
        const mouseX = event.clientX || (event.touches[0] ? event.touches[0].clientX : event.changedTouches[0].clientX);
        const mouseY = event.clientY || (event.touches[0] ? event.touches[0].clientY : event.changedTouches[0].clientY);

        const elementPosition = this.getElementPosition(element);

        return {
            x: (mouseX - elementPosition.x),
            y: (mouseY - elementPosition.y),
        };
    },

    /**
     * Get the mouse x position percentage relative to the player width
     *
     * @param {Number|String} currentMouseX - the current mouse x coordinates
     * @param {Number|String} playerWidth - the width of the player
     * @returns {Number} - the left offset percentage of the mouse
     */
    getTimeRailMouseEventOffsetPercentage(currentMouseX, playerWidth) {
        const scrubberWidth = playerWidth - 14;
        let mouseX = currentMouseX - 7;

        if (mouseX < 0) {
            mouseX = 0;
        } else if (mouseX > scrubberWidth) {
            mouseX = scrubberWidth;
        }

        return (mouseX / scrubberWidth);
    },

    /**
     * Parse a number in seconds as H:MM:SS
     *
     * @param {Number|String} time
     * @returns {String} - the parsed timestamp as a string
     */
    parseTime(time) {
        const _time = Number(time || 0);
        const sections = {
            hours: Math.floor(_time / 3600),
            minutes: Math.floor((_time % 3600) / 60),
            seconds: Math.floor(_time % 3600 % 60),
        };
        let parsedTime = '';

        function padZeroes(num) {
            return num > -1 && num < 10 ? (`0${num}`) : num;
        }

        Object.keys(sections).forEach((section) => {
            if (sections[section] > 0 || section !== 'hours') {
                if (section !== 'seconds') {
                    if (section === 'minutes') {
                        parsedTime += `${padZeroes(sections[section])}:`;
                    } else {
                        parsedTime += `${sections[section]}:`;
                    }
                } else {
                    parsedTime += padZeroes(sections[section]);
                }
            }
        });

        return parsedTime;
    },

    /**
     * Return a quality label based on the qualities height
     *
     * @param {Number|String} height
     * @returns {String} - the parsed label
     */
    getQualityLabelByHeight(height) {
        return height === 2160 ? '4k' : `${height}p`;
    },

    /**
     * Check if the current user agent is any version of Internet Explorer
     *
     * @returns {Boolean}
     */
    isIE() {
        return navigator.userAgent.match(/MSIE|Trident/) != null;
    },

    /**
     * Check if the current user agent is any version of Safari
     *
     * @returns {Boolean}
     */
    isSafari() {
        return navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;
    },

    /**
     * Check if the current user agent is any mobile browser
     *
     * @returns {Object}
     */
    isMobile() {
        const apple_phone = /iPhone/i;
        const apple_ipod = /iPod/i;
        const apple_tablet = /iPad/i;
        const android_phone = /\bAndroid(?:.+)Mobile\b/i; // Match 'Android' AND 'Mobile'
        const android_tablet = /Android/i;
        const amazon_phone = /\bAndroid(?:.+)SD4930UR\b/i;
        const amazon_tablet = /\bAndroid(?:.+)(?:KF[A-Z]{2,4})\b/i;
        const windows_phone = /Windows Phone/i;
        const windows_tablet = /\bWindows(?:.+)ARM\b/i; // Match 'Windows' AND 'ARM'
        const other_blackberry = /BlackBerry/i;
        const other_blackberry_10 = /BB10/i;
        const other_opera = /Opera Mini/i;
        const other_chrome = /\b(CriOS|Chrome)(?:.+)Mobile/i;
        const other_firefox = /\Mobile(?:.+)Firefox\b/i; // Match 'Mobile' AND 'Firefox'

        let ua = (typeof navigator !== 'undefined' ? navigator.userAgent : '');

        // Facebook mobile app's integrated browser adds a bunch of strings that
        // match everything. Strip it out if it exists.
        let tmp = ua.split('[FBAN');
        if (typeof tmp[1] !== 'undefined') {
            ua = tmp[0];
        }

        // Twitter mobile app's integrated browser on iPad adds a "Twitter for
        // iPhone" string. Same probably happens on other tablet platforms.
        // This will confuse detection so strip it out if it exists.
        tmp = ua.split('Twitter');
        if (typeof tmp[1] !== 'undefined') {
            ua = tmp[0];
        }

        function match(regex, userAgent) {
            return regex.test(userAgent);
        }

        const result = {
            apple: {
                phone: match(apple_phone, ua) && !match(windows_phone, ua),
                ipod: match(apple_ipod, ua),
                tablet:
                    !match(apple_phone, ua)
                    && match(apple_tablet, ua)
                    && !match(windows_phone, ua),
                device:
                    (match(apple_phone, ua)
                        || match(apple_ipod, ua)
                        || match(apple_tablet, ua))
                    && !match(windows_phone, ua),
            },
            amazon: {
                phone: match(amazon_phone, ua),
                tablet: !match(amazon_phone, ua) && match(amazon_tablet, ua),
                device: match(amazon_phone, ua) || match(amazon_tablet, ua),
            },
            android: {
                phone:
                    (!match(windows_phone, ua) && match(amazon_phone, ua))
                    || (!match(windows_phone, ua) && match(android_phone, ua)),
                tablet:
                    !match(windows_phone, ua)
                    && !match(amazon_phone, ua)
                    && !match(android_phone, ua)
                    && (match(amazon_tablet, ua) || match(android_tablet, ua)),
                device:
                    (!match(windows_phone, ua)
                        && (match(amazon_phone, ua)
                            || match(amazon_tablet, ua)
                            || match(android_phone, ua)
                            || match(android_tablet, ua)))
                    || match(/\bokhttp\b/i, ua),
            },
            windows: {
                phone: match(windows_phone, ua),
                tablet: match(windows_tablet, ua),
                device: match(windows_phone, ua) || match(windows_tablet, ua),
            },
            other: {
                blackberry: match(other_blackberry, ua),
                blackberry10: match(other_blackberry_10, ua),
                opera: match(other_opera, ua),
                firefox: match(other_firefox, ua),
                chrome: match(other_chrome, ua),
                device:
                    match(other_blackberry, ua)
                    || match(other_blackberry_10, ua)
                    || match(other_opera, ua)
                    || match(other_firefox, ua)
                    || match(other_chrome, ua),
            },
        };
        (result.any = result.apple.device
            || result.android.device
            || result.windows.device
            || result.other.device),
        // excludes 'other' devices and ipods, targeting touchscreen phones
        (result.phone = result.apple.phone || result.android.phone || result.windows.phone),
        (result.tablet = result.apple.tablet || result.android.tablet || result.windows.tablet);

        return result;
    },

    /**
     * Parse time ranges as an array of objects with start and end properties
     *
     * @param {TimeRanges} timeRanges
     * @returns {Array}
     */
    parseTimeRangesAsArray(timeRanges) {
        const ranges = [];

        if (timeRanges.length) {
            for (let i = 0; i < timeRanges.length; i += 1) {
                ranges.push({
                    start: timeRanges.start(i),
                    end: timeRanges.end(i),
                });
            }
        }

        return ranges;
    },
};
