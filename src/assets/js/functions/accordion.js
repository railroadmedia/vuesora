export default (function(){
    document.body.addEventListener('click', event => {
        const thisTrigger = event.target;
        const thisAccordion = thisTrigger.parentElement;

        if(thisTrigger.classList.contains('accordion-trigger')){
            const thisContent = thisAccordion.querySelector('.accordion-content');

            if(thisAccordion.classList.contains('active')){
                thisAccordion.classList.remove('active');
                thisContent.removeAttribute('style');
            }
            else {
                thisAccordion.classList.add('active');
                thisContent.style.maxHeight = thisContent.scrollHeight + 'px';
            }
        }
    });

    function toggleAccordion(element){
        console.log(element);
    }

    window.closeAllAccordions = function(){

    }
})();