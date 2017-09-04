define(['./StaticCollection'], function(StaticCollection){
  return StaticCollection.extend({
    items: [
      {
        "imageurl": "http://img.alicdn.com/bao/uploaded/TB1lP2_HpXXXXbHXXXXSutbFXXX.jpg_120x120Q30.jpg"
      },
      {
        "imageurl": "http://img.alicdn.com/bao/uploaded/TB1T0E_IXXXXXbBaXXXwu0bFXXX.png_120x120Q30.jpg"
      },
      {
        "imageurl": "http://img.alicdn.com/bao/uploaded/TB1UN.sIpXXXXXEXFXXq6xXFXXX_120x120Q30.jpg"
      },
      {
        "imageurl": "http://img.alicdn.com/bao/uploaded/TB1f5.HIpXXXXawXXXXq6xXFXXX_120x120Q30.jpg"
      },
      {
        "imageurl": "http://gw2.alicdn.com/bao/uploaded//2c/9c/TB1HzKeGXXXXXadXVXXSutbFXXX.jpg"
      },
      {
        "imageurl": "http://img.alicdn.com/bao/uploaded/TB1dAMgIXXXXXcjXXXXSutbFXXX.jpg_120x120Q30.jpg"
      },
      {
        "imageurl": "http://img.alicdn.com/bao/uploaded/TB1FIXKJFXXXXbiXFXXSutbFXXX.jpg_120x120Q30.jpg"
      },
      {
        "imageurl": "http://img.alicdn.com/bao/uploaded/TB15ktbIFXXXXbAaXXXSutbFXXX.jpg_120x120Q30.jpg"
      },
      {
        "imageurl": "http://img.alicdn.com/bao/uploaded/TB19PfQHpXXXXaTXFXXwu0bFXXX.png_120x120Q30.jpg"
      }
    ],
    // initialize: function(){
    //   this.reset(this.items);
    // },

    sync : function(){

      this.reset(this.models);
    }
  });
});
