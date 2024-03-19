const express = require("express");
const userRoute = express.Router() 
const userController=require('../controllers/userController')
const shopController=require('../controllers/shopController')
const cartController=require('../controllers/cartController')
const userProfileController = require("../controllers/userProfileController")
const orderController = require('../controllers/orderController')
const walletController = require('../controllers/walletController')
const { isLogged } = require("../middileware/auth.js")

userRoute.get("/pageNotFound", userController.pageNotFound)

// User actions
userRoute.get("/", userController.loadLandingPage,)
userRoute.get("/login", userController.getLoginPage)
userRoute.post("/login", userController.userLogin)
userRoute.get("/signup", userController.getSignupPage)
userRoute.post("/verify-otp", userController.verifyOtp)
userRoute.post("/resendOtp", userController.resendOtp)
userRoute.post("/signup", userController.signupUser)
userRoute.get("/logout", isLogged, userController.getLogoutUser)
userRoute.post("/applyCoupon", isLogged, userController.applyCoupon)

userRoute.get("/productDetails",shopController.getProductDetailsPage)
userRoute.get("/shop",shopController.getShopPage)
userRoute.get("/search",shopController.searchProducts)
userRoute.get("/filter",shopController.filterProduct)
userRoute.get("/filterPrice", shopController.filterByPrice)

userRoute.get("/cart", isLogged, cartController.getCartPage)
userRoute.post("/addToCart", isLogged, cartController.addToCart)
userRoute.post("/changeQuantity", isLogged, cartController.changeQuantity)
userRoute.get("/deleteItem", isLogged, cartController.deleteProduct)

userRoute.get("/profile", isLogged, userProfileController.getUserProfile)
userRoute.get("/addAddress", isLogged, userProfileController.getAddressAddPage)
userRoute.post("/addAddress", isLogged, userProfileController.postAddress)
userRoute.get("/editAddress", isLogged, userProfileController.getEditAddress),
userRoute.post("/editAddress", isLogged, userProfileController.postEditAddress)
userRoute.get("/deleteAddress", isLogged, userProfileController.getDeleteAddress)
userRoute.post("/editUserDetails", isLogged, userProfileController.editUserDetails)

userRoute.get("/forgotPassword", userProfileController.getForgotPassPage)
userRoute.post("/forgotEmailValid", userProfileController.forgotEmailValid)
userRoute.post("/verifyPassOtp", userProfileController.verifyForgotPassOtp)
userRoute.get("/resetPassword", userProfileController.getResetPassPage)
userRoute.post("/changePassword", userProfileController.postNewPassword)


userRoute.get("/checkout",isLogged, orderController.getCheckoutPage)
userRoute.post("/orderPlaced",isLogged, orderController.orderPlaced)
userRoute.get("/orderDetails", isLogged, orderController.getOrderDetailsPage)
userRoute.get("/cancelOrder", isLogged, orderController.cancelOrder)
userRoute.get("/return", isLogged, orderController.returnOrder)
userRoute.get("/checkout", isLogged, orderController.getCartCheckoutPage)
userRoute.post("/verifyPayment", isLogged, orderController.verify)
userRoute.get("/invoice", isLogged, orderController.getInvoice)
userRoute.post("/addMoney", isLogged, walletController.addMoneyToWallet)
userRoute.post("/verify-payment", isLogged, walletController.verify_payment)
module.exports=userRoute

