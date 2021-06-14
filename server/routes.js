const UserController = require('./controllers/User');
const ItemController = require('./controllers/Item');

const userRoutes = [
  {
    method: 'GET',
    path: '/users',
    callback: UserController.getUsers,
  },
  {
    method: 'POST',
    path: '/register',
    callback: UserController.registerUser,
  },
  {
    method: 'POST',
    path: '/login',
    callback: UserController.login,
  },
  {
    method: 'GET',
    path: /\/users\/([0-9a-z]+)/,
    callback: UserController.getUserByID,
  },
  {
    method: 'DELETE',
    path: /\/users\/([0-9a-z]+)/,
    callback: UserController.deleteUserByID,
  },
  {
    method: 'PATCH',
    path: /\/users\/([0-9a-z]+)/,
    callback: UserController.patchUser,
  },
];

const itemRoutes = [
  {
    //GET ALL
    method: 'GET',
    path: '/items',
    callback: ItemController.get,
  },
  {
    // GET BY ID
    method: 'GET',
    path: /\/items\/([0-9a-z]+)/,
    callback: ItemController.getByID,
  },
  {
    // GET BY User ID
    method: 'GET',
    path: /\/itemsbyuser\/([0-9a-z]+)/,
    callback: ItemController.getByUserID,
  },
  {
    // ADD NEW ITEM
    method: 'POST',
    path: '/items',
    callback: ItemController.addItem,
  },
  {
    method: 'DELETE',
    path: /\/items\/([0-9a-z]+)/,
    callback: ItemController.deleteByID,
  },
  {
    method: 'PATCH',
    path: /\/items\/([0-9a-z]+)/,
    callback: ItemController.patchItem,
  },
];

module.exports = [...userRoutes, ...itemRoutes];
