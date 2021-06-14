const { generateResponse, returnCSVFromItems } = require('../../helpers');
const Item = require('../../models/Item');

// GET ALL

const get = async (res, _, params) => {
  try {
    const query = await Item.find({});

    const csv = returnCSVFromItems(query);

    return generateResponse(res, query, 200, null, csv);
  } catch (error) {
    return generateResponse(res, null, 400, error.message);
  }
};

const getByUserID = async (res, _, id) => {
  try {
    if (id) {
      const query = await Item.find({userId:id});
      if (query) {
        const csv = returnCSVFromItems(query);
        return generateResponse(res, query, 200,null, csv);
      }
      return generateResponse(res, null, 400, 'Bad Request! Bad ID');
    }
    return generateResponse(res, null, 400, 'Bad Request! ID not provided!');
  } catch (error) {
    return generateResponse(res, null, 400, error.message);
  }
};

// GET by ID
const getByID = async (res, _, id) => {
  try {
    if (id) {
      const query = await Item.findById(id);
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
const deleteByID = async (res, _, id) => {
  try {
    if (id) {
      const item = await Item.findById(id);
      if (item) {
        await Item.findByIdAndRemove(id);
        return generateResponse(res, [], 200);
      }
      return generateResponse(res, null, 400, 'Bad Request! ID not found!');
    }
    return generateResponse(res, null, 400, 'Bad Request! ID not provided!');
  } catch (error) {
    return generateResponse(res, null, 400, error.message);
  }
};

// POST Add New Item
const addItem = async (res, body) => {
  try {
    body = JSON.parse(body);
    await Item.init();
    const newItem = await Item.create(body);
    return generateResponse(res, newItem, 201);
  } catch (error) {
    return generateResponse(res, null, 400, error.message);
  }
};

// PATCH on ITEM
const patchItem = async (res, body, id) => {
  try {
    body = JSON.parse(body);
    if (body && id) {
      await Item.init();
      await Item.findByIdAndUpdate({ _id: id }, body, { runValidators: true });
      return generateResponse(res, 'Updated Successfully', 200);
    }
  } catch (error) {
    return generateResponse(res, null, 400, error.message);
  }
};

module.exports = {
  get,
  getByID,
  deleteByID,
  addItem,
  patchItem,
  getByUserID
};
