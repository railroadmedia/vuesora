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
        const _time = Number(time);
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
}