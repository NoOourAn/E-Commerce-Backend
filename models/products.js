const mongoose = require('mongoose');

const ProductsSchema = new mongoose.Schema({

    //fadel el img
    
         name: {    type: String,
                        min: 1,
                        max: 100,
                        required: [true, "can't be blank"],
                    },
        img:
                {
                        data: Buffer,
                        contentType: String,
                        required: [true, "can't be blank"],
                   },

        description: {    type: String,
                        min: 1,
                        max: 500,
                    },
        category:{
            type: String,
             min: 1,
             max: 50,
             required: [true, "can't be blank"],
        },
          brand:{
            type: String,
             min: 1,
             max: 50,
             required: [true, "can't be blank"],
        },
        numberInStock:{
            type:Number,
             required: [true, "can't be blank"]
        },
        price:{
            type:Number,
            required: [true, "can't be blank"]
        },

     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        totalRating:{
            type:Number,
            min:1,
            max:5,
        },
        ratings:[  
        {
            user :{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            },
            rating:{
                type:Number,
                min:0,
                max:5,
            }
            
        }
        ],
                  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        comments:[
            
            {
            body :{
                 type: String,
                 min: 1,
                 maxlength:500,
                 required: [true, "can't be blank"]

            },
            user :{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            },
            time:{
                type:Date,
                default: Date.now()
            }
            
        }
        
        ]
}
, {timestamps: true}
)

const ProductsSchema = mongoose.model('Product', ProductsSchema);
module.exports = Product;
