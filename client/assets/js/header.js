const API_URL = 'http://localhost:5000';

// Login and Register Modal
let loginModal = document.getElementById('loginModal');
let registerModal = document.getElementById('registerModal');

// Buttons to trigger Login or Register Modal
let accountLi = document.getElementById('accountLi');
let accountLiWithUsername = document.getElementById('accountLiWithUsername');
let logoutLi = document.getElementById('logoutLi');
let btnAccount = document.getElementById('account');
let btnLogin = document.getElementById('openLoginModal');
let btnRegister = document.getElementById('openRegisterModal');

// Close buttons for Login and Register Form
let spanLogin = document.getElementById('closeLogin');
let spanRegister = document.getElementById('closeRegister');

let myItems = document.getElementById('myItems');

// Login and Register Form
let loginForm = document.querySelector('.login-form');
let registerForm = document.querySelector('.register-form');

// Username and Password Inputs for Login
let loginUsernameInput = document.getElementById('loginUsername');
let loginPasswordInput = document.getElementById('loginPassword');

// Login Error Message
let errorLogin = document.querySelector('.error-login');

// On click on 'account button'  open login modal
btnLogin.onclick = function () {
  registerModal.style.display = 'none';
  loginModal.style.display = 'block';
};

//On click on 'Register Here' from login modal to open register modal
btnRegister.onclick = function () {
  loginModal.style.display = 'none';
  registerModal.style.display = 'block';
};

// On click on "Login Here" from register nodal to open login modal back
btnAccount.onclick = function () {
  registerModal.style.display = 'none';
  loginModal.style.display = 'block';
};

// When user click on 'X' from modal to close it
spanLogin.onclick = function () {
  loginModal.style.display = 'none';
};
spanRegister.onclick = function () {
  registerModal.style.display = 'none';
};

// When the user clicks anywhere outside of the modal to close it
window.onclick = function (event) {
  switch (event.target) {
    case loginModal:
      loginModal.style.display = 'none';
      clearForms();

      break;
    case registerModal:
      registerModal.style.display = 'none';
      clearForms();

      break;
    default:
      break;
  }
};
const checkIfUserIsAuth = () => {
  let tokenLogin = sessionStorage.getItem('tokenLogin');
  logoutLi.style.display = 'none';
  if (tokenLogin) {
    tokenLogin = JSON.parse(tokenLogin);
    if (tokenLogin && tokenLogin.username) {
      accountLi.style.display = 'none';

      // Set visible the logout button
      logoutLi.style.display = 'inline-block';
      accountLiWithUsername.style.display = 'inline-block';
      if (myItems) {
        myItems.style.display = 'inline-block';
      }
      accountLiWithUsername.innerHTML = `
        <a title="Account" href="#">
            <i class="far fa-user"></i>
            Welcome, ${tokenLogin.username}
        </a>
        `;
    }
  }
};

const handleDataAfterSuccessAuth = (data = {}) => {
  if (Object.keys(data).length > 0) {
    // Save the data from API in sessionStorage for persistence
    const tokenLogin = JSON.stringify(data);
    sessionStorage.setItem('tokenLogin', tokenLogin);
    registerModal.style.display = 'none';
    loginModal.style.display = 'none';

    // Update Account button to view name
    accountLi.style.display = 'none';
    myItems.style.display = 'inline-block';
    // Set visible the logout button
    logoutLi.style.display = 'inline-block';
    accountLiWithUsername.style.display = 'inline-block';

    accountLiWithUsername.innerHTML = `
            <a title="Account" href="#">
                <i class="far fa-user"></i>
                Welcome, ${data.name}
            </a>
        `;
    clearForms();
  } else {
    alert('ERROR: Username or password incorrect');
  }
};

// Login User with username and password
const login = async (e) => {
  e.preventDefault();
  const loginForm = document.forms['login-form'];
  const username = loginForm['loginUsername'];
  const password = loginForm['loginPassword'];

  try {
    // Make fetch from API
    const url = `${API_URL}/login`;
    const body = {
      username: username.value,
      password: password.value,
    };

    const res = await POST_CALL(url, body);
    const { status, payload, error } = await res.json();

    if (status === 'ERROR') {
      checkAndHandleErrors('errorsLogin', error);
      return;
    }
    handleDataAfterSuccessAuth(payload);
  } catch (err) {
    alert('handle catch');
    checkAndHandleErrors('errorsLogin', err);
  }
};

// Register User  with name, username, password, confirm password
const register = async (e) => {
  e.preventDefault();
  const registerForm = document.forms['register-form'];
  const fullName = registerForm['nameRegister'];
  const username = registerForm['usernameRegister'];
  const password = registerForm['passwordRegister'];
  const confirmPassword = registerForm['confirmPasswordRegister'];
  try {
    // Make fetch from API
    const url = `${API_URL}/register`;
    const body = {
      name: fullName.value,
      username: username.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    };

    const res = await POST_CALL(url, body);
    const { status, payload, error } = await res.json();

    if (status === 'ERROR') {
      checkAndHandleErrors('errorsRegister', error);
      return;
    }
    handleDataAfterSuccessAuth(payload);
  } catch (err) {
    alert('handle catch');
    checkAndHandleErrors('errorsRegister', err);
  }
};

const clearForms = () => {
  loginUsernameInput.value = '';
  loginPasswordInput.value = '';
};

const logout = () => {
  // Clear the sessionStorage
  sessionStorage.clear();
  // Hide the logout button
  logoutLi.style.display = 'none';
  accountLi.style.display = 'inline-block';
  accountLiWithUsername.style.display = 'none';
  if (myItems) {
    myItems.style.display = 'none';
  }
  location.href = location.origin;
};

// Add events to forms
(function () {
  loginForm.addEventListener('submit', login.bind(this));
  registerForm.addEventListener('submit', register.bind(this));

  checkIfUserIsAuth();
})();
