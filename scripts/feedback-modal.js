document.addEventListener('DOMContentLoaded', () => {
	const feedbackModal = document.getElementById('feedback-modal');
	const closeFeedbackModalBtn = document.getElementById('close-feedback-modal');
	const feedbackForm = document.getElementById('feedback-form');

	const phoneInput = document.getElementById('feedback-phone');
	const nameInput = document.getElementById('feedback-name');
	const consentCheckbox = document.getElementById('feedback-consent');
	const submitButton = feedbackForm?.querySelector('.feedback-modal__submit');


	const triggerButtons = document.querySelectorAll('[data-feedback-trigger]');

	function lockBody() {
		document.body.classList.add('is-locked');
	}

	function unlockBody() {
		document.body.classList.remove('is-locked');
	}

	function openModal(modal, visibleClass) {
		if (!modal) return;
		modal.classList.add(visibleClass);
		lockBody();
	}

	function closeModal(modal, visibleClass) {
		if (!modal) return;
		modal.classList.remove(visibleClass);
		unlockBody();
	}

	triggerButtons.forEach(btn => {
		btn.addEventListener('click', e => {
			e.preventDefault();
			openModal(feedbackModal, 'feedback-modal--visible');
		});
	});

	closeFeedbackModalBtn?.addEventListener('click', () => {
		closeModal(feedbackModal, 'feedback-modal--visible');
	});

	feedbackModal?.addEventListener('click', e => {
		if (e.target === feedbackModal) {
			closeModal(feedbackModal, 'feedback-modal--visible');
		}
	});

	function validateForm() {
		if (!phoneInput || !nameInput || !consentCheckbox || !submitButton) {
			return false;
		}

		const valid =
			phoneInput.value.trim() &&
			nameInput.value.trim() &&
			consentCheckbox.checked;

		submitButton.disabled = !valid;
		submitButton.classList.toggle('btn--disabled', !valid);

		return valid;
	}

	phoneInput?.addEventListener('input', validateForm);
	nameInput?.addEventListener('input', validateForm);
	consentCheckbox?.addEventListener('change', validateForm);

	feedbackForm?.addEventListener('submit', e => {
		e.preventDefault();
		if (!validateForm()) return;

		submitButton.textContent = 'Отправка...';
		submitButton.disabled = true;

		setTimeout(() => {
			closeModal(feedbackModal, 'feedback-modal--visible');

			if (window.showSuccessModal) {
				window.showSuccessModal();
			}

			feedbackForm.reset();
			submitButton.disabled = true;
			validateForm();
			submitButton.textContent = 'Отправить заявку';
		}, 1000);
	});
});