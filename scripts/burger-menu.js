document.addEventListener('DOMContentLoaded', () => {
	const burgerButton = document.getElementById('burgerButton');
	const closeMenuButton = document.getElementById('closeMenuButton');
	const mobileMenu = document.getElementById('mobileMenu');
	const overlay = document.getElementById('mobileMenuOverlay');
	const mobileNavLinks = document.querySelectorAll('.header__mobile-nav-link');
	const body = document.body;

	if (!burgerButton || !closeMenuButton || !mobileMenu || !overlay) return;

	function openMenu() {
		mobileMenu.classList.add('active');
		body.classList.add('is-menu-open');
	}

	function closeMenu() {
		mobileMenu.classList.remove('active');
		body.classList.remove('is-menu-open');
	}

	burgerButton.addEventListener('click', openMenu);
	closeMenuButton.addEventListener('click', closeMenu);
	overlay.addEventListener('click', closeMenu);

	mobileNavLinks.forEach(link => {
		link.addEventListener('click', closeMenu);
	});
});