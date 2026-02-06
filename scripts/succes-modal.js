document.addEventListener('DOMContentLoaded', () => {
	const successModal = document.getElementById('success-modal');
	const closeBtn = document.getElementById('close-success-modal');

	if (!successModal) return;

	function lockBody() {
		document.body.classList.add('is-locked');
	}

	function unlockBody() {
		document.body.classList.remove('is-locked');
	}

	window.showSuccessModal = function () {
		successModal.classList.add('success--visible');
		lockBody();
	};

	function closeSuccessModal() {
		successModal.classList.remove('success--visible');
		unlockBody();
	}

	closeBtn?.addEventListener('click', closeSuccessModal);

	successModal.addEventListener('click', e => {
		if (e.target === successModal) {
			closeSuccessModal();
		}
	});
});