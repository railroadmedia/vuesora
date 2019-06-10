export default {
    getTimeRailMouseEventOffsetPercentage(event, element){
        const mouseX = event.clientX || (event.touches[0] ? event.touches[0].clientX : event.changedTouches[0].clientX);

        function getPosition(el) {
            const positions = {
                x: 0,
                y: 0
            };

            while (el) {
                if (el.tagName === "BODY") {
                    // deal with browser quirks with body/window/document and page scroll
                    let xScroll = el.scrollLeft || document.documentElement.scrollLeft;
                    let yScroll = el.scrollTop || document.documentElement.scrollTop;

                    positions['x'] += (el.offsetLeft - xScroll + el.clientLeft);
                    positions['y'] += (el.offsetTop - yScroll + el.clientTop);
                } else {
                    // for all other non-BODY elements
                    positions['x'] += (el.offsetLeft - el.scrollLeft + el.clientLeft);
                    positions['y'] += (el.offsetTop - el.scrollTop + el.clientTop);
                }

                el = el.offsetParent;
            }
            return positions;
        }

        return ((mouseX - getPosition(element).x) /  element.clientWidth * 100);
    },

    parseTime(time){
        const _time = Number(time || 0);
        const sections = {
            hours: Math.floor(_time / 3600),
            minutes: Math.floor(_time % 3600 / 60),
            seconds: Math.floor(_time % 3600 % 60)
        };
        let parsedTime = '';

        function padZeroes(num){
            return num > -1 && num < 10 ? ('0' + num) : num;
        }

        Object.keys(sections).forEach(section => {
            if(sections[section] > 0 || section !== 'hours'){
                if(section !== 'seconds'){
                    parsedTime += sections[section] + ':';
                }
                else {
                    parsedTime += padZeroes(sections[section]);
                }
            }
        });

        return parsedTime;
    },

    getQualityLabelByHeight(height){
        return height === 2160 ? '4k' : height + 'p'
    },

    isSafari(){
        return navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;
    },

    isMobile() {
        const apple_phone = /iPhone/i,
            apple_ipod = /iPod/i,
            apple_tablet = /iPad/i,
            android_phone = /\bAndroid(?:.+)Mobile\b/i, // Match 'Android' AND 'Mobile'
            android_tablet = /Android/i,
            amazon_phone = /\bAndroid(?:.+)SD4930UR\b/i,
            amazon_tablet = /\bAndroid(?:.+)(?:KF[A-Z]{2,4})\b/i,
            windows_phone = /Windows Phone/i,
            windows_tablet = /\bWindows(?:.+)ARM\b/i, // Match 'Windows' AND 'ARM'
            other_blackberry = /BlackBerry/i,
            other_blackberry_10 = /BB10/i,
            other_opera = /Opera Mini/i,
            other_chrome = /\b(CriOS|Chrome)(?:.+)Mobile/i,
            other_firefox = /\Mobile(?:.+)Firefox\b/i; // Match 'Mobile' AND 'Firefox'

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
                    !match(apple_phone, ua) &&
                    match(apple_tablet, ua) &&
                    !match(windows_phone, ua),
                device:
                    (match(apple_phone, ua) ||
                        match(apple_ipod, ua) ||
                        match(apple_tablet, ua)) &&
                    !match(windows_phone, ua)
            },
            amazon: {
                phone: match(amazon_phone, ua),
                tablet: !match(amazon_phone, ua) && match(amazon_tablet, ua),
                device: match(amazon_phone, ua) || match(amazon_tablet, ua)
            },
            android: {
                phone:
                    (!match(windows_phone, ua) && match(amazon_phone, ua)) ||
                    (!match(windows_phone, ua) && match(android_phone, ua)),
                tablet:
                    !match(windows_phone, ua) &&
                    !match(amazon_phone, ua) &&
                    !match(android_phone, ua) &&
                    (match(amazon_tablet, ua) || match(android_tablet, ua)),
                device:
                    (!match(windows_phone, ua) &&
                        (match(amazon_phone, ua) ||
                            match(amazon_tablet, ua) ||
                            match(android_phone, ua) ||
                            match(android_tablet, ua))) ||
                    match(/\bokhttp\b/i, ua)
            },
            windows: {
                phone: match(windows_phone, ua),
                tablet: match(windows_tablet, ua),
                device: match(windows_phone, ua) || match(windows_tablet, ua)
            },
            other: {
                blackberry: match(other_blackberry, ua),
                blackberry10: match(other_blackberry_10, ua),
                opera: match(other_opera, ua),
                firefox: match(other_firefox, ua),
                chrome: match(other_chrome, ua),
                device:
                    match(other_blackberry, ua) ||
                    match(other_blackberry_10, ua) ||
                    match(other_opera, ua) ||
                    match(other_firefox, ua) ||
                    match(other_chrome, ua)
            }
        };
        (result.any =
            result.apple.device ||
            result.android.device ||
            result.windows.device ||
            result.other.device),
            // excludes 'other' devices and ipods, targeting touchscreen phones
            (result.phone =
                result.apple.phone || result.android.phone || result.windows.phone),
            (result.tablet =
                result.apple.tablet || result.android.tablet || result.windows.tablet);

        return result;
    }
}