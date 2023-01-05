
const mongoose = require('mongoose');

mongoose.set('strictQuery' , false);

const connectdb = async() =>
{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI , {

        });
        console.log(`Mongodb Connected  : ${conn.connection.host}`)
    }
    catch(error)
        {
            console.log(` Error IN Connection `);
            process.exit();
        }
};

module.exports = connectdb;