/**
 * 远端collection，根据id适配
 */
define(['./BaseCollection','underscore'], function(BaseCollection, _) {

  var PARAM_TRIM_RE = /[\s'"]/g;
  var URL_TRIM_RE = /[<>\s'"]/g;

  return BaseCollection.extend({
    queryParams:{
      currentPage : "page",
      pageSize : "pageSize",
    },

    // initialize: function(models, options, collection){
      // var self = this;
      // this.id = collection.collection_id;
      // this.conditions = _.reduce(collection.conditions,function(conditions, obj){
      //   var condition = obj.key+obj.operator+obj.value;
      //   self.queryParams[obj.key] = obj.value;
      //   return conditions+'&'+condition;
      // },'')
    // },

    url: function() {
      return (window.app ? window.app.url : "") + "/ymall/" + this.id ;
    },

    parseLinks: function (resp, xhr) {
      var self = this;
      var links = {};
      var linkHeader = xhr.xhr.getResponseHeader("Link");
      if (linkHeader) {
        var relations = ["first", "prev", "next"];
        _.each(linkHeader.split(","), function (linkValue) {
          var linkParts = linkValue.split(";");
          var url = linkParts[0].replace(URL_TRIM_RE, '');
          var params = linkParts.slice(1);
          _.each(params, function (param) {
            var paramParts = param.split("=");
            var key = paramParts[0].replace(PARAM_TRIM_RE, '');
            var value = paramParts[1].replace(PARAM_TRIM_RE, '');
            if (key == "rel" && _.contains(relations, value)) links[value] = url + self.conditions;
          });
        });
      }

      return links;
    },
    hasNextPage: function()
    {
      return true;
    },

  });

});
