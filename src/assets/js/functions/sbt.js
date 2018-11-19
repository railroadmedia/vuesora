export default (function(){
    document.addEventListener('DOMContentLoaded', function(){
        const playButtons = document.querySelectorAll('.play-sbt');

        if(playButtons.length){

            Array.from(playButtons).forEach(button => {
                button.addEventListener('click', playSBT);
            })
        }
    });

    function playSBT(event){
        const thisButton = event.target;
        const videoId = thisButton.dataset['videoId'];
        const thisExercise = thisButton.dataset['exercise'];
        const thisExerciseImage = document.querySelector('.sbt-image[data-exercise="' + thisExercise + '"]');
        const allExerciseImages = document.querySelectorAll('.sbt-image');
        const videoElementToPlay = document.getElementById(videoId);
        const allVideos = document.querySelectorAll('.sbt-video');
        const allButtons = document.querySelectorAll('.play-sbt');
        const wasPlaying = thisButton.classList.contains('playing');

        // Stop All Videos
        Array.from(allVideos).forEach(video => {
            video.pause();
            video.classList.add('hide');
        });

        // Hide All Images
        Array.from(allExerciseImages).forEach(image => {
            image.classList.remove('hide');
        });

        // Remove Playing State from Buttons
        Array.from(allButtons).forEach(button => {
            button.classList.remove('playing');
        });

        // Only Play if the button you clicked didn't already have a playing state before we removed it
        if(!wasPlaying){
            videoElementToPlay.children[0].setAttribute(
                'src', videoElementToPlay.children[0].dataset['lazyLoadSource']
            );
            videoElementToPlay.classList.remove('hide');
            videoElementToPlay.load();
            videoElementToPlay.play();

            thisExerciseImage.classList.add('hide');
            thisButton.classList.add('playing');
        }
    }
})();