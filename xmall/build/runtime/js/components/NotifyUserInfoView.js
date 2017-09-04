define(['./BaseView'], function(BaseView){
  return BaseView.extend({

    defaults:{
      name: "张三"
    },

    events: {
      "click .btn-save": "toSave",
      "click .gobackPersonal": "goback"
    },

    initialize: function(){

    },
    render: function(){
      this.$el.empty();
      var template = library.getTemplate("notify-name-info.html");
      this.$el.append(template);
      this.$el.find('.notify-user-name').val(this.options.name);
      return this;
    },

    setName: function(name){
      this.$el.find('.notify-user-name').val(name);
    },

    toSave: function(e){
      var name = this.$el.find('.notify-user-name').val();
      name = this.hEncode(name);
      /*name = name.replace(/[<{].[>}]|[<{][}>]|html|js|css/g,"");*/
      if(!name || name == ""){
        alert("名字不能为空");
        return;
      }
      this.options.callback && this.options.callback(name);
        var _this = this;
      $(".nofity-name-info").removeClass("nofity-name-info-show");
        setTimeout(function(){_this.remove()},100);
    },

    hEncode: function(name){

       if(name == null)
         return name;
       var encodeStrBuilder = ""; 
       
       for(var i=0; i<name.length; i++){
      
          console.log(this.hChart(name.charAt(i)));
          encodeStrBuilder += this.hChart(name.charAt(i));
           
       }
      
       return encodeStrBuilder;
       
    },

    hChart: function(ch){

      
       switch(ch){
          case '&':
               return "&amp;";
          case '<':
               return "&lt;";
          case '>':
               return "&gt;";
          case '"':
               return "&quot;";
          case ' ':
               return "&nbsp;";
          case '/':
               return "&frasl;";     
          default:{
               return ch;   

               }               
       } 
   },
    goback: function(e){
        $(".nofity-name-info").removeClass("nofity-name-info-show");
        var _this = this;
        setTimeout(function(){_this.remove()},100);
    },
    remove: function(){
      Backbone.View.prototype.remove.apply(this, arguments);
    }

  });
});
