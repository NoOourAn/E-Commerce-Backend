const express = require('express');
const router = new express.Router();
//const upload = require('../middlewares/imgStorage')
const Product = require("../models/products");
// const uploadImgMiddleware = require('../middlewares/imgStorage')


var multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });

///api to create new product
router.post('/', upload.single('image'), async(req, res) => {
    try {
        const { name, description, category, brand, numberInStock, price } = req.body
        const img = {
            // data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            // contentType: 'image/png'
        }
        if (name && img && category && brand && numberInStock && price) {
            let product;

            if (description && description !== 'null')
                product = await Product.create({ name, img, description, category, brand, numberInStock, price, totalRating: 1 })
            else
                product = await Product.create({ name, img, category, brand, numberInStock, price, totalRating: 1 })

            const obj = {
                success: true,
                message: "product was created succesfully",
                product: product
            }
            res.send(obj)
        } else throw new Error("name, image ,category ,brand,numberInStock and price are required")
    } catch (err) {
        res.json({ success: false, message: err.message })
    }
})

///MANIPULATE product comments with ID
router.route('/:id')
    .delete(async(req, res) => { ///delete product
        try {
            const { id } = req.params;
            const product = await Product.findByIdAndDelete(id)
            const obj = {
                success: true,
                message: (product) ? "product deleted successfully" : "product not found"
            }
            res.send(obj)
        } catch (err) {
            res.json({ success: false, message: err.message })
        }
    })
    .patch(upload.single('image'), async(req, res) => { ///edit product
        try {
            const { id } = req.params;
            const { name, description, category, brand, numberInStock, price } = req.body
            const img = {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                contentType: 'image/png'
            }
            const product = await Product.findByIdAndUpdate(id, { name, description, category, brand, numberInStock, price }, { returnOriginal: false })
            const obj = {
                success: true,
                message: (product) ? "product edited successfully" : "product not found",
                todo: todo
            }
            res.send(obj);
        } catch (err) {
            res.json({ success: false, message: err.message })
        }
    })


///MANIPULATE product rating
router.route('/:id')
    .patch(async(req, res) => { ///delete rating
        try {
            const { id } = req.params;
            const ratingValue = req.query
            const userId = req.signedData;
            const product = await Product.findById(id)
            const total = product.totalRating
            product.ratings.forEach(element => {
                if (element.user == userId) {
                    product.totalRating = (total * 2) - element.rating; ///delete old rating from total rating
                    element.rating = ratingValue;
                    product.totalRating = (total + ratingValue) / 2; ///update total rating with new rating
                    //break;
                }
            });
            await product.save();
            const obj = {
                success: true,
                message: (product) ? "product rating deleted successfully" : "rating not found"
            }
            res.send(obj)
        } catch (err) {
            res.json({ success: false, message: err.message })
        }
    })


///add comment
router.post('/:id/comments', async(req, res) => {
    try {
        const { id } = req.params; ///product id
        const { body } = req.body
        const userId = req.signedData;
        if (body) {
            const comment = {
                body,
                user: userId
            };
            let product = await Product.findById(id)
            product.comments.push(comment);
            product.save();
            const obj = {
                success: true,
                message: "comment was added succesfully",
                product: product
            }
            res.send(obj)
        } else throw new Error("comment body is required")
    } catch (err) {
        res.json({ success: false, message: err.message })
    }
})

///delete comment
router.delete('/:productId/comments/:commentId', async(req, res) => {
    try {
        const { productId, commentId } = req.params;
        const product = await Product.findByIdAndDelete(productId, { $pull: { comments: { $elemMatch: { _id: commentId } } } }, { returnOriginal: false })

        const obj = {
            success: true,
            message: (product) ? "product deleted successfully" : "product not found"
        }
        res.send(obj)
    } catch (err) {
        res.json({ success: false, message: err.message })
    }
})

// name cat maxprice minprice id brand all date





router.get('/', async(req, res) => {
    try {
       // const userById = await User.findById(req.signedData.id);
        const { name, category, brand, maxPrice, minPrice, id, latestdate, oldestdate } = req.query;
        if (name) {
            products = await Product.find({ name: name });
        } else if (category) {
            products = await Product.find({ category: category });
        } else if (brand) {
            console.log(req.params)
            products = await Product.find({ brand: brand });
        } else if (maxPrice) {
            products = await Product.find().sort({ price: -1 });
        } else if (minPrice) {
            products = await Product.find().sort({ price: 1 });
        } else if (latestdate) {
            products = await Product.find().sort({ createdAt: 'desc' }).exec();
        } else if (oldestdate) {
            products = await Product.find().sort({ createdAt: 'asc' }).exec();;
        } else if (id) {
            products = await Product.find({ _id: id });
        } else {
            products = await Product.find({});
        }

        res.statusCode = 201;
        res.send(products)
    } catch (err) {
        console.error(err);
        res.statusCode = 422;
        res.json({ success: false, message: err.message });
    }
})



router.get('/getCategory', async(req, res) => {
    try {
       // const { category } = req.query;
        products = await Product.find({});
        const CategoryArr = []
        for (let c in products) {
            if (!CategoryArr.includes(c.category)) {
                CategoryArr.push(c.category);
            }
        }
        res.statusCode = 201;
        res.send(CategoryArr)
    } catch (err) {
        console.error(err);
        res.statusCode = 422;
        res.json({ success: false, message: err.message });
    }
})

router.get('/getBrand', async(req, res) => {
    try {
     //   const { brand } = req.query;
        products = await Product.find({});
        const brandArr = []
        for (let c in products) {
            if (!brandArr.includes(c.brand)) {
                brandArr.push(c.brand);
            }
        }
        res.statusCode = 201;
        res.send(brandArr)
    } catch (err) {
        console.error(err);
        res.statusCode = 422;
        res.json({ success: false, message: err.message });
    }
})






module.exports = router;