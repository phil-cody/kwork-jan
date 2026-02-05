document.addEventListener('DOMContentLoaded', () => {
	const header = document.querySelector('.header');
	if (!header) return;

	const toggleSticky = () => {
		header.classList.toggle('header--sticky', window.scrollY > 10);
	};

	window.addEventListener('scroll', toggleSticky);
	toggleSticky(); // на случай загрузки не с верха страницы
});