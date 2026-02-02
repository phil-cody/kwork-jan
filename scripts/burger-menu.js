// Переключение меню
document.addEventListener('DOMContentLoaded', function () {
	const burgerButton = document.getElementById('burgerButton');
	const closeMenuButton = document.getElementById('closeMenuButton');
	const mobileMenu = document.getElementById('mobileMenu');
	const body = document.body;

	burgerButton.addEventListener('click', function () {
		mobileMenu.classList.add('active');
		body.style.overflow = 'hidden';
	});

	closeMenuButton.addEventListener('click', function () {
		mobileMenu.classList.remove('active');
		body.style.overflow = '';
	});

	const mobileNavLinks = document.querySelectorAll('.header__mobile-nav-link');
	mobileNavLinks.forEach(link => {
		link.addEventListener('click', function () {
			mobileMenu.classList.remove('active');
			body.style.overflow = '';
		});
	});
});
