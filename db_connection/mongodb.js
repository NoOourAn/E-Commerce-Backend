const mongoose = require('mongoose');

//DB Connection
getConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB || 'mongodb://localhost:/e-commerce-DB',
        {
            useNewUrlParser: true, 
            useUnifiedTopology: true , 
            useFindAndModify:false,
            useCreateIndex: true,
            bufferCommands: false
        });
        console.log('Database connected Successfully!');
    } catch (err) {
      console.log('Database connection Failed!');
    }
  };
  
getConnection();


///// XXXXX this way of connection cause buffering errors 
///// XXXXX the models used before the connection established !!
// mongoose.connect(process.env.MONGO_DB || 'mongodb://localhost:/e-commerce-DB',
//                 {
//                     useNewUrlParser: true, 
//                     useUnifiedTopology: true , 
//                     useFindAndModify:false,
//                     useCreateIndex: true
//                 });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'Database connection error:'));
// db.once('open', ()=> {
// console.log("Database connected!")

// });