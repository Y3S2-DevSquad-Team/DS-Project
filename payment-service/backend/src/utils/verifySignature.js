const crypto = require("crypto");

module.exports = function verifySignature(data, merchantSecret) {
  if (!data || !merchantSecret) return false;

  const {
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig: receivedSig
  } = data;

  if (!merchant_id || !order_id || !payhere_amount || !payhere_currency || !status_code || !receivedSig) {
    return false;
  }

  // Construct local signature as per PayHere docs
  const localSig = crypto
    .createHash("md5")
    .update(
      merchant_id +
        order_id +
        payhere_amount +
        payhere_currency +
        status_code +
        crypto.createHash("md5").update(merchantSecret).digest("hex")
    )
    .digest("hex")
    .toUpperCase();

  return localSig === receivedSig.toUpperCase();
};
