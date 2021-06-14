const { generateResponse } = require('../../helpers');
const User = require('../../models/User');
const {
  validateUserRegister,
  validateUserLogin,
} = require('../../validations');
const bcrypt = require('bcryptjs');

// GET ALL
const getUsers = async (res, body) => {
  try {
    const query = await User.find({});
    return generateResponse(res, query, 200);
  } catch (error) {
    return generateResponse(res, null, 400, error.message);
  }
};

// GET by ID
const getUserByID = async (res, _, id) => {
  try {
    if (id) {
      const query = await User.findById(id);
      if (query) {
        return generateResponse(res, query, 200);
      }
      return generateResponse(res, null, 400, 'Bad Request! Bad ID');
    }
    return generateResponse(res, null, 400, 'Bad Request! ID not provided!');
  } catch (error) {
    return generateResponse(res, null, 400, error.message);
  }
};

// DELETE by ID
const deleteUserByID = async (res, _, id) => {
  try {
    if (id) {
      const user = await User.findById(id);
      if (user) {
        const query = await User.findByIdAndRemove(id);
        return generateResponse(res, [], 200);
      }
      return generateResponse(res, null, 400, 'Bad Request! ID not found!');
    }
    return generateResponse(res, null, 400, 'Bad Request! ID not provided!');
  } catch (error) {
    return generateResponse(res, null, 400, error.message);
  }
};

// POST Add New User / Register
const registerUser = async (res, body) => {
  try {
    body = JSON.parse(body);
    const { errors, valid } = validateUserRegister(body);
    if (valid) {
      await User.init();
      body.password = await bcrypt.hash(body.password, 10);
      // const isEqual = await bcrypt.compare('asd', newPassword);
      const newUser = {
        username: body.username,
        password: body.password,
        name: body.name,
      };
      const { id, username, name } = await User.create(newUser);
      return generateResponse(res, { id, username, name }, 201);
    }
    return generateResponse(res, null, 400, errors);
  } catch (error) {
    return generateResponse(res, null, 400, error.message);
  }
};

// PATCH on USER
const patchUser = async (res, body, id) => {
  try {
    body = JSON.parse(body);
    if (body && id) {
      await User.findByIdAndUpdate(id, body);
      return generateResponse(res, 'Updated Successfully', 200);
    }
  } catch (error) {
    return generateResponse(res, null, 400, error.message);
  }
};

const login = async (res, body) => {
  try {
    body = JSON.parse(body);
    const { errors, valid } = validateUserLogin(body);
    if (valid) {
      const users = await User.find({
        username: body.username,
      });
      if (users && users.length > 0) {
        const { id, username, password, name } = users[0];
        const passwordMatch = await bcrypt.compare(body.password, password);
        if (passwordMatch) {
          return generateResponse(res, { id, username, name }, 200);
        }
        return generateResponse(res, null, 400, 'Bad Credentials');
      }
      return generateResponse(res, null, 400, 'Bad Credentials');
    }
    return generateResponse(res, null, 400, errors);
  } catch (error) {
    return generateResponse(res, null, 400, error.message);
  }
};

module.exports = {
  getUsers,
  getUserByID,
  deleteUserByID,
  registerUser,
  patchUser,
  login,
};
