export default (function(){
    window.enableExperimentalVuesoraDarkMode = function(){
        document.body.classList.add('dark-mode');
        document.cookie = 'darkmode=true; max-age=31536000';
    };

    window.disableExperimentalVuesoraDarkMode = function(){
        document.body.classList.remove('dark-mode');
        document.cookie = 'darkmode=; expires=0;';
    };
})();