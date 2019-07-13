const Product = require('../models/Product');
const {isValidObjectId} = require('../models/utils');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcategory = ctx.query.subcategory;

  if (!subcategory) return next();

  let products;
  try {
    products = await Product.find({subcategory});
  } catch (e) {
    products = [];
  }
  ctx.body = {products};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();
  ctx.body = {products};
};

module.exports.productById = async function productById(ctx, next) {
  const _id = ctx.params.id;
  if (!isValidObjectId(_id)) {
    ctx.status = 400;
    return;
  }

  const product = await Product.findOne({_id});
  if (!product) {
    ctx.status = 404;
    return;
  }
  ctx.body = {product};
};

