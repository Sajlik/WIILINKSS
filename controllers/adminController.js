const User = require("../models/userModels");
const Coupon = require("../models/couponModel")
const Order=require("../models/orderSchema")
const expressHandler = require('express-async-handler')
const bcrypt = require("bcrypt")
const Product = require("../models/product");
const  numeral = require("numeral");
const moment = require("moment")
const filter = require('../helpers/cronFilter.js')
const helpers = require('../helpers/adminHelpers')



const getLoginPage = async (req, res) => {
    try {
        res.render("admin-login")
    } catch (error) {
        console.log(error.message);
    }
}


const verifyLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(email)

        const findAdmin = await User.findOne({ email, isAdmin: "1" })
        // console.log("admin data : ", findAdmin);

        if (findAdmin) {
            const passwordMatch = await bcrypt.compare(password, findAdmin.password)
            if (passwordMatch) {
                req.session.admin = true
                console.log("Admin Logged In");
                res.redirect("/admin")
            } else {
                console.log("Password is not correct");
                res.redirect("/admin/login")
            }
        } else {
            console.log("Not an admin");
        }
    } catch (error) {
        console.log(error.message);
    }
}
const getLogout = async (req, res) => {
    try {
        req.session.admin = null
        res.redirect("/admin/login")
    } catch (error) {
        console.log(error.message);
    }
}

const getCouponPageAdmin = async (req, res) => {
    try {
        const findCoupons = await Coupon.find({})
        res.render("coupon", {coupons : findCoupons})
    } catch (error) {
        console.log(error.message);
    }
}
const createCoupon = async (req, res) => {
    try {

        const data = {
            couponName: req.body.couponName,
            startDate: new Date(req.body.startDate + 'T00:00:00'),
            endDate: new Date(req.body.endDate + 'T00:00:00'),
            offerPrice: parseInt(req.body.offerPrice),
            minimumPrice: parseInt(req.body.minimumPrice)
        };

        const newCoupon = new Coupon({
            name : data.couponName,
            createdOn : data.startDate,
            expireOn : data.endDate,
            offerPrice : data.offerPrice,
            minimumPrice : data.minimumPrice
        })

        await newCoupon.save()
        .then(data=>console.log(data))

        res.redirect("/admin/coupon")
        
console.log(data);
        
    } catch (error) {
        console.log(error.message);
    }
}
const getEditCoupon = async (req, res) => {
    try {
        const id = req.query.id
        const coupon = await Coupon.findOne({ _id: id })
        res.render("editCoupon", { coupon: coupon })
    } catch (error) {
        console.log(error.message);
    }
}
async function editCoupon(req, res) {
    try {
        const couponId = req.params.id;
        const couponName = req.body.couponName;
        const createdOn = req.body.createdOn;
        const expireOn = req.body.expireOn;
        const offerPrice = req.body.offerPrice;
        const minimumPrice = req.body.minimumPrice;

        console.log(req.body);

        const updated = await Coupon.findByIdAndUpdate(couponId, {
            $set: {
                name: couponName,
                createdOn: createdOn,
                expireOn: expireOn,
                offerPrice: offerPrice,
                minimumPrice: minimumPrice
            }
        });

        if (updated) {
            // Check if the updated document exists in the database
            const updatedCoupon = await Coupon.findById(couponId);
            if (updatedCoupon) {
                console.log("Updated Coupon:", updatedCoupon);
                return res.json({ success: true, message: 'Coupon updated successfully.' });
            } else {
                console.log("Coupon not found in the database after update.");
                return res.json({ success: false, message: 'Coupon not found in the database after update.' });
            }
        } else {
            console.log("Coupon not found with ID:", couponId);
            return res.json({ success: false, message: 'Coupon not found.' });
        }
    } catch (error) {
        console.log("Error updating coupon:", error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const getListCoupon = async (req, res) => {
    try {
        let id = req.query.id
        console.log("working");
        await Coupon.updateOne({ _id: id }, { $set: { isList: false } })
        res.redirect("coupon")
    } catch (error) {
        console.log(error.message);
    }
}


const getUnlistCoupon = async (req, res) => {
    try {
        let id = req.query.id
        await Coupon.updateOne({ _id: id }, { $set: { isList: true } })
        res.redirect("coupon")
    } catch (error) {
        console.log(error.message);
    }
}
const loadDashboard = expressHandler(async (req, res) => {
    try {
        const messages = req.flash();
        const user = req?.user;
        const recentOrders = await Order.find()
            .limit(3)
           
            .select("totalAmount orderedDate totalPrice")
            .sort({ _id: -1 });

        let totalSalesAmount = 0;
        recentOrders.forEach((order) => {
            totalSalesAmount += order.totalPrice;
        });

        totalSalesAmount = numeral(totalSalesAmount).format("0.0a");

        const totalSoldProducts = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    total_sold_count: {
                        $sum: "$sold",
                    },
                },
            },
        ]);

        const totalOrderCount = await Order.countDocuments();
        const totalActiveUserCount = await User.countDocuments({ isBlock: false });
        const allOrders = await helpers.getAllOrders();
        const todoMessage = await helpers.getTodoList();
        const topProducts = await mostPurchasedProducts();
        console.log(topProducts);
        const topCategories=await mostPurchasedCategory();
        console.log(topCategories);
        const timeWiseOrders = await helpers.timeWiseOrders()

        const newarr = helpers.newArray(timeWiseOrders);
       
        const day = helpers.getDayRatio(newarr);
        res.render("dashboard", {
            title: "Dashboard",
            user,
            messages,
            recentOrders,
            totalOrderCount,
            totalActiveUserCount,
            totalSalesAmount,
            moment,
            topProducts,
            topCategories,
             totalSoldProducts: totalSoldProducts[0].total_sold_count,
            allOrders,
            todoMessage,
          
            newarr,
            graph: { day },
        });
    } catch (error) {
        throw new Error(error);
    }
});


 const salesReportpage = expressHandler(async (req, res) => {
     try {
         res.render("sales-report", { title: "Sales Report" });
     } catch (error) {
         throw new Error(error);
     }
 });

