const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');

app.use(bodyParser.json());

// connect to database 
mongoose.connect('mongodb://localhost:27017/order', {
    useNewUrlParser : true,
    useUnifiedTopology : true
}, (err) => {
    if (err) {
        throw err;
    }else {
        console.log('connected to database - order running');
    }
});

// require model
require('./Order');
var Order = mongoose.model('Order');

app.get('/', (req, res) => {
    res.json('our orders page!'); 	
});

/*------------create our fonctionnality------------------- */

app.post('/order', (req, res) => {
    var newOrder = {
        CustomerID :mongoose.Types.ObjectId(req.body.CustomerID),
        BookID : mongoose.Types.ObjectId(req.body.BookID), 
        initialDate : req.body.initialDate,
        deliveryDate : req.body.deliveryDate
    };
    
    var order = new Order(newOrder)

    order.save().then(() => {
        res.json('order created with success!')
    }).catch((err) => {
        if (err) {
            throw err;
        }
    })
});
// get all orders 
app.get('/orders', (req, res) => {
    Order.find().then((orders) => {
        res.send(orders);
    }).catch((err) => {
        if (err) {
            throw err;
        }
    }) 	
});
// delete order by id 
app.delete('/order/:id', (req, res) => {
    Order.findByIdAndDelete(req.params.id).then(() => {
        res.json('order deleted with success');
    }).catch((err) => {
        if (err) {
            throw err;
        }
    }) 	
});

// delete all orders 
app.delete('/orders', (req, res) => {
    Order.deleteMany({}).then(() => {
        res.json('all orders deleted with success!');
    }).catch((err) => {
        console.log(err);
    }) 	
});

// update order by id 

app.put('/order/:id', (req, res) => {
    Order.findByIdAndUpdate({_id : req.params.id}, req.body,(err) => {
        if (err) {
            console.log(err);
        }else{
            res.json('order updated with success!');
        }
    }) 	
});

// how get customer details for exemple 
// just used axios -------- npm install --save axios to  make http requests from the browser and nodejs 

app.get('/order/:id', (req, res) => {
    Order.findById(req.params.id).then((order) => {
        if(order) {
            axios.get('http://localhost:5000/customer/' + order.CustomerID).then((result) => {
                var orderObject = {customerName : result.data.name, bookTitle : ''};
                axios.get('http://localhost:4000/book/' + order.BookID).then((response) => {
                    orderObject.bookTitle = response.data.title;
                    res.json(orderObject);
                })
                // res.json('ok');
            }) 
        }else {
            res.send('invalid order!');
        }
    }) 	
});

app.listen(7777, () => {
    console.log('orders running in port 7777');
})