define(['backbone'], function(Backbone){

  return Backbone.Model.extend({
    url: function(){
      return (window.app ? window.app.url : "") + "/api/v2/collections/" + this.id ;
    },

    defaults: {
      state: "运输中",
      id: "K189279783928",
      company: "用友深圳配送中心"

    },

    fetch:function(){

    },

    parse: function(data){
      return data;
    }

  });
});
