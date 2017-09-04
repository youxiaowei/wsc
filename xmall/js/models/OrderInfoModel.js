//订单信息Model
// author Vicent
define(['./BaseModel'], function(BaseModel){

  return BaseModel.extend({

    createOrderUrl :  window.app.api+'/createorder',
    orderInfoUrl : window.app.api+'/getOrderDetail',
    cancelOrderUrl: window.app.api+'/cancelOrder',
    receiveOrderUrl: window.app.api+'/confirmOrder',
    receiveCreditOrderUrl: window.app.api+'/updateOrderStatu'
  });
});
