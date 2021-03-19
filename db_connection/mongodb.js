const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB || 'mongodb://localhost:27017/ecom-test', { useNewUrlParser: true, useUnifiedTopology: true },
// 'mongodb+srv://ahmed:791995@e-commerce.uldwf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    (err) => {
        if (err) {
            console.warn("failed to connect to MongoDB")
            console.error(err);
            process.exit(1);
        }
        console.info(`connected to DB successfully`);
    });