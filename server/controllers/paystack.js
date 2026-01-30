const  { PAYSTACK_BASE_URL, PAYSTACK_SECRET_KEY } = require("../config/keys")

const axios = require("axios")


const fetchBillCategories = async () => {
  // Get all available services from Paystack (Electricity, Water, Waste)
  const response = await axios.get(`${PAYSTACK_BASE_URL}/bill`, {
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
  });

  return response.data.data;
};

const validateBill = async (serviceCode, accountNumber) => {
  // Check customer details & amount
  const response = await axios.get(
    `${PAYSTACK_BASE_URL}/bill/validate?service=${serviceCode}&account_number=${accountNumber}`,
    { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
  );

  if (!response.data.status) throw new Error(response.data.message);
  return response.data.data; // Contains customer name, amount, etc
};

const initializeBillPayment = async ({ serviceCode, accountNumber, email }) => {
  const response = await axios.post(
    `${PAYSTACK_BASE_URL}/bill`,
    { service: serviceCode, account_number: accountNumber, email },
    { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
  );

  if (!response.data.status) throw new Error(response.data.message);
  return response.data.data; // Contains authorization_url & reference
};

const verifyBillPayment = async (reference) => {
  const response = await axios.get(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
  });

  if (!response.data.status) throw new Error(response.data.message);
  return response.data.data; // payment details
};



module.exports = {validateBill, initializeBillPayment, verifyBillPayment, fetchBillCategories}