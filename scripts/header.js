document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 69) {
                header.classList.add('header--sticky');
            } else {
                header.classList.remove('header--sticky');
            }
        });
    }
});
