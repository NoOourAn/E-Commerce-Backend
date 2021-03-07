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
                        contentType: String
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
            type:Number;
            required: [true, "can't be blank"]
        },

     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ratings:[
            
            {
            number:{
                type:number,
            },
            totalRatings :{
                 type: String,
                 min: 1,
                 maxlength:500
            },
             time:
             {
                 type:Date,
                default: Date.now()
                }
                 
        }
        
        ],
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        comments:[
            
            {
             body :{
                 type: String,
                 min: 1,
                 maxlength:500
            },
                 user :{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
                },
                time:
             {
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
