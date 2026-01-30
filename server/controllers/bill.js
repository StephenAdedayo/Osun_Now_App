const {
  REMITA_SECRET_KEY,
  REMITA_MERCHANT_ID,
  REMITA_API_KEY,
} = require("../config/keys");
const { Bill } = require("../models");
const { Service } = require("../models");
const User = require("../models");
// const { validateBill, initializeBillPayment, verifyBillPayment } = require("./paystack");
const axios = require("axios");
const crypto = require("crypto");


const initializeBillPayment = async (req, res, next) => {
  try {
    const { serviceId, amount, identifierValue } = req.body;

    const { firstName, lastName, email, phone, _id } = req.user;

    const name = `${lastName} ${firstName}`;

    const service = await Service.findById(serviceId);

    if (!service) {
      res.code = 404;
      throw new Error("Service not found");
    }

    // Setup Variables
    const merchantId = REMITA_MERCHANT_ID; // Your Demo Biller ID
    const secretKey = REMITA_API_KEY;
    const apiKey = REMITA_API_KEY;

    const orderId = `OSN-${String(Math.floor(Math.random() * 10000000000))}`; // Unique internal reference

    // Ensure amount is a number for calculation, but string for hash
    const totalAmount = amount;

    // Generate the SHA-512 Security Hash
    const rawString =
      merchantId + service.serviceTypeId + orderId + totalAmount + secretKey;
    const apiHash = crypto.createHash("sha512").update(rawString).digest("hex");

    console.log(apiHash);

    // 3. The Payload (Every field below is usually REQUIRED for this endpoint)
    const payload = {
      serviceTypeId: service.serviceTypeId,
      amount: +totalAmount,
      totalAmount: +totalAmount,
      orderId: orderId,
      payerName: name,
      payerEmail: email,
      payerPhone: phone,
      description: `Payment for ${service.name}`,
    };

    const url =
      "https://demo.remita.net/remita/exapp/api/v1/send/api/echannelsvc/merchant/api/paymentinit";

    // 5. Hit Remita Demo AP
    const response = await axios({
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `remitaConsumerKey=${merchantId},remitaConsumerToken=${apiHash}`,
      },
      data: JSON.stringify(payload), 
    });

    console.log(payload);

    const remitaResponse = response.data;

    console.log(
      "REMITA RESPONSE BODY:",
      JSON.stringify(remitaResponse, null, 2),
    );

    // The Standard Invoice API often returns RRR as 'RRR' (Uppercase)
    // or inside a status message. Let's extract it safely:
    const rrr =
      remitaResponse.rrr ||
      (remitaResponse.responseData && remitaResponse.responseData[0]?.rrr) ||
      remitaResponse.RRR; // Try uppercase too

    if (!rrr) {
      return res.status(400).json({
        success: false,
        message:
          "Remita did not generate an RRR. Check terminal logs for the reason.",
        remitaError: remitaResponse.statusMessage || remitaResponse.responseMsg,
      });
    }
    const newBill = await Bill.create({
      user: _id, // Assumes you have auth middleware
      service: service._id,
      identifierValue: identifierValue,
      amount: amount,
      rrr: rrr,
      transactionReference: orderId,
      status: "PENDING",
      paymentResponse: remitaResponse,
    });

    const checkoutUrl = `https://remitademo.net/remita/onepage/${merchantId}/${rrr}/resubmit.spa`;

    // 7. Send the RRR back to the frontend
    res.status(200).json({
      success: true,
      checkoutUrl,
      rrr: rrr,
      billId: newBill._id,
      message: "RRR generated successfully",
    });
  } catch (error) {
    console.error("Remita Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Failed to generate payment reference",
      error: error.response?.data?.statusMessage || error.message,
    });
    next(error)
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { rrr } = req.params;
    const merchantId = REMITA_MERCHANT_ID; // Your Demo Merchant ID
    const apiKey = REMITA_API_KEY; // Your Demo API Key
      
    // 1. Generate the Verification Hash
    // Formula: SHA512(rrr + apiKey + merchantId)
    const rawString = `${rrr}${apiKey}${merchantId}`;
    const apiHash = crypto.createHash("sha512").update(rawString).digest("hex");

    // 2. Call Remita Status API
    const url = `https://remitademo.net/remita/exapp/api/v1/send/api/echannel/${merchantId}/${rrr}/${apiHash}/status.reg`;

    const response = await axios.get(url);

    // 3. Update Database if Successful
    if (response.data.status === "00" || response.data.status === "01") {
      const updatedBill = await Bill.findOneAndUpdate(
        { rrr: rrr },
        { status: "SUCCESS", paymentResponse: response.data },
        { new: true },
      );
      return res
        .status(200)
        .json({
          success: true,
          message: "Bill Updated to SUCCESS",
          bill: updatedBill,
        });
    }

    res
      .status(400)
      .json({
        success: false,
        message: "Payment not verified",
        remitaResponse: response.data,
      });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const remitaWebhook = async(req, res) => {

try {
        // 1. Capture the incoming notification data
        // Remita often sends this as an array [ { rrr, status, orderRef... } ]
        const data = Array.isArray(req.body) ? req.body[0] : req.body;
        const { rrr, status, orderRef } = data; // orderRef is usually the orderId you sent

        // --- USE #1: VALIDATION ---
        // If the notification itself says 'failed', don't even bother calling the API
        // "00" and "01" are the only success codes.
        if (status !== "00" && status !== "01") {
            console.log(`[Webhook] ❌ Ignored: Transaction ${orderRef} failed with status ${status}`);
            return res.status(200).send("OK"); // Still send 200 so Remita stops pinging
        }

        // 2. THE HANDSHAKE (Verification)
        const merchantId = REMITA_MERCHANT_ID;
        const apiKey = REMITA_API_KEY;
        const rawString = `${rrr}${apiKey}${merchantId}`;
        const apiHash = crypto.createHash('sha512').update(rawString).digest('hex');

        const verifyUrl = `https://remitademo.net/remita/exapp/api/v1/send/api/echannel/${merchantId}/${rrr}/${apiHash}/status.reg`;
        
        const response = await axios.get(verifyUrl);
        const verifiedData = response.data;

        // 3. SECURE UPDATE
        if (verifiedData.status === "00" || verifiedData.status === "01") {
            
            // --- USE #2: LOGGING & TRACEABILITY ---
            // Use orderRef to find the bill if RRR is somehow missing, 
            // though RRR is the primary key.
            const bill = await Bill.findOne({ rrr: rrr });

            if (bill && bill.status === "PENDING") {
                bill.status = "SUCCESS";
                bill.paymentResponse = verifiedData; 
                await bill.save();

                console.log(`[Webhook] ✅ Confirmed: Order ${orderRef} (RRR: ${rrr}) is PAID.`);
                
                // Trigger fulfillment: e.g., send an SMS with the receipt
            }
        }

        res.status(200).send("OK");
    } catch (error) {
        console.error("Webhook Error:", error.message);
        res.status(500).send("Internal Server Error");
    }
};


module.exports = { initializeBillPayment, verifyPayment, remitaWebhook };
