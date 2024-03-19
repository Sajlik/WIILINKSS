const express = require('express')
const admin_router = express.Router()

const admincontroller=require('../controllers/adminController')
const categoryController=require('../controllers/categoryController')
const productController = require("../controllers/productController")
const customerController = require('../controllers/customerController')
const orderController = require('../controllers/orderController')

const { isAdmin } = require("../middileware/auth")

const multer = require("multer")
const storage = require("../helpers/multer")
const upload = multer({ storage: storage })
admin_router.use("/public/uploads", express.static("/public/uploads"))



admin_router.get("/login", admincontroller.getLoginPage)
admin_router.post("/login", admincontroller.verifyLogin)
admin_router.get("/logout", isAdmin, admincontroller.getLogout)
admin_router.get("/", isAdmin, admincontroller.loadDashboard)

//  admin_router.get('/show-graph/:timetype', admincontroller.showGraph)
admin_router.get('/getgraphweek',admincontroller.getWeekGraph)
admin_router.get('/getgraphmonth',admincontroller.getMonthGraph)
admin_router.get('/getgraphyear',admincontroller.getYearGraph)


 admin_router.get("/category", isAdmin, categoryController.getCategoryInfo)
 admin_router.post("/addCategory", isAdmin, categoryController.addCategory)
 admin_router.get("/listCoupon", isAdmin, admincontroller.getListCoupon)
 admin_router.get("/unListCoupon", isAdmin, admincontroller.getUnlistCoupon)
 admin_router.get("/editCoupon", isAdmin, admincontroller.getEditCoupon)
 admin_router.post("/editCoupon/:id", isAdmin, admincontroller.editCoupon)

admin_router.get("/addProducts", isAdmin, productController.getProductAddPage)
admin_router.post("/addProducts", isAdmin, upload.array("images", 5), productController.addProducts)
admin_router.get("/products", isAdmin, productController.getAllProducts)
admin_router.get("/editProduct", isAdmin, productController.getEditProduct)
admin_router.post("/editProduct/:id", isAdmin, upload.array("images", 5), productController.editProduct)
admin_router.post("/deleteImage", isAdmin, productController.deleteSingleImage)
admin_router.get("/blockProduct", isAdmin, productController.getBlockProduct)
admin_router.get("/unBlockProduct", isAdmin, productController.getUnblockProduct)

admin_router.get("/coupon", isAdmin, admincontroller.getCouponPageAdmin)
admin_router.post("/createCoupon", isAdmin, admincontroller.createCoupon)
admin_router.get("/users", isAdmin, customerController.getCustomersInfo)
admin_router.get("/blockCustomer", isAdmin, customerController.getCustomerBlocked)
admin_router.get("/unblockCustomer", isAdmin, customerController.getCustomerUnblocked)


admin_router.get("/orderList", isAdmin, orderController.getOrderListPageAdmin)
admin_router.get("/orderDetailsAdmin", isAdmin, orderController.getOrderDetailsPageAdmin)
admin_router.get("/changeStatus", isAdmin,orderController.changeOrderStatus)

 admin_router.get("/sales-report", admincontroller.salesReportpage);
 admin_router.get("/sales-data/yearly", admincontroller.getSalesDataYearly);
 admin_router.get("/get/sales-report", admincontroller.generateSalesReport);
 admin_router.get("/sales-data", admincontroller.getSalesData);
 admin_router.get("/sales-data/weekly", admincontroller.getSalesDataWeekly);
 admin_router.get('/dashboard',admincontroller.mostPurchasedProducts);
 admin_router.get('/dashboard',admincontroller.mostPurchasedCategory);
// admin_router.get("/coupon", couponController.couponspage);
// admin_router.get("/coupon/add", couponController.addCoupon);
// admin_router.get("/coupon/edit/:id", couponController.editCouponPage);
// admin_router.post("/coupon/add", couponController.createCoupon);
// admin_router.post("/coupon/edit/:id", couponController.updateCoupon);


module.exports = admin_router