let users = JSON.parse(localStorage.getItem('users')) || [];

function saveUsers() {
  localStorage.setItem('users', JSON.stringify(users));
}

document.getElementById('signup-btn').addEventListener('click', function() {
  const username = document.getElementById('signup-username').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const signupMessage = document.getElementById('signup-message');

  if (username && email && password) {
    const userExists = users.some(user => user.email === email);

    if (userExists) {
      signupMessage.textContent = 'Email already exists. Please try a different one.';
      signupMessage.className = 'message error';
    } else {
      users.push({ username, email, password });
      saveUsers();
      signupMessage.textContent = 'Sign up successful! You can now log in.';
      signupMessage.className = 'message success';

      document.getElementById('signup-username').value = '';
      document.getElementById('signup-email').value = '';
      document.getElementById('signup-password').value = '';
    }
  } else {
    signupMessage.textContent = 'Please fill out all fields.';
    signupMessage.className = 'message error';
  }
});

document.getElementById('login-btn').addEventListener('click', function() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const loginMessage = document.getElementById('login-message');

  if (email && password) {
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
      // Save the logged-in user's email to identify them
      localStorage.setItem('currentUser', email);

      loginMessage.textContent = 'Login successful! Redirecting...';
      loginMessage.className = 'message success';

      setTimeout(() => {
        window.location.href = '../resume-builder/index.html';
      }, 1000);
    } else {
      loginMessage.textContent = 'Invalid email or password.';
      loginMessage.className = 'message error';
    }
  } else {
    loginMessage.textContent = 'Please fill out all fields.';
    loginMessage.className = 'message error';
  }
});
