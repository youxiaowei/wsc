define(['./BaseView','../models/BaseModel'], function(BaseView,BaseModel){

  return BaseView.extend({
    type: 'ProductDetailInfoView',

    model: null,

    initialize: function(){
      this.model = new BaseModel();
    },

    initData: function(paramInfo){
      if(!paramInfo || !paramInfo.detailInfo){
        this.$el.empty();
        return;
      }
      if(paramInfo.detailInfo == ""){
    	  this.template="<div class = 'icomoon-without add-blank-leaving-icon'></div><div class = 'add-blank-leaving-words'>还没有相关售后哟~</div>";
      }else{   	  
    	  this.template = paramInfo.detailInfo;
      }
      this.refresh();
    },


    render: function(){
      this.$el.empty();
      var template = this.template
      if(template){
        this.$el.html(template);
      }

      return this;
    },

    refresh: function(){
      this.render();
    }


  });
});
