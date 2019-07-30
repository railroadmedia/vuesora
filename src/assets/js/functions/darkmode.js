export default (function () {
    window.enableExperimentalVuesoraDarkMode = function () {
        document.body.classList.add('dark-mode');
        document.cookie = 'darkmode=true;path=/;max-age=31536000;';
    };

    window.disableExperimentalVuesoraDarkMode = function () {
        document.body.classList.remove('dark-mode');
        document.cookie = 'darkmode=;path=/;expires=0;';
    };
}());
