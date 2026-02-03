// Cookie Banner Logic
document.addEventListener('DOMContentLoaded', () => {
	// Проверяем, был ли баннер уже закрыт
	const cookieBannerClosed = localStorage.getItem('cookieBannerClosed');
	const cookieBanner = document.querySelector('.cookie-banner');
	const acceptButton = document.querySelector('.cookie-banner__button');
	
	// Если баннер еще не был закрыт, показываем его
	if (!cookieBannerClosed && cookieBanner) {
		// Небольшая задержка для лучшего UX
		setTimeout(() => {
			cookieBanner.classList.add('cookie-banner--visible');
		}, 1000);
	}
	
	// Обработчик клика по кнопке "Понятно"
	if (acceptButton) {
		acceptButton.addEventListener('click', () => {
			// Скрываем баннер с анимацией
			cookieBanner.classList.remove('cookie-banner--visible');
			
			// Сохраняем в localStorage, что баннер был закрыт
			localStorage.setItem('cookieBannerClosed', 'true');
			
			// Через 300ms удаляем баннер из DOM (после завершения анимации)
			setTimeout(() => {
				if (cookieBanner && cookieBanner.parentNode) {
					cookieBanner.parentNode.removeChild(cookieBanner);
				}
			}, 300);
		});
	}
});