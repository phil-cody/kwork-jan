document.addEventListener('DOMContentLoaded', () => {
	const feedbackModal = document.getElementById('feedback-modal');
	const closeFeedbackModalBtn = document.getElementById('close-feedback-modal');
	const feedbackForm = document.getElementById('feedback-form');
	const feedbackPhoneInput = document.getElementById('feedback-phone');
	const feedbackNameInput = document.getElementById('feedback-name');
	const feedbackConsentCheckbox = document.getElementById('feedback-consent');
	const feedbackSubmitButton = feedbackForm ? feedbackForm.querySelector('.feedback-modal__submit') : null;
	const successModal = document.getElementById('success-modal');
	const closeSuccessModalBtn = document.getElementById('close-success-modal');
	
	const feedbackTriggerButtons = document.querySelectorAll('button');
	const triggerButtons = [];
	
	feedbackTriggerButtons.forEach(button => {
		if (button.textContent.trim().toLowerCase().includes('узнать условия для меня')) {
			triggerButtons.push(button);
		}
	});
	
	let isSubmitting = false;
	
	function openFeedbackModal() {
		if (feedbackModal) {
			feedbackModal.classList.add('feedback-modal--visible');
			document.body.style.overflow = 'hidden';
		}
	}
	
	function closeFeedbackModal() {
		if (feedbackModal) {
			feedbackModal.classList.remove('feedback-modal--visible');
			document.body.style.overflow = '';
		}
	}
	
	function resetFeedbackForm() {
		if (feedbackPhoneInput) feedbackPhoneInput.value = '';
		if (feedbackNameInput) feedbackNameInput.value = '';
		if (feedbackConsentCheckbox) feedbackConsentCheckbox.checked = false;
		validateFeedbackForm();
	}
	
	function validateFeedbackForm() {
		const isPhoneFilled = feedbackPhoneInput && feedbackPhoneInput.value.trim() !== '';
		const isNameFilled = feedbackNameInput && feedbackNameInput.value.trim() !== '';
		const isConsentChecked = feedbackConsentCheckbox && feedbackConsentCheckbox.checked;
		
		const isFormValid = isPhoneFilled && isNameFilled && isConsentChecked;
		
		if (feedbackSubmitButton) {
			feedbackSubmitButton.disabled = !isFormValid;
			if (isFormValid) {
				feedbackSubmitButton.classList.remove('btn--disabled');
			} else {
				feedbackSubmitButton.classList.add('btn--disabled');
			}
		}
		
		return isFormValid;
	}
	
	function showSuccessModal() {
		if (successModal) {
			successModal.classList.add('success--visible');
			document.body.style.overflow = 'hidden';
		}
	}
	
	function handleFeedbackSubmit(e) {
		e.preventDefault();
		
		if (isSubmitting) {
			return;
		}
		
		if (!validateFeedbackForm()) {
			return;
		}
		
		isSubmitting = true;
		const originalButtonText = feedbackSubmitButton.textContent;
		feedbackSubmitButton.disabled = true;
		feedbackSubmitButton.classList.add('btn--disabled');
		feedbackSubmitButton.textContent = 'Отправка...';
		
		const formData = {
			phone: feedbackPhoneInput.value.trim(),
			name: feedbackNameInput.value.trim(),
			consent: feedbackConsentCheckbox.checked
		};
		
		// AJAX запрос
		console.log('Отправка данных формы обратной связи:', formData);
		
		// Заготовка для отправки на сервер
		/*
		fetch('/api/feedback', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		})
		.then(response => {
			if (!response.ok) throw new Error('Ошибка отправки');
			return response.json();
		})
		.then(data => {
			console.log('Успешно отправлено:', data);
			closeFeedbackModal();
			resetFeedbackForm();
			showSuccessModal();
		})
		.catch(error => {
			console.error('Ошибка:', error);
			alert('Произошла ошибка при отправке заявки');
		})
		.finally(() => {
			isSubmitting = false;
			feedbackSubmitButton.textContent = originalButtonText;
			validateFeedbackForm();
		});
		*/
		
		// Временная заглушка с имитацией задержки
		setTimeout(() => {
			closeFeedbackModal();
			resetFeedbackForm();
			showSuccessModal();
			isSubmitting = false;
			feedbackSubmitButton.textContent = originalButtonText;
			validateFeedbackForm();
		}, 1000);
	}
	
	triggerButtons.forEach(button => {
		button.addEventListener('click', (e) => {
			e.preventDefault();
			openFeedbackModal();
		});
	});
	
	if (closeFeedbackModalBtn) {
		closeFeedbackModalBtn.addEventListener('click', closeFeedbackModal);
	}
	
	if (feedbackModal) {
		feedbackModal.addEventListener('click', (e) => {
			if (e.target === feedbackModal) {
				closeFeedbackModal();
			}
		});
	}
	
	if (feedbackPhoneInput) feedbackPhoneInput.addEventListener('input', validateFeedbackForm);
	if (feedbackNameInput) feedbackNameInput.addEventListener('input', validateFeedbackForm);
	if (feedbackConsentCheckbox) feedbackConsentCheckbox.addEventListener('change', validateFeedbackForm);
	
	if (feedbackForm) feedbackForm.addEventListener('submit', handleFeedbackSubmit);
	
	if (closeSuccessModalBtn) {
		closeSuccessModalBtn.addEventListener('click', () => {
			if (successModal) {
				successModal.classList.remove('success--visible');
				document.body.style.overflow = '';
			}
		});
	}
	
	if (successModal) {
		successModal.addEventListener('click', (e) => {
			if (e.target === successModal) {
				successModal.classList.remove('success--visible');
				document.body.style.overflow = '';
			}
		});
	}
	
	validateFeedbackForm();
});
