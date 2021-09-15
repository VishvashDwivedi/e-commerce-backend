var braintree = require("braintree");

var gateway = braintree.connect({
  environment:  braintree.Environment.Sandbox,
  merchantId:   'yssk7svp43wzqn36',
  publicKey:    'dhy3p4q5jp3rgmf2',
  privateKey:   '8240a70f460800e33058e45cddfae5d3'
});


exports.getToken = (req, res) => {
  gateway.clientToken.generate({}, function(err, response) {
      if(err)
        res.status(500).send(err);
      else
            res.send(response);
  });
};
 

exports.processPayment = (req, res) => {

    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amount = req.body.amount;
    
    gateway.transaction.sale({
        amount: amount,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, function (err, result) {
        
        if(err) {
            res.status(500).send(err);
        }
        else {
            res.send(result);
        }

    });
};