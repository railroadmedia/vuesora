export default (function () {
    document.addEventListener('DOMContentLoaded', () => {
        const instructorInfo = document.getElementById('instructorInfo');
        const toggleInstructorInfo = document.getElementById('toggleInstructorInfo');

        if (instructorInfo) {
            toggleInstructorInfo.addEventListener('click', toggleInfo);
        }

        function toggleInfo(event) {
            event.stopPropagation();

            toggleInstructorInfo.classList.toggle('active');
            instructorInfo.classList.toggle('active');

            if (event.target.classList.contains('active')) {
                instructorInfo.style.maxHeight = `${instructorInfo.scrollHeight}px`;
            } else {
                instructorInfo.style.maxHeight = '0';
            }
        }
    });
}());
