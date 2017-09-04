// 修改性别
// author Vicent
define(['./BaseView'], function(BaseView){
  return BaseView.extend({

    defaults:{
      sex: "保密"
    },

    events: {
      "click .gobackPersonal": "goBack",
      "click .notify-sex-mile": "selectMile",
      "click .notify-sex-femile": "selectFemile",
      "click .notify-sex-unknown": "selectUnknown",
    },

    initialize: function(){

    },
    render: function(){
      this.$el.empty();
      var template = library.getTemplate("notify-sex-info.html");
      this.$el.append(template);
      this.setSexSelected(this.options.sex);
      return this;
    },

    selectMile: function(e){
      this.setSexSelected("男");
    },
    selectFemile: function(e){
      this.setSexSelected("女");
    },
    selectUnknown: function(e){
      this.setSexSelected("保密");
    },

    setSexSelected: function(sex){
      console.log(sex);
      def = {
        display: 'none'
      };
      selected = {
        display: 'block'
      };
      this.$el.find(".item-mile").css(def);
      this.$el.find(".item-femile").css(def);
      this.$el.find(".item-unknown").css(def);
      if(sex == '男'){
        this.$el.find(".item-mile").css(selected);
      }else if(sex == '女'){
        this.$el.find(".item-femile").css(selected);
      }else if(sex == '保密'){
        this.$el.find(".item-unknown").css(selected);
      }
      this.options.callback && this.options.callback(sex);
    },

    goBack: function(){
        var _this = this;
      $(".nofity-sex-info").removeClass("nofity-sex-info-show");
        setTimeout(function(){_this.remove()},100);
    },
    remove: function(){
      Backbone.View.prototype.remove.apply(this, arguments);
    }

  });
});
