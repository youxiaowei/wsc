
define(['./MongoRestCollection'], function(MongoRestCollection){

  return MongoRestCollection.extend({
    demoData: [
      {
        "id":"xx1111xx",
        "price":"59",
        "discount":"19",
        "imageurl": "http://m.360buyimg.com/mobilecms/s220x220_jfs/t2422/135/111075801/207818/600c8ba0/55eebb92Nce3ca09a.jpg!q70.jpg",
      },{
        "id":"x111111111111111xxx",
        "price":"61",
        "discount":"20",
        "imageurl": "http://m.360buyimg.com/mobilecms/s220x220_jfs/t1882/91/1046307344/76483/3b98ea0f/56399ebeN9ab907f6.jpg!q70.jpg"
      },
      {
        "id":"1111",
        "price":"59",
        "discount":"10",
        "imageurl": "http://m.360buyimg.com/mobilecms/s220x220_jfs/t2437/158/655023102/128758/b15c8422/561df2c7N98845f3f.jpg!q70.jpg"
      }
    ],
    initialize: function(){
      this.reset(this.demoData);
    },
    url:function(){
      return "http://do.kdweibo.com/openauth2/api/appAuth2";
    },
    loadData:function(calbacks){
      this.fetch({success:function(){
        calbacks.success&&calbacks.success();
      },error:function(){
        calbacks.error&&calbacks.error();
      }});
    },
    parse:function(data,options){
      return this.demoData;
    }
  });
});
