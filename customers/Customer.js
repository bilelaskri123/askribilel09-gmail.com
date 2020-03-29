const mongoose = require('mongoose');

// this is our customer model 
mongoose.model('Customer',{
    // name, age, address 
    name : {
        type : String,
        require : true
    },
    age : {
        type : String,
        require : true  
    },
    email : {
        type : String,
        require : true
    }
})