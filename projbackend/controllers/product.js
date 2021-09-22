const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const { sortBy } = require('lodash');
const category = require('../models/category');

exports.getProductById = (req,res,next,id) => {
    Product.findById(id)
    .populate("category")
    .exec((err, product) => {
        if(err){
            return res.status(400).json({
                err: 'Product not found'
            })
        }
        req.product = product;
        next();
    })
}

exports.createProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtension = true;

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                err: 'problem with image'
            })
        }

        //destructure the field
        const {name, description, price, category, stock} = fields;

        if(!name || !price || !description || !category || !stock){
            return res.status(400).json({
                err:'Please include all fields '
            })
        }

        let product  = new Product(fields);

        if(file.photo){
            if(file.photo.size > 3000000)
            {
                return res.status(400).json({
                    err: 'File size to big'
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //save to DB
        product.save((err, product) => {
            if(err){
                res.status(400).json({
                    err: 'Saving in tshirt in DB failed'
                })
            }
            res.json(product);
        })
    })
}

exports.getProduct = (req,res) => {
    req.product.photo = undefined;
    return res.json(req.product)
}

//middleware
exports.photo = (req,res,next) => {
    if(req.product.photo.data){
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

exports.deleteProduct = (req,res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if(err){
            return res.status(400).json({
                err: 'Failed to delete the product'
            })
        }
        res.json({
            message:'Deletion was successfull',
            deletedProduct
        })
    })
}

exports.updateProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtension = true;

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                err: 'problem with image'
            })
        }

        //updation of the code
        let product  = req.product;
        product = _.extend(product, fields);

        if(file.photo){
            if(file.photo.size > 3000000)
            {
                return res.status(400).json({
                    err: 'File size to big'
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //save to DB
        product.save((err, product) => {
            if(err){
                res.status(400).json({
                    err: 'Updation in product failed'
                })
            }
            res.json(product);
        })
    })
}


//product listing
exports.getAllProducts = (req,res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8 ;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
        if(err){
            return res.status(400).json({
                err: 'No products found'
            })
        }
        res.json(products);
    })
} 

exports.updateStock = (req,res,next) => {
    let myOperations = req.body.order.map(prod => {
        return {
            updateOne:{
                filter: {_id:prod._id},
                update: {$inc: {stock: -prod.count, sold: +prod.count}}
            }
        }
    })

    Product.bulkWrite(myOperations,{}, (err, products) => {
        if(err){
            return res.status(400).json({
                err: 'Bulk operations failed'
            })
        }
        next();
    });
}

exports.getAllUniqueCategories = (req,res) => {
    Product.distinct("category", {}, (err, categories) => {
        if(err){
            return res.status(400).json({
                err: 'No categories found'
            })
        }
        res.json(categories);
    })
}