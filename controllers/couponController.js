const expressHandler = require('express-async-handler')
const Coupon=require('../models/couponModel')
const couponspage = expressHandler(async (req, res) => {
    try {
        const messages = req.flash();
        const coupons = await Coupon.find().sort({ _id: 1 });
        res.render("coupon", { title: "Coupons", coupons, messages });
    } catch (error) {
        throw new Error(error);
    }
});


/**
 * Add Coupon Page Route
 * Method GET
 */
 const addCoupon = expressHandler(async (req, res) => {
    try {
        const messages = req.flash();
        res.render("addCoupon", { title: "Add Coupon", messages, data: {} });
    } catch (error) {
        throw new Error(error);
    }
});

/**
 * Create Coupon
 * Method POST
 */
const createCoupon = expressHandler(async (req, res) => {
    try {
        const existingCoupon = await Coupon.findOne({ code: req.body.code });

        console.log(req.body);

        if (!existingCoupon) {
            const newCoupon = await Coupon.create({
                code: req.body.code,
                type: req.body.type,
                value: parseInt(req.body.value),
                description: req.body.description,
                expiryDate: req.body.expiryDate,
                minAmount: parseInt(req.body.minAmount),
                maxAmount: parseInt(req.body.maxAmount) || 0,
            });
            res.redirect("/admin/coupon");
        }
        req.flash("warning", "Coupon exists with same code");
        res.render("addCoupon", { title: "Add Coupon", messages, data: req.body });
    } catch (error) {
        throw new Error(error);
    }
});

/**
 * Edit Coupon page
 * Method GET
 */
const editCouponPage = expressHandler(async (req, res) => {
    try {
        const couponId = req.params.id;
        const coupon = await Coupon.findById(couponId);
        const couponTypes = await Coupon.distinct("type");
        const messages = req.flash();
        res.render("editCoupon", { title: "Edit Coupon", coupon, couponTypes, messages });
    } catch (error) {
        throw new Error(error);
    }
});
/**
 * Update Coupon
 * Method POST
 */
const updateCoupon = expressHandler(async (req, res) => {
    try {
        const couponId = req.params.id;
        const isExists = await Coupon.findOne({ code: req.body.code, _id: { $ne: couponId } });

        if (!isExists) {
            const updtedCoupon = await Coupon.findByIdAndUpdate(couponId, req.body);
            req.flash("success", "Coupon Updated");
            res.redirect("/admin/coupon");
        } else {
            req.flash("warning", "Coupon Already Exists");
            res.redirect("back");
        }
    } catch (error) {}
});
module.exports={
    couponspage,
    addCoupon,
    createCoupon,
    updateCoupon,
    editCouponPage
}