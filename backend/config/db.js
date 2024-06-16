const mongoose = require('mongoose');
require('dotenv').config()
const dbConnect =async()=>{try {
    
        await mongoose.connect(process.env.dbUrl);
        console.log('connnected to db')
} catch (error) {
    console.log('errror in connencting to db')
}
}
module.exports = dbConnect