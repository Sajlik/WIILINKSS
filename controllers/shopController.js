
const Product = require("../models/product");
const Category = require("../models/categoryModel");
const getProductDetailsPage = async (req, res) => {
    try {
        const user = req.session.user
        console.log("working");
        const id = req.query.id
        console.log(id);
        const findProduct = await Product.findOne({ id: id });
        console.log(findProduct.id, "Hello world");
        if (user) {
            res.render("productDetail", { data: findProduct, user: user })
        } else {
            res.render("productDetail", { data: findProduct })
        }
    } catch (error) {
        console.log(error.message);
    }
}


const getShopPage = async (req, res) => {
    try {
        const user = req.session.id
       let products = await Product.find({ isBlocked: false })
        //  const count = await Product.find({ isBlocked: false }).count()
  
        const categories = await Category.find({ isListed: true })
        console.log(categories);
        const unlistedCategoryIds = categories.filter(category => category.isListed===true).map(category => category.name);
        console.log(unlistedCategoryIds);
        let productArray=[]
        products.forEach(product=>{
            for(let i=0;i<unlistedCategoryIds.length;i++){
                console.log(unlistedCategoryIds[i]);
                console.log(product.category);
                if(product.category===unlistedCategoryIds[i]){
                    productArray.push(product)
                }
                
            }
        })
  console.log(productArray);
products = products.filter(product =>unlistedCategoryIds.includes(product.category));
// console.log(products);
const count = products.length;
        let itemsPerPage = 6
        let currentPage = parseInt(req.query.page) || 1
        let startIndex = (currentPage - 1) * itemsPerPage
        let endIndex = startIndex + itemsPerPage
        let totalPages = Math.ceil(products.length/6)
        const currentProduct = products.slice(startIndex, endIndex)

        res.render("shop",
            {
                user: user,
                product: currentProduct,
                category: categories,
                
                count: count,
                totalPages,
                currentPage,
            })
    } catch (error) {
        console.log(error.message);
    }
}


const searchProducts = async (req, res)=>{
    try {   
        const user = req.session.user
        let search = req.query.search
       
        const categories = await Category.find({ isListed: true })

        const searchResult = await Product.find({
            $or : [
                {
                    productName : { $regex: ".*" + search + ".*", $options: "i" },
                }
            ],
            isBlocked : false,
        }).lean()

        let itemsPerPage = 6
        let currentPage = parseInt(req.query.page) || 1
        let startIndex = (currentPage - 1) * itemsPerPage
        let endIndex = startIndex + itemsPerPage
        let totalPages = Math.ceil(searchResult.length/6)
        const currentProduct = searchResult.slice(startIndex, endIndex)


        res.render("shop",
            {
                user: user,
                product: currentProduct,
                category: categories,
                
                totalPages,
                currentPage
            })

    } catch (error) {
        console.log(error.message);
    }
}



const filterProduct = async (req, res) => {
    try {
        const user = req.session.user;
        const category = req.query.category;
        const sortOption = req.query.sort || 'featured';
       
        const findCategory = category ? await Category.findOne({ _id: category }) : null;
      
        const query = {
            isBlocked: false,
        };

        if (findCategory) {
            query.category = findCategory.name;
        }

       

        const findProducts = await Product.find(query);
        const categories = await Category.find({ isListed: true });

        let itemsPerPage = 6;
        let currentPage = parseInt(req.query.page) || 1;
        let startIndex = (currentPage - 1) * itemsPerPage;
        let endIndex = startIndex + itemsPerPage;
        let totalPages = Math.ceil(findProducts.length / 6);
        const currentProduct = findProducts.slice(startIndex, endIndex);

        // let sortCriteria = {};
        // if (sortOption === 'lowToHigh') {
        //   sortCriteria = {
        //     afterDiscount: 1
        //   };
        // } else if (sortOption === 'highToLow') {
        //   sortCriteria = {
        //     afterDiscount: -1
        //   };
        // } else if (sortOption === 'releaseDate') {
        //   sortCriteria = {
        //     createdAt: -1
        //   }; // or any other field for release date
        // } else if (sortOption === 'avgRating') {
        //   sortCriteria = {
        //     rating: -1
        //   }; // or any other field for average rating
        // } else {
        //   // Default to 'featured' or any other default sorting option
        //   sortCriteria = {
        //     createdAt: -1
        //   }; // Default sorting
        // }
    
        res.render("shop", {
            user: user,
            product: currentProduct,
            category: categories,
            // sortOption,
            totalPages,
            currentPage,
            selectedCategory: category || null,
            
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
};

const filterByPrice = async (req, res) => {
    try {
        const user = req.session.user
       
        const categories = await Category.find({ isListed: true });
        console.log(req.query);
        const findProducts = await Product.find({
            $and: [
                { salePrice: { $gt: req.query.gt } },
                { salePrice: { $lt: req.query.lt } },
                { isBlocked: false }
            ]
        })

        let itemsPerPage = 6;
        let currentPage = parseInt(req.query.page) || 1;
        let startIndex = (currentPage - 1) * itemsPerPage;
        let endIndex = startIndex + itemsPerPage;
        let totalPages = Math.ceil(findProducts.length / 6);
        const currentProduct = findProducts.slice(startIndex, endIndex);


        res.render("shop", {
            user: user,
            product: currentProduct,
            category: categories,
           
            totalPages,
            currentPage,
        });


    } catch (error) {
        console.log(error.message);
    }
}





const getSortProducts = async (req, res) => {
    try {
        let option = req.body.option;
        let itemsPerPage = 6;
        let currentPage = parseInt(req.body.page) || 1;
        let startIndex = (currentPage - 1) * itemsPerPage;
        let endIndex = startIndex + itemsPerPage;
        let data;

        if (option == "highToLow") {
            data = await Product.find({ isBlocked: false }).sort({ salePrice: -1 });
        } else if (option == "lowToHigh") {
            data = await Product.find({ isBlocked: false }).sort({ salePrice: 1 });
        } else if (option == "releaseDate") {
            data = await Product.find({ isBlocked: false }).sort({ createdOn: 1 });
        }

        res.json({
            status: true,
            data: {
                currentProduct: data,
                count: data.length,
                totalPages: Math.ceil(data.length / itemsPerPage),
                currentPage
            }
        });

    } catch (error) {
        console.log(error.message);
        res.json({ status: false, error: error.message });
    }
};


module.exports = {
   
    getProductDetailsPage,
    getShopPage,
  
    searchProducts,
    filterProduct,
    filterByPrice,
    
    getSortProducts
  
}
