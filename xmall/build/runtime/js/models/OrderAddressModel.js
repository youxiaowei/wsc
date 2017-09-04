define(['./BaseModel'], function(BaseModel){

  return BaseModel.extend({

    url: function(){
      return "";
    },

    parse: function(data){

      return data;
    }

  });
});
