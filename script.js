const actionButton = document.querySelector('#actionButton');
const message = document.querySelector('#message');

actionButton.addEventListener('click', () => {
  message.textContent = 'Project is working perfectly! 🚀';
});
