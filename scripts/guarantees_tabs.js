document.addEventListener('DOMContentLoaded', () => {
	const tabs = document.querySelectorAll('.guarantees__tab');
	const blocks = document.querySelectorAll('.guarantees__block');

	if (!tabs.length || !blocks.length) return;

	tabs.forEach(tab => {
		tab.addEventListener('click', () => {
			const key = tab.dataset.tab;

			tabs.forEach(t => t.classList.remove('active'));
			blocks.forEach(b => b.classList.remove('active'));

			tab.classList.add('active');

			const target = document.querySelector(
				`.guarantees__block[data-tab="${key}"]`
			);

			if (target) {
				target.classList.add('active');
			}
		});
	});
});