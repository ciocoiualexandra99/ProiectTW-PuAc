const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentDoc = new Schema({
  name: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
});
const optionDoc = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  comments: {
    type: [commentDoc],
    default: [],
  },
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
});

const itemSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  privacy:{
    type:String,
    default:'public',
  },
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'In Progress',
  },
  budget: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  options: [optionDoc],
  comments: {
    type: [commentDoc],
    default: [],
  },
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
});

module.exports = Item = mongoose.model('items', itemSchema);
