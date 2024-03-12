const mongoose = require('mongoose')
const dontenv = require('dotenv')

dontenv.config()
const url = process.env.DB_URL

const connection = async () => {
    try {
        const connected = await mongoose.connect(url, {
            dbName : 'chat'
        })
        console.log('Server is connected to the database with MongoDB.')
        
    } catch (error) {
        console.error(`Server can't connect to the database: ${err}`);
    }
}



module.exports = connection