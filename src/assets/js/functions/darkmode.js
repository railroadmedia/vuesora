export default (function(){
    window.enableExperimentalVuesoraDarkMode = function(){
        document.body.classList.add('dark-mode');
        document.cookie = 'darkmode=true';
    };

    window.disableExperimentalVuesoraDarkMode = function(){
        document.body.classList.remove('dark-mode');
        document.cookie = 'darkmode=; expires=0;';
    };
})();