let paypalModel = require('./model')
let badgeModel = require('../badges/model')
let emailModel = require('../email/model')

module.exports = {

  createBadgeAllSale: function(request, response, next) {
    let quantity = request.body.quantity
    let price = 99
    paypalModel.createBadgeAllSale(price, quantity, (error, payment)=> {
      if(error) next(error)
      else {
        response.header("Access-Control-Allow-Origin", "*")
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        response.json(payment)
      }
    })
  },

  executeBadgeAllSale: function(request, response, next) {

    let paymentId = request.body.paymentId
    let payerId = { "payer_id": request.body.payerId }
    let name = request.body.name
    let email = request.body.email
    let phone = request.body.phone
    let quantity = request.body.quantity

    paypalModel.executeSale(paymentId, payerId, (error, payment)=> {
      if(error) next(error)
      else {
        let newBadge = {
          name: name,
          email: email,
          phone: phone,
          type: "all",
          quantity: quantity,
          payment: payment
        }
        badgeModel.create(newBadge, (error, savedBadge)=> {
          if(error) next(error)
          else {
            emailModel.sendBadgeEmail(savedBadge.email)
            response.header("Access-Control-Allow-Origin", "*")
            response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
            response.json({message: "Success!"})
          }
        })
      }
    })
  },

  createPerformerBadgeSale: function(request, response, next) {
    let weekendOnly = request.body.weekendOnly === 'true'
    paypalModel.createPerformerBadgeSale(weekendOnly, (error, payment)=> {
      if(error) next(error)
      else {
        response.header("Access-Control-Allow-Origin", "*")
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        response.json(payment)
      }
    })
  },

  executePerformerBadgeSale: function(request, response, next) {

    let paymentId = request.body.paymentId
    let payerId = { "payer_id": request.body.payerId }
    let name = request.body.name
    let email = request.body.email
    let phone = request.body.phone
    let weekendOnly = request.body.weekendOnly

    paypalModel.executeSale(paymentId, payerId, (error, payment)=> {
      if(error) next(error)
      else {
        let newBadge = {
          name: name,
          email: email,
          phone: phone,
          type: weekendOnly ? "performer-weekend-upgrade" : "performer-full-upgrade",
          quantity: 1,
          payment: payment
        }
        badgeModel.create(newBadge, (error, savedBadge)=> {
          if(error) next(error)
          else {
            emailModel.sendBadgeEmail(savedBadge.email)
            response.header("Access-Control-Allow-Origin", "*")
            response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
            response.json({message: "Success!"})
          }
        })
      }
    })
  },


  executeSale: function(request, response, next) {
    let paymentId = request.body.paymentID
    let paymentData = { "payer_id": request.body.payerID }
    paypalModel.executeSale(paymentId, paymentData, (error, payment)=> {
      if(error) next(error)
      else response.json(payment)
    })
  }
}