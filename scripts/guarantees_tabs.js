document.addEventListener('DOMContentLoaded', function () {
	const tabs = document.querySelectorAll('.guarantees__tab');
	const blocks = document.querySelectorAll('.guarantees__block');

	if (tabs.length > 0 && blocks.length > 0) {
		tabs.forEach(tab => {
			tab.addEventListener('click', () => {
				tabs.forEach(t => t.classList.remove('active'));
				tab.classList.add('active');

				blocks.forEach(block => block.classList.remove('active'));
				blocks.forEach(block => block.classList.remove('active'));

				const targetId = tab.getAttribute('data-tab') + '-block';
				const targetBlock = document.getElementById(targetId);
				if (targetBlock) {
					targetBlock.classList.add('active');
				}
			});
		});
	}
});
