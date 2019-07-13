const mongoose = require('mongoose');
const connection = require('../libs/connection');
const {defaultSchemaOptions} = require('./utils');

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
}, defaultSchemaOptions);

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  subcategories: [subCategorySchema],
}, defaultSchemaOptions);

module.exports = connection.model('Category', categorySchema);
