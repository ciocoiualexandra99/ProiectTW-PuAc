const validateUserLogin = (body) => {
  const errors = {};
  if (!body) {
    errors.general = 'Body is empty!';
  } else {
    if (!body.username) {
      errors.username = 'Username is not found!';
    } else {
      if (body.username.length < 2) {
        errors.username = 'Username must be at least 2 chars!';
      }
    }

    if (!body.password) {
      errors.password = 'Password is not found!';
    } else {
      if (body.password.length < 2) {
        errors.password = 'Password must be at least 2 chars!';
      }
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

const validateUserRegister = (body) => {
  const errors = {};
  if (!body) {
    errors.general = 'Body is empty!';
  } else {
    if (!body.username) {
      errors.username = 'Username is not found!';
    } else {
      if (body.username.length < 2) {
        errors.username = 'Username must be at least 2 chars!';
      }
    }
    if (!body.name) {
      errors.name = 'Name is not found!';
    }

    if (!body.password) {
      errors.password = 'Password is not found!';
    } else {
      if (body.password.length < 2) {
        errors.password = 'Password must be at least 2 chars!';
      }
    }

    if (!body.confirmPassword) {
      errors.confirmPassword = 'confirmPassword is not found!';
    } else {
      if (body.confirmPassword.length < 2) {
        errors.confirmPassword = 'confirmPassword must be at least 2 chars!';
      }
    }

    if (
      body.password &&
      body.confirmPassword &&
      body.confirmPassword.trim() !== body.password.trim()
    ) {
      errors.confirmPassword = 'Passwords must match!';
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports = {
  validateUserRegister,
  validateUserLogin,
};
