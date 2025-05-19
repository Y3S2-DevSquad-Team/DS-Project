const Joi = require("joi");

// Validate customer location input for assignment
const assignDeliverySchema = Joi.object({
  orderId: Joi.string().required(),
  customerLocation: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }).required(),
  restaurantName: Joi.string().required(),
  items: Joi.array()
    .items(
      Joi.object({
        menuItemId: Joi.string().required(),
        itemName: Joi.string().required(),
        quantity: Joi.number().required(),
        price: Joi.number().required(),
      })
    )
    .required(),
});

// Validate delivery status update
const updateStatusSchema = Joi.object({
  status: Joi.string().valid("accepted", "picked", "delivered", "cancelled").required(),
});

// Validate driver location update
const updateLocationSchema = Joi.object({
  lat: Joi.number().required(),
  lng: Joi.number().required(),
});

module.exports = {
  assignDeliverySchema,
  updateStatusSchema,
  updateLocationSchema,
};
