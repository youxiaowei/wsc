define(['./PageView','require'], function(PageView,require){
  return PageView.extend({
    type:'brandintroduce',

    events:{
        'click .header-icon-back': 'onBack',
    },

    onRender:function(){
      this.setInfo();
    },
    onResume: function(){
      this.toggleBar && this.toggleBar('hide');
      this.$('.bar').show();

    },

    setInfo:function(){
      var _this =this;
      var Info = require('../models/BaseModel');
      var info = new Info();
      info.loadData({
        path:'/branddetail',
        type:"GET",
        data: {id:window.application.getQueryString('id')},
        success:function(res){
          if(res.status=="ok"){
            //console.log(res)
            _this.$('.brandintroduce-picturediv').html(res.data.branddes);
            _this.$('.branddetail-name').append(res.data.brandname);
            _this.$('.title').append(res.data.brandtitle);
            _this.$('.branddetail-head-left-picture').attr("src", res.data.brandlogo);
          }else {
            library.Toast(res.message);
            _this.onBack();
          }

        },
        error:function(res){
        }

      });
      //this.$('.brandintroduce-text').append(info.get('brandDes'));
      //this.$('.branddetail-name').append(info.get('brandName'));
      //this.$('.title').append(info.get('brandTitle'));
      //this.$('.branddetail-head-left-picture').attr("src", info.get('brandLogo'));
    },

    onBack:function(){
      window.history.back();
    },

  });
});
