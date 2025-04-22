const express = require('express');
const auth = require('../middleware/auth');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.post('/create',  orderController.createOrder);  //remove auth for testing purprses
router.get('/user/:userId', orderController.getOrdersByUser);
router.get('/:orderId',  orderController.getOrderById);
router.put('/update/:orderId',  orderController.updateOrderStatus);
router.delete('/delete/:orderId', orderController.deleteOrder);

module.exports = router;

