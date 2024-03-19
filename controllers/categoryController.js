// const expressHandler=require('express-async-handler')
 const Category=require('../models/categoryModel')

const getCategoryInfo = async (req, res) => {
    try {
        const categoryData = await Category.find({})
        res.render("category", { category: categoryData })
    } catch (error) {
        console.log(error.message);
    }
}

const addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const caseInsensitiveNameRegex = new RegExp(`^${name}$`, 'i');
        const categoryExists = await Category.findOne({ name: caseInsensitiveNameRegex });

        if (description) {
            if (!categoryExists) {
                const newCategory = new Category({
                    name: name,
                    description: description,
                });
                await newCategory.save();
                console.log("New Category : ", newCategory);
                res.redirect("/admin/category");
            } else {
                console.log("Category Already exists");
                const categoryData = await Category.find({})
                res.render('category',{message:"Category Already exists", category: categoryData })

            }
        } else {
            console.log("Description required");
            // Handle the case where description is not provided
            
            // or
            // res.redirect("/admin/descriptionRequired");
        }
    } catch (error) {
        console.log(error.message);
        // Handle other errors as needed
        res.status(500).send("Internal Server Error");
    }
};




const getListCategory = async (req, res) => {
    try {
        let id = req.query.id
        console.log("working");
        await Category.updateOne({ _id: id }, { $set: { isListed: false } })
        res.redirect("/admin/category")
    } catch (error) {
        console.log(error.message);
    }
}


const getUnlistCategory = async (req, res) => {
    try {
        let id = req.query.id
        await Category.updateOne({ _id: id }, { $set: { isListed: true } })
        res.redirect("/admin/category")
    } catch (error) {
        console.log(error.message);
    }
}


const getEditCategory = async (req, res) => {
    try {
        const id = req.query.id
        const category = await Category.findOne({ _id: id })
        res.render("edit-category", { category: category })
    } catch (error) {
        console.log(error.message);
    }
}


// const editCategory = async (req, res) => {
//     try {
//         const id = req.params.id
//         const { categoryName, description } = req.body
//         const findCategory = await Category.find({ _id: id })
//         if (findCategory) {
//             await Category.updateOne(
//                 { _id: id },
//                 {
//                     name: categoryName,
//                     description: description
//                 })
//             res.redirect("/admin/category")
//         } else {
//             console.log("Category not found");
//         }

//     } catch (error) {
//         console.log(error.message);
//     }
// }


const editCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const { categoryName, description } = req.body;
        const findCategory = await Category.findById(id); // Use findById instead of find

        if (findCategory) {
            const caseInsensitiveNameRegex = new RegExp(`^${categoryName}$`, 'i');
            const categoryExists = await Category.findOne({ name: caseInsensitiveNameRegex, _id: { $ne: id } });

            if (!categoryExists) {
                await Category.updateOne(
                    { _id: id },
                    {
                        name: categoryName,
                        description: description
                    }
                );
                res.redirect("/admin/category");
            } else {
                console.log("Category Already exists");
                const categoryData = await Category.find({});
                res.render('category', { message: "Category Already exists", category: categoryData });
            }
        } else {
            console.log("Category not found");
            // Handle the case where the category does not exist
        }
    } catch (error) {
        console.log(error.message);
        // Handle other errors as needed
        res.status(500).send("Internal Server Error");
    }
};



module.exports = {
    getCategoryInfo,
    addCategory,
    getListCategory,
    getUnlistCategory,
    editCategory,
    getEditCategory
}