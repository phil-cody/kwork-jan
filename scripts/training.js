document.addEventListener('DOMContentLoaded', () => {
	const trainingHeaders = document.querySelectorAll('.training__accordion-header');

	if (trainingHeaders.length > 0) {
		trainingHeaders.forEach(header => {
			header.addEventListener('click', () => {
				const item = header.closest('.training__item');

				document.querySelectorAll('.training__item.active').forEach(activeItem => {
					if (activeItem !== item) {
						activeItem.classList.remove('active');
					}
				});

				item.classList.toggle('active');
			});
		});
	}
});
