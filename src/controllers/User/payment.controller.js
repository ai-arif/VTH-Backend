import SSLCommerzPayment from "sslcommerz-lts";
// ssl config
const store_id = process.env.PAYMENT_STORE_ID;
const store_passwd = process.env.PAYMENT_STORE_PASSWD;
//to do
const is_live = false;

import { ObjectId } from "mongodb";
import Appointment from "../../models/appointment.model.js";
import { User } from "../../models/user.model.js";

export const appointmentSSLPayment = async (req, res) => {
  const formData = req.body;
  const id = req.params?.id;

  try {
    const appointmentData = await Appointment.findById(id).select("phone");
    const userData = await User.findOne({
      phone: appointmentData?.phone,
    }).select("-password");

    const { fullName, phone, address, district, upazila } = userData;

    const transId = new ObjectId().toString();

    //to do
    let totalPayment = process.env.APPOINTMENT_PRICE;

    const data = {
      total_amount: totalPayment,
      currency: "BDT",
      tran_id: transId, // use unique tran_id for each api call
      success_url: `${process.env.APP_URL}/api/v1/user-appointment/payment/success/${id}?amount=${totalPayment}`,
      fail_url: `${process.env.APP_URL}/api/v1/user-appointment/payment/fail/${id}`,
      cancel_url: `${process.env.APP_URL}/api/v1/user-appointment/payment/fail/${id}}`,
      ipn_url: "http://localhost:3030/ipn",
      product_name: "Appointment fees",
      product_category: "Services",
      product_profile: "non-physical-goods",
      cus_name: fullName,
      cus_email: "example@test.com",
      cus_add1: address,
      cus_add2: district,
      cus_city: district,
      cus_country: "Bangladesh",
      cus_phone: phone,
      ship_name: fullName,
      ship_country: "Bangladesh",

      shipping_method: "Courier",
      cus_state: "Mymensingh",
      cus_postcode: "2202",
      cus_fax: phone,
      ship_add1: address,
      ship_add2: upazila,
      ship_city: district,
      ship_state: "Mymensingh",
      ship_postcode: 2202,
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

    sslcz.init(data).then((apiResponse) => {
      console.log(is_live);
      console.log(apiResponse);
      let GatewayPageURL = apiResponse.GatewayPageURL;
      return res.send({ url: GatewayPageURL, transId, totalPayment });
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ success: false, message: error.message });
  }
};

// payment success controller
export const appointmentSSLPaymentSuccess = async (req, res) => {
  try {
    const id = req.params?.id;
    const amount = req.query?.amount;
    const result = await Appointment.findByIdAndUpdate(
      id,
      { $set: { amount: amount, payment: "paid" } },
      { new: true }
    );

    res.redirect(
      `${process.env.FRONTEND_URL}/payment/success?appointmentId=${req.params.id}`
    );
  } catch (error) {
    console.log({ error });
    res.status(500).json({ success: false, message: error.message });
  }
};

// payment fail
export const appointmentSSLPaymentFail = async (req, res) => {
  const id = req.params?.id;

  try {
    res.redirect(
      `${process.env.FRONTEND_URL}/payment/fail?appointmentId=${req.params.id}`
    );
  } catch (error) {
    console.log({ error });
    res.status(500).json({ success: false, message: error.message });
  }
};
