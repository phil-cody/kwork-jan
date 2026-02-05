document.addEventListener('DOMContentLoaded', () => {
	const cookieBannerClosed = localStorage.getItem('cookieBannerClosed');
	const cookieBanner = document.querySelector('.cookie-banner');
	const acceptButton = document.querySelector('.cookie-banner__button');
	
	if (!cookieBannerClosed && cookieBanner) {
		setTimeout(() => {
			cookieBanner.classList.add('cookie-banner--visible');
		}, 1000);
	}
	
	if (acceptButton) {
		acceptButton.addEventListener('click', () => {
			cookieBanner.classList.remove('cookie-banner--visible');
			
			localStorage.setItem('cookieBannerClosed', 'true');
			
			setTimeout(() => {
				if (cookieBanner && cookieBanner.parentNode) {
					cookieBanner.parentNode.removeChild(cookieBanner);
				}
			}, 300);
		});
	}
});