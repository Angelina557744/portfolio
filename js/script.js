document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.copy-email');

    buttons.forEach(button => {
        button.addEventListener('click', async () => {
            const email = button.dataset.email;
            const originalText = button.textContent;

            try {
                await navigator.clipboard.writeText(email);
                button.textContent = 'Скопировано!';
                button.classList.add('is-copied');

                setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove('is-copied');
                }, 2000);
            } catch (err) {
                button.textContent = email;
            }
        });
    });
});