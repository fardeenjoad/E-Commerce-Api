const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database Connected");
    } catch (error) {
        console.log("failed to connect database");
    }
}
module.exports = connectDB