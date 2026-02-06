document.addEventListener('DOMContentLoaded', () => {
	const fields = document.querySelectorAll('input[placeholder], textarea[placeholder]');

	fields.forEach(field => {
		const placeholder = field.getAttribute('placeholder');

		field.addEventListener('focus', () => {
			field.setAttribute('data-placeholder', placeholder);
			field.removeAttribute('placeholder');
		});

		field.addEventListener('blur', () => {
			if (field.value.trim() === '') {
				field.setAttribute(
					'placeholder',
					field.getAttribute('data-placeholder')
				);
			}
		});
	});
});