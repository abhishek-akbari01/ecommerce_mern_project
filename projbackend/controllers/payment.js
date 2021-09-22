const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "m6zfm4fbggmrgchs",
  publicKey: "5g8hcfdkc37sgggv",
  privateKey: "b86e28daa00e3951ccdeca95c76590dc"
});


exports.getToken = (req, res) => {
    gateway.clientToken.generate({}, (err, response) => {
        if(err){
            res.status(500).json(err)
        }
        else{
            res.send(response)
        }
      });
}

exports.processPayment = () => {

    let nonceFromTheClient = req.body.paymentMethodNonce

    let amountFromClient = req.body.amount

    gateway.transaction.sale({
        amount: amountFromClient,
        paymentMethodNonce: nonceFromTheClient,
        deviceData: deviceDataFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, (err, result) => {
          if(err){
              res.status(500).json(err)
          }else{
              res.json(result)
          }
      });
}
