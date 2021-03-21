const mongoose = require('mongoose');
mongoose.set('bufferCommands', false);
mongoose.set('autoCreate', false);

mongoose.connect(process.env.MONGO_DB || 'mongodb://localhost:/e-commerce-DB',
                {
                    useNewUrlParser: true, 
                    useUnifiedTopology: true , 
                    useFindAndModify:false,
                    useCreateIndex: true
                });


const db = mongoose.connection;


db.on('error', console.error.bind(console, 'Database connection error:'));
db.once('open', ()=> {
console.log("Database connected!")

});