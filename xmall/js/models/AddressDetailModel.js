define(['./BaseModel'], function(BaseModel){

  return BaseModel.extend({

    defaults: {
      receiver: "",
      receiverPhone: "",
      receiverDetailAddress: "",
      receiverProvince:"",
      receiverCity:"",
      receiverRegion:"",
      isdefault:false
    }
  });
});
