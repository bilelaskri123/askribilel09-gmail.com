const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

/*-------------------conncet to database--------------------------- */
mongoose.connect('mongodb://localhost:27017/customer', {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useFindAndModify : true
},(err) => {
    if (err) {
        console.log(err);
    }else {
        console.log('database connected - customers service');
    }
});

/*----------------------load our model----------------------------*/
require('./Customer');
const Customer = mongoose.model('Customer');

/*--------------create our fonctionality------------------------- */
// post one customer 
app.post('/customer', (req, res) => {
    var newCustomer = {
        name : req.body.name,
        age : req.body.age,
        email : req.body.email
    };

    var customer = new Customer(newCustomer);
    customer.save().then(() => {
        res.send('customer added with success');
    }).catch((err) => {
        if (err) {
            throw err;
        }
    })
});

// get all customers
app.get('/customers', (req, res) => {
    Customer.find().then((customers) => {
        res.send(customers);
    }).catch((err)=> {
        if(err) {
            throw err;
        }
    })
});

// get customer by id 
app.get('/customer/:id', (req, res) => {
    Customer.findById(req.params.id).then((customer) => {
        if(customer) {
            res.json(customer);
        }else{
            res.send('invalid ID');
        }
    }).catch((err) => {
        if (err) {
            throw err;
        }
    })
});

// delete customer by id 
app.delete('/customer/:id', (req, res) => {
   Customer.findByIdAndDelete(req.params.id,).then(() => {
        res.json('customer deleted with success')
   }).catch((err) => {
       if (err) {
           throw err;
       }
   })
});

// delete all customers
app.delete('/customers', (req, res) => {
    Customer.deleteMany({}).then(() => {
        res.json('all customers deleted!');
    }).catch((err) => {
        console.log(err);
    }) 	
});

app.listen(5000, () => {
    console.log(`Server started on 5000`);
});