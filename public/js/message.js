const form = document.querySelector('.contact-form');
const messageContainer = document.getElementById('message-container');

function showMessage(message, type) {
const closeButton = document.createElement('button');
closeButton.classList.add('close-button');
closeButton.innerHTML = 'x';

const messageElement = document.createElement('p');
messageElement.classList.add(type);
messageElement.innerHTML = message;

const container = document.createElement('div');
container.classList.add('message-container');
container.appendChild(messageElement);
container.appendChild(closeButton);
messageContainer.appendChild(container);

closeButton.addEventListener('click', () => {
  messageContainer.removeChild(container);
});
}


form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent form submission

  const formData = new URLSearchParams(new FormData(form));

  fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Show success message
        showMessage('Message sent successfully!', 'success');
      } else {
        // Show error message
        showMessage('Error sending message. Please try again.', 'error');
      }
    })
    .catch((error) => {
      // Show error message
      showMessage('Error sending message. Please try again.', 'error');
      console.error(error);
    });
});