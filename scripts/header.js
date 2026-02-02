document.addEventListener('DOMContentLoaded', () => {
	const header = document.querySelector('.header');

	if (header) {
		const headerHeight = header.offsetHeight;

		window.addEventListener('scroll', () => {
			if (window.scrollY > 10) {
				header.classList.add('header--sticky');
			} else {
				header.classList.remove('header--sticky');
			}
		});
	}
});
