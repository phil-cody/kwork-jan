// Guarantees Tabs
document.addEventListener('DOMContentLoaded', function () {
	const tabs = document.querySelectorAll('.guarantees__tab');
	const blocks = document.querySelectorAll('.guarantees__block');

	if (tabs.length > 0 && blocks.length > 0) {
		tabs.forEach(tab => {
			tab.addEventListener('click', () => {
				// Remove active class from all tabs
				tabs.forEach(t => t.classList.remove('active'));
				// Add active class to clicked tab
				tab.classList.add('active');

				// Hide all blocks
				blocks.forEach(block => block.classList.remove('active'));

				// Show target block
				const targetId = tab.getAttribute('data-tab') + '-block';
				const targetBlock = document.getElementById(targetId);
				if (targetBlock) {
					targetBlock.classList.add('active');
				}
			});
		});
	}
});
