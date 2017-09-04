
define(['./MongoRestCollection'], function(MongoRestCollection){

  return MongoRestCollection.extend({
    urls:[window.app.api+'/activities1',window.app.api+'/activities'],
    url:function(path){
      var url;
      if(path){
        url=(window.app ? window.app.api :"")+path;
      }
      else{
        url=(window.app ? window.app.api :"")+"/activities";
      }

    return url;
  },

    loadData:function(calbacks){
      this.fetch({success:function(data){
        calbacks.success&&calbacks.success(data.attributes);
      },error:function(){
        calbacks.error&&calbacks.error();
      }});
    }
  });
});
