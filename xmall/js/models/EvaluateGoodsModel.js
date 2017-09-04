
define(['./AjaxCollection'], function(AjaxCollection){

  return AjaxCollection.extend({
    commentOrderUrl: window.app.api+"/getAllOrderList",

    
  });
});