const generateSalesReport = async (req, res, next) => {
    try {
        const fromDate = new Date(req.query.fromDate);
        const toDate = new Date(req.query.toDate);
        const paymentMethod = req.query.paymentMethod;
        console.log(fromDate)
        console.log(toDate)
        
        let paymentMethodFilter;
        if (paymentMethod !== 'all') {
            paymentMethodFilter = { payment_method: paymentMethod };
        } else {
            paymentMethodFilter = {}; // No specific payment method selected, include all
        }

        const salesData = await Order.find({
            createdOn: {
                $gte: fromDate,
                $lte: toDate,
            },
            
        }).select(" totalPrice createdOn payment _id");
        console.log(salesData)
        res.status(200).json(salesData);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

async function getWeekGraph(req,res){
    try {
        const weekLimits = filter.weekly()
        // console.log(weekLimits)
        // console.log("entered")
        const firstWeekDet = await Order.aggregate([{$match:{createdOn:{$gte:weekLimits.firstWeek,$lt:weekLimits.secondWeek}}},{$project:{_id:0,totalPrice:1}},{$group:{_id:null,totalPrice:{$sum:'$totalPrice'}}},{$project:{_id:0,totalPrice:1}} ])
        const secondWeekDet = await Order.aggregate([{$match:{createdOn:{$gte:weekLimits.secondWeek,$lt:weekLimits.thirdWeek}}},{$project:{_id:0,totalPrice:1}},{$group:{_id:null,totalPrice:{$sum:'$totalPrice'}}},{$project:{_id:0,totalPrice:1}} ])
        const thirdWeekDet = await Order.aggregate([{$match:{createdOn:{$gte:weekLimits.thirdWeek,$lt:weekLimits.fourthWeek}}},{$project:{_id:0,totalPrice:1}},{$group:{_id:null,totalPrice:{$sum:'$totalPrice'}}},{$project:{_id:0,totalPrice:1}} ])
        const fourthWeekDet = await Order.aggregate([{$match:{createdOn:{$gte:weekLimits.fourthWeek,$lt:weekLimits.fifthWeek}}},{$project:{_id:0,totalPrice:1}},{$group:{_id:null,totalPrice:{$sum:'$totalPrice'}}},{$project:{_id:0,totalPrice:1}} ])




        let first = 0,second = 0,third = 0 ,fourth = 0
        if(firstWeekDet[0]!== undefined)
        {
            first = firstWeekDet[0].totalPrice
        }
        if(secondWeekDet[0]!== undefined)
        {
            second = secondWeekDet[0].totalPrice
        } if(thirdWeekDet[0]!== undefined)
        {
            third = thirdWeekDet[0].totalPrice
        } if(fourthWeekDet[0]!== undefined)
        {
            fourth = fourthWeekDet[0].totalPrice
        }
        const weekDataToChart = [first,second,third,fourth]
         console.log(weekDataToChart)
        if(weekDataToChart)
        {
            res.json({weekData:weekDataToChart})
        }
        else{
            res.json({err:"Error in weekdata"})
        }
    } catch (error) {
        console.log(error.message)
    }

}

async function getMonthGraph(req,res){
    try {
        const monthdata = filter.monthly()


        let monthdetails = []

        for(let i = 0; i< monthdata.length;i++)
        {
            const currentData = await Order.aggregate([{$match:{createdOn:{$gte:monthdata[i].monthStart,$lt:monthdata[i].monthEnd}}},{$project:{_id:0,totalPrice:1}},{$group:{_id:null,totalPrice:{$sum:'$totalPrice'}}},{$project:{_id:0,totalPrice:1}}])

            monthdetails.push({
                month:monthdata[i].monthName,
                amount:currentData[0]?currentData[0].totalPrice : 0
            })
        }
        // console.log(monthdetails)
        if(monthdetails.length > 0 )
        {
            res.json({monthdata:monthdetails})
        }
        else{
            res.json({montherror:"Cannot fetch MonthData"})
        }
    } catch (error) {
        console.log(error.message)
    }
}

async function getYearGraph(req,res){
    try {
        const yearLimits = filter.yearly()
        // console.log(yearLimits)

        let yeardata = []

        for(let i = 0;i < yearLimits.length;i++)
        {
            const yeardatas = await Order.aggregate([{$match:{createdOn:{$gte:yearLimits[i].yearStart,$lt:yearLimits[i].yearEnd}}},{$project:{_id:0,totalPrice:1}},{$group:{_id:null,totalPrice:{$sum:'$totalPrice'}}},{$project:{_id:0,totalPrice:1}}])
            
            yeardata.push({
                year:2023 + i,
                amount:yeardatas[0] ? yeardatas[0].totalPrice : 0
            })
        }
        
        if(yeardata.length > 0)
        {
            res.json({yeardata:yeardata})
        }
        else{
            res.json({yearerr:"Cannot fetch year data"})
        }
    } catch (error) {
        console.log(error)
    }
}

async function showGraph(req, res) {
    try {
        const timetype = req.params.timetype;
        const timeWiseOrders = await helpers.timeWiseOrders()
        const newarr = helpers.newArray(timeWiseOrders);
        if (timetype === 'year') {
            const yearRatio = helpers.getYearRatio(newarr);
            return res.json({ success: true, ratio: { time: timetype, value: yearRatio } })
        }
        if (timetype === 'month') {
            const monthRatio = helpers.getMonthRatio(newarr);
            return res.json({ success: true, ratio: { time: timetype, value: monthRatio } })
        }
        if (timetype === 'week') {
            const weekRatio = helpers.getWeekRatio(newarr);
            return res.json({ success: true, ratio: { time: timetype, value: weekRatio } })
        }
        if (timetype === 'day') {
            const dayRatio = helpers.getDayRatio(newarr);
            return res.json({ success: true, ratio: { time: timetype, value: dayRatio } })
        }
        return res.json({ success: false, message: 'Somthing Trouble detected.' })
    } catch (error) {
        console.log(error)
    }
}


const getSalesData = async (req, res) => {
    try {
        const pipeline = [
            {
                $project: {
                    year: { $year: "$orderedDate" },
                    month: { $month: "$orderedDate" },
                    totalPrice: 1,
                },
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month" },
                    totalSales: { $sum: "$totalPrice" },
                },
            },
            {
                $project: {
                    _id: 0,
                    month: {
                        $concat: [
                            { $toString: "$_id.year" },
                            "-",
                            {
                                $cond: {
                                    if: { $lt: ["$_id.month", 10] },
                                    then: { $concat: ["0", { $toString: "$_id.month" }] },
                                    else: { $toString: "$_id.month" },
                                },
                            },
                        ],
                    },
                    sales: "$totalSales",
                },
            },
        ];

        const monthlySalesArray = await Order.aggregate(pipeline);
       

        res.json(monthlySalesArray);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


/**
 * Get Sales Data yearly
 * Method GET
 */
const getSalesDataYearly = async (req, res) => {
    try {
        const yearlyPipeline = [
            {
              $project: {
                year: { $year: "$orderedDate" },
                totalPrice: 1,
              },
            },
            {
              $group: {
                _id: { year: "$year" },
                totalSales: { $sum: "$totalPrice" },
              },
            },
            {
              $project: {
                _id: 0,
                year: { $toString: "$_id.year" },
                sales: "$totalSales",
              },
            },
          ];
          

        const yearlySalesArray = await Order.aggregate(yearlyPipeline);
        console.log(yearlySalesArray)
        res.json(yearlySalesArray);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * get sales data weekly
 * method get
 */
const getSalesDataWeekly =async (req, res) => {
    try {
        const weeklySalesPipeline = [
            {
              $project: {
                week: { $week: "$orderedDate" },
                totalPrice: 1,
              },
            },
            {
                $group: {
                    _id: { week: { $mod: ["$week", 7] } },
                    totalSales: { $sum: "$totalPrice" },
                  },
            },
            {
              $project: {
                _id: 0,
                week: { $toString: "$_id.week" },
                dayOfWeek: { $add: ["$_id.week", 1] },
                sales: "$totalSales",
              },
            },
            {
                $sort: { dayOfWeek: 1 },
              },
        ];
          

        const weeklySalesArray = await Order.aggregate(weeklySalesPipeline);
        console.log(weeklySalesArray);

        res.json(weeklySalesArray);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


async function mostPurchasedProducts() {
    try {
        const product = await Order.aggregate([
           
            { $unwind: "$product" },
            {
                $group: {
                    _id: "$product._id",
                    totalQuantity: { $sum: "$product.quantity" },
                    totalProductPrice: { $sum: "$product.price" },
                    productPrice: { $first: "$product.price" },
                    productName: { $first: "$product.name" },
                    
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 }
        ])
        return product;
    } catch (error) {
        console.log(error)
    }
}
// async function mostPurchasedCategory() {
//     try {
//         const categories = await Order.aggregate([
//             { $unwind: "$product" },
//             {
//                 $group: {
//                     _id: "$product.category",
//                     totalQuantity: { $sum: "$product.quantity" }
//                 }
//             },
//             { $sort: { totalQuantity: -1 } },
//             { $limit: 10 }
//         ]);

//         const categoryIds = categories.map(category => category._id);

  
//     } catch (error) {
//         console.log(error);
//         return [];
//     }
// }
// async function mostPurchasedCategory() {
//     try {
//         const category = await Order.aggregate([
//             { $unwind: "$product" },
//             {
//                 $group: {
//                     _id: "$product.category",
           
//                     totalQuantity: { $sum: "$product.quantity" },
//                     totalProductPrice: { $sum: "$product.price" }
//                 }
//             },
//             { $sort: { totalQuantity: -1 } },
//             { $limit: 1 }
//         ]);
//         return category;
//     } catch (error) {
//         console.log(error);
//     }
// }
async function mostPurchasedCategory() {
    try {
        const category = await Order.aggregate([
            { $unwind: "$product" },
            {
                $group: {
                    _id: "$product.category",
                    totalQuantity: { $sum: "$product.quantity" },
                    totalProductPrice: { $sum: "$product.price" }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 1 },
            {
                $lookup: {
                    from: 'categories', // Name of the Category collection
                    localField: '_id',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $addFields: {
                    category: { $arrayElemAt: ["$category", 0] }
                }
            }
        ]);

        return category;
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
  
    getLoginPage,
    verifyLogin,
    getLogout,
    createCoupon,
    getCouponPageAdmin,
  
    getSalesData,
    generateSalesReport,
    getSalesDataYearly,
    getSalesDataWeekly,
    loadDashboard,
    showGraph,
    salesReportpage,
    getWeekGraph,
    getMonthGraph,
    getYearGraph,
    mostPurchasedProducts,
    mostPurchasedCategory,
    getListCoupon,
    getUnlistCoupon,
    getEditCoupon,
    editCoupon

}
