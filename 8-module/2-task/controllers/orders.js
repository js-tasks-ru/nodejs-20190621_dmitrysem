const Order = require('../models/Order');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
  const user = ctx.user.id;
  const {product, phone, address} = ctx.request.body;
  const order = await Order.create({product, phone, address, user});

  ctx.body = {order: order.id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const user = ctx.user.id;
  let orders = await Order.find({user}).populate('product');
  orders = orders.map(mapOrder);

  ctx.body = {orders};
};
