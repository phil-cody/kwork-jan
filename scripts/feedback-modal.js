// Логика модального окна обратной связи
document.addEventListener('DOMContentLoaded', () => {
	// Элементы DOM
	const feedbackModal = document.getElementById('feedback-modal');
	const closeFeedbackModalBtn = document.getElementById('close-feedback-modal');
	const feedbackForm = document.getElementById('feedback-form');
	const feedbackPhoneInput = document.getElementById('feedback-phone');
	const feedbackNameInput = document.getElementById('feedback-name');
	const feedbackConsentCheckbox = document.getElementById('feedback-consent');
	const feedbackSubmitButton = feedbackForm ? feedbackForm.querySelector('.feedback-modal__submit') : null;
	const successModal = document.getElementById('success-modal');
	const closeSuccessModalBtn = document.getElementById('close-success-modal');
	
	// Кнопки для открытия модального окна (все кнопки с текстом "узнать условия для меня")
	const feedbackTriggerButtons = document.querySelectorAll('button');
	const triggerButtons = [];
	
	// Фильтрация кнопок по тексту
	feedbackTriggerButtons.forEach(button => {
		if (button.textContent.trim().toLowerCase().includes('узнать условия для меня')) {
			triggerButtons.push(button);
		}
	});
	
	// Флаг отправки
	let isSubmitting = false;
	
	// Функция открытия модального окна
	function openFeedbackModal() {
		if (feedbackModal) {
			feedbackModal.classList.add('feedback-modal--visible');
			document.body.style.overflow = 'hidden'; // Блокировка прокрутки
		}
	}
	
	// Функция закрытия модального окна
	function closeFeedbackModal() {
		if (feedbackModal) {
			feedbackModal.classList.remove('feedback-modal--visible');
			document.body.style.overflow = ''; // Разблокировка прокрутки
		}
	}
	
	// Функция сброса формы
	function resetFeedbackForm() {
		if (feedbackPhoneInput) feedbackPhoneInput.value = '';
		if (feedbackNameInput) feedbackNameInput.value = '';
		if (feedbackConsentCheckbox) feedbackConsentCheckbox.checked = false;
		validateFeedbackForm();
	}
	
	// Валидация формы
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
	
	// Функция показа модального окна успеха
	function showSuccessModal() {
		if (successModal) {
			successModal.classList.add('success--visible');
			document.body.style.overflow = 'hidden';
		}
	}
	
	// Обработка отправки формы
	function handleFeedbackSubmit(e) {
		e.preventDefault();
		
		// Проверка на повторную отправку
		if (isSubmitting) {
			return;
		}
		
		if (!validateFeedbackForm()) {
			return;
		}
		
		// Блокировка кнопки во время отправки
		isSubmitting = true;
		const originalButtonText = feedbackSubmitButton.textContent;
		feedbackSubmitButton.disabled = true;
		feedbackSubmitButton.classList.add('btn--disabled');
		feedbackSubmitButton.textContent = 'Отправка...';
		
		// Сбор данных формы
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
			
			// Разблокировка кнопки
			isSubmitting = false;
			feedbackSubmitButton.textContent = originalButtonText;
			validateFeedbackForm();
		}, 1000);
	}
	
	// Обработчики событий для открытия модального окна
	triggerButtons.forEach(button => {
		button.addEventListener('click', (e) => {
			e.preventDefault();
			openFeedbackModal();
		});
	});
	
	// Обработчик закрытия по кнопке
	if (closeFeedbackModalBtn) {
		closeFeedbackModalBtn.addEventListener('click', closeFeedbackModal);
	}
	
	// Закрытие модального окна при клике на оверлей
	if (feedbackModal) {
		feedbackModal.addEventListener('click', (e) => {
			if (e.target === feedbackModal) {
				closeFeedbackModal();
			}
		});
	}
	
	// Обработчики валидации формы
	if (feedbackPhoneInput) feedbackPhoneInput.addEventListener('input', validateFeedbackForm);
	if (feedbackNameInput) feedbackNameInput.addEventListener('input', validateFeedbackForm);
	if (feedbackConsentCheckbox) feedbackConsentCheckbox.addEventListener('change', validateFeedbackForm);
	
	// Обработчик отправки формы
	if (feedbackForm) feedbackForm.addEventListener('submit', handleFeedbackSubmit);
	
	// Обработчик закрытия модального окна успеха
	if (closeSuccessModalBtn) {
		closeSuccessModalBtn.addEventListener('click', () => {
			if (successModal) {
				successModal.classList.remove('success--visible');
				document.body.style.overflow = '';
			}
		});
	}
	
	// Закрытие модального окна успеха при клике на оверлей
	if (successModal) {
		successModal.addEventListener('click', (e) => {
			if (e.target === successModal) {
				successModal.classList.remove('success--visible');
				document.body.style.overflow = '';
			}
		});
	}
	
	// Начальная валидация
	validateFeedbackForm();
});
