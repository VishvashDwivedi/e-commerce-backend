const order = require("../modals/order");
const { Order, ProductCart } = require("../modals/order");


exports.getOrderById = (req, res, next, id) => {

    console.log('GetOrderParam');
    Order.findById(id)
    .populate("products.product", "name price")
    .exec((error, order) => {

        if(error) return res.status(400).json({
            err:"NO Order in DB"
        });

        req.order = order;
        next();

    })

}


exports.createOrder = async (req, res) => {

    console.log('CreateOrder');
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    try{
        const ordr = await order.save();
        return res.json(ordr);
    }
    catch(e){
        return res.status(400).json({
            err:"Failed to save your order"
        });
    }

}


exports.getAllOrders = (req,res) => {

    console.log('GetAllOrder');
    Order.find()
        .populate("user", "_id name")
        .exec((err, order) => {

            if(err) return res.status(400).json({
                error:"NO orders found in DB"
            });

            res.json(order);

        });

}


exports.getOrderStatus = (req, res) => {
    console.log('GetOrderStatus');
    res.json(Order.schema.path("status").enumValues);
}


exports.updateStatus = (req, res) => {

    console.log('UpdateOrderStatus');
    Order.update(
        { _id: req.body.orderId },
        { $set: { status: req.body.status } },
        (err, order) => {

            if(err) return res.status(400).json({
                error: "Cannot update order status"
            });

            res.json(order);
        }
    );

}

