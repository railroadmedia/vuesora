export default (function () {
    document.addEventListener('click', (event) => {
        if (event.target.matches('#toggleInstructorInfo')) {
            const instructorInfo = document.getElementById('instructorInfo');
            event.stopPropagation();

            event.target.classList.toggle('active');
            instructorInfo.classList.toggle('active');

            if (event.target.classList.contains('active')) {
                instructorInfo.style.maxHeight = `${instructorInfo.scrollHeight}px`;
            } else {
                instructorInfo.style.maxHeight = '0';
            }
        }
    });
}());
