const mongoose = require('mongoose');

mongoose.model('Book', {
    // title, auther, numberPages, publisher

    title : {
        type : String,
        require : true
    },
    auther : {
        type : String,
        require : true
    },

    numberPages : {
        type : String,
        require : false
    },
    publisher : {
        type : String,
        require : false
    }
});