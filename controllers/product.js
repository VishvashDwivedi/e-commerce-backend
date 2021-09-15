const Product = require("../modals/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
// const { sortBy } = require("lodash");

exports.getProductById = (req, res, next, id) =>{

    console.log('GetProductParam');
    Product.findById(id)
    .populate("category", "_id name")
    .exec((err, product) => {
        if(err) {
            return res.status(400).json({
                error:"Product NOT Found"
            });
        }

        req.product = product;
        req.product.createdAt = undefined;
        req.product.updatedAt = undefined;
        req.product.__v = undefined;
    
        next();
    });
    
}


exports.createProduct = (req, res) => {

    console.log('CreateProduct');

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {

        if(err) return res.status(400).json({
            error : "Problem with image !"
        });

        // de-structuring the fields
        const { name, description, price, category, stock } = fields;
        if(
        !name || !description || !price || !category || !stock ){
            return res.status(400).json({
                error : "Please include all fields !"
            });
        }

        let product = new Product(fields);

        // handle file here
        if(file.photo)
        {
            if(file.photo.size > 3000000)
            {
                return res.status(400).json({
                    error : "File size too big !"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;   
        }

        // save to DB
        product.save((err, product) => {
            if(err){
                res.status(400).json({
                    error : "Saving T-shirt in DB failed !"
                });
            }

            return res.json(product);

        });
    
    });

}


exports.getProduct = (req, res) => {
    console.log('GetProduct');
    req.product.photo = undefined;
    return res.json(req.product);
}


exports.photo = (req, res, next) => {

    console.log('GetProductImage');
    if(req.product.photo.data)
    {
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}


exports.deleteProduct = (req, res) => {

    console.log('DeleteProduct');
    let product = req.product;

    product.remove((err, deletedproduct) => {
        if(err)
        {
            return res.json({
                error:"Failed to delete the product !"
            });
        }

        deletedproduct.createdAt = undefined;
        deletedproduct.updatedAt = undefined;
        deletedproduct.__v = undefined;
        res.json({ 
            "message": "Deletion was a success !",
            deletedproduct
        });

    });

} 


exports.updateProduct = (req, res) => {

    console.log('UpdateProduct');
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {

        if(err) return res.status(400).json({
            error : "Problem with image !"
        });

        let product = req.product;
        product = _.extend(product, fields);

        // handle file here
        if(file.photo)
        {
            if(file.photo.size > 3000000)
            {
                return res.status(400).json({
                    error : "File size too big !"
                });
            }

            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        } 

        product.save((err, prod) => {
            if(err){
                res.status(400).json({
                    error : "Updation failed !"
                });
            }

            prod.photo = undefined;
            prod.createdAt = undefined;
            prod.updatedAt = undefined;
            prod.__v = undefined;
            return res.json(prod);
        });
    })

}

// product listing
exports.getAllProducts = (req, res) => {

    console.log('GetAllProduct');
    console.log(req.query);
    let limit = req.query.limit ? parseInt(req.query.limit) : 20;
    let sortBy = req.query.sortBy ? req.query.sortBy : "name";

    Product.find()
        .select("-photo -updatedAt -createdAt -sold")
        .populate("category","_id name")
        .sort([[ sortBy , "asc" ]])
        .limit(limit)
        .exec((err, products) => {
            
            if(err) return res.status(400).json({
                error : "No product found !"
            });
            res.json(products);
        });

}


exports.getAllUniqueCategories = (req, res) => {

    console.log('GetAllUniqueCate');
    Product.distinct("category", {}, (err, category) => {
        if(err) return res.status(400).json({
            error:"NO category found !"
        });

        res.json(category);

    });

}


exports.updateStock = (req, res , next) => {

    console.log('UpdateStock');
    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: { _id: prod._id },
                update: { $inc: { stock:-prod.count, sold: +prod.count } }
            }
        }
    });

    Product.bulkWrite(myOperations, {} , (err, products) => {

        if(err) return res.status(400).json({
            error : "Bulk operation failed !"
        });
        next();
    });

}

