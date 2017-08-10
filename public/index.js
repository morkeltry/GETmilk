var submit = document.getElementById('submit');
var usernameBox = document.getElementById('username');
var passwordBox = document.getElementById('password');
// var confirmPasswordBox = document.getElementById('confirmPassword');
var usernameWarning = document.getElementById('usernameWarning');
var passwordWarning = document.getElementById('passwordWarning');

// Client side validation for LOGIN page:

// check username and password exists
function emptyFieldCheck() {
  if (usernameBox.value === '') {
    usernameWarning.classList.remove('invisible');
    usernameBox.classList.add('warning');
  }
  if (passwordBox.value === '') {
    passwordWarning.classList.remove('invisible');
    passwordBox.classList.add('warning');
  }
}

function loginValidationCheck() {
  // check username and password match
}

submit.addEventListener('click', function(e) {
  // e.preventDefault();
  emptyFieldCheck();
  loginValidationCheck();
})


/**************************************/
// Client side validation for SIGNUP page:

function emptyFieldCheck() {
  if (usernameBox.value === '') {
    usernameWarning.classList.remove('invisible');
    usernameBox.classList.add('warning');
  }
  if (passwordBox.value === '') {
    passwordWarning.classList.remove('invisible');
    passwordBox.classList.add('warning');
  }
}

function passwordMatchCheck(password, passwordConfirm) {
  if (password !== passwordConfirm) {
    passwordWarning.classList.remove('invisible');
    passwordBox.classList.add('warning');
    confirmPasswordBox.classList.add('warning');
  }
};

// console.log ('cookie:',document.cookie,'---');

// submit.addEventListener('click', function (e){
//   // e.preventDefault();
//   var email = e.path[1].elements[0].value;
//   var password = e.path[1].elements[1].value;
//   var passwordConfirm = e.path[1].elements[2].value;
//   passwordCheck(password, passwordConfirm);
//
// });
