/**
 * Created by liuqingling on 15/11/28.
 */
define(['./PageView'], function(PageView) {
  return PageView.extend({
    events: {
      // "click .common-search-right": "toList"
      "click .common-search-right": "scanCode",
      'click .common-search-left-inner': 'toSearch',
    },
    toSearch: function() {
      this.findComponent("cate_search_midpage").show();
    },
    onRender: function() {
      this.findComponent("HomePushBrandView").collection.loadData({
        path: "/brands",
        type: "GET",
        needReset: true,
        data: {
          pagesize: 12,
          pageindex: 1
        }
      });
    },
    onResume: function() {
      this.toggleBar && this.toggleBar("show");
    },
    branddetail: function() {
      Backbone.history.navigate('#brand-navigate/branddetail', {
        trigger: true
      });
    },
    scanCode: function(e) {
      if (!(typeof cordova == "undefined")) {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
              if(result.text){
              }
            },
            function (error) {
              alert("Scanning failed: " + error);
            }
        );
      }else{

      }
    }
  });

});
