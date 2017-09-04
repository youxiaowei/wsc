define(['./BaseView','require'], function(BaseView,require){
  return BaseView.extend({

    defaults:{
      identityCard: "111111111111111111"
    },

    events: {
      "click .btn-save": "toSave",
      "click .gobackPersonal": "goback"
    },
  Wi:[ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ],     
ValideCode:[ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ],
    initialize: function(){
    },
    render: function(){
      this.$el.empty();
      var template = library.getTemplate("nofity-identityCard-info.html");
      this.$el.append(template);
      this.$el.find('.notify-user-identityCard').val(this.options.identityCard);
      return this;
    },

    setIdentityCard: function(identityCard){
      this.$el.find('.notify-user-identityCard').val(identityCard);
    },



 IdCardValidate:function(identityCard) { 
    identityCard = $.trim(identityCard);                                
    if (identityCard.length == 15) {   
        return this.isValidityBrithBy15IdCard(identityCard);        
    } else if (identityCard.length == 18) {   
        var a_idCard = identityCard.split("");                
        if(this.isValidityBrithBy18IdCard(identityCard)&&this.isTrueValidateCodeBy18IdCard(a_idCard)){   
            return true;   
        }else {   
            return false;   
        }   
    } else {   
        return false;   
    }   
}, 


/**  
 * 判断身份证号码为18位时最后的验证位是否正确  
 * @param a_idCard 身份证号码数组  
 */  
isTrueValidateCodeBy18IdCard:function(a_idCard) {   
    var sum = 0;                                
    if (a_idCard[17].toLowerCase() == 'x') {   
        a_idCard[17] = 10;                    
    }   
    for ( var i = 0; i < 17; i++) {   
        sum += this.Wi[i] * a_idCard[i];          
    }   
    valCodePosition = sum % 11;               
    if (a_idCard[17] == this.ValideCode[valCodePosition]) {   
        return true;   
    } else {   
        return false;   
    }   
},
/**  
  * 验证18位数身份证号码中的生日是否是有效生日  
  * @param idCard 18位书身份证字符串  
  */  
isValidityBrithBy18IdCard:function(idCard18){   
    var year =  idCard18.substring(6,10);   
    var month = idCard18.substring(10,12);   
    var day = idCard18.substring(12,14);   
    var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));   

    if(temp_date.getFullYear()!=parseFloat(year)   
          ||temp_date.getMonth()!=parseFloat(month)-1   
          ||temp_date.getDate()!=parseFloat(day)){   
            return false;   
    }else{   
        return true;   
    }   
},
 /**  
   * 验证15位数身份证号码中的生日是否是有效生日  
   * @param idCard15 15位书身份证字符串  
   * @return  
   */  
 isValidityBrithBy15IdCard:function(idCard15){   
      var year =  idCard15.substring(6,8);   
      var month = idCard15.substring(8,10);   
      var day = idCard15.substring(10,12);   
      var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));   
      
      if(temp_date.getYear()!=parseFloat(year)   
              ||temp_date.getMonth()!=parseFloat(month)-1   
              ||temp_date.getDate()!=parseFloat(day)){   
                return false;   
        }else{   
            return true;   
        }   
  },   
    toSave: function(e){
      var identityCard = this.$el.find('.notify-user-identityCard').val().trim();

      if(!identityCard || identityCard == ""){
        alert("身份证不能为空");
        return;
      }else{
            // if (identityCard != "" && !/^(\d{15}|\d{17}[\dXx])$/.test(identityCard)) {
            // alert('身份证号格式不正确！');
            // return false;
               if(((this.IdCardValidate(identityCard))==false )&& (identityCard.length!=0)){
           alert("身份证号输入不合法,请重新输入身份证号码");
           $('.notify-user-identityCard').val('');
           return false;
        }else{
          var _this=this;
       var Model = require('../models/BaseModel');
            var validateIdentityCardModel = new Model();
            var options={
                 url: window.app.api+'/checkIdentityCard',
                type: "POST",
                needReset:true,
                data:{identityCard:identityCard},
                 success:function(res) {
                    if (res.status == '1') {
                    // library.Toast("校验成功！");
                          _this.options.callback && _this.options.callback(identityCard);
                                                                  $(".nofity-identityCard-info").removeClass("nofity-identityCard-info-show");
                    setTimeout(function(){_this.remove()},100);
                    }else{
                        library.Toast('该身份证已存在！');
                        $('.notify-user-identityCard').val('');
                        return false;
                    }

                },
                error:function () {
                    library.Toast('身份证校验重复不成功！');
                    return false;
                }
            };
            validateIdentityCardModel.loadData(options);
      }
      }



        //var _this = this;

    },


    goback: function(e){
        $(".nofity-identityCard-info").removeClass("nofity-identityCard-info-show");
        var _this = this;
        setTimeout(function(){_this.remove()},100);
    },
    remove: function(){
      Backbone.View.prototype.remove.apply(this, arguments);
    }

  });
});
