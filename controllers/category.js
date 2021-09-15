const Category = require("../modals/category");


exports.getCategoryById = async (req, res, next, id) => {

    console.log('GetCateParam');
    try{
        var cate = await Category.findById(id);
        req.category = cate;
        req.category.createdAt = undefined;
        req.category.updatedAt = undefined;
        req.category.__v = undefined;
        next();
    }
    catch(e){
        return res.status(400).json({
            error:"Category not found in DB"
        });
    }

}


exports.createCategory = async (req, res) => {

    console.log('CreateCate');
    const category = Category(req.body);
    try {
        await category.save();
        return res.json({ category });
    }
    catch(e) {
        console.log(e);
        return res.status(400).json({
            error:"Not able to save Category in DB !"
        });
    }

}


exports.getCategory = (req, res ) => {
    console.log('GetCate');
    return res.json(req.category);
}


exports.getAllCategory = async (req, res) => {

    console.log('GetAllCate');
    try{
        const categories = await Category.find({},{"_id":1,"name":1});
        return res.json(categories);
    }
    catch(e){

        return res.status.json({
            error:"Categories Not Found !"
        });
    }
}


exports.updateCategory = (req, res) => {

    console.log('UpdateCate');
    const category = req.category;
    category.name = req.body.name;

    category.save((err,updatedCategory) => {
        if(err) return res.status.json({
            error:"Failed to update category !"
        });
        return res.json(updatedCategory);
    });

} 


exports.removeCategory = async (req,res) => {

    console.log('RemoveCate');

    const category = req.category;
    try{
        await category.remove();
        return res.json({
            message:"Successfully deleted !"
        });
    }
    catch(e){
        res.status(400).json({
            error:"Failed to delete category !"
        });
    }
    
}