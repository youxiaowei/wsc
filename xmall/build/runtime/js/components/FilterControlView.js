/**
 * Created by liuqingling on 15/11/28.
 */
define(['require', './BaseView', '../models/BrandsModel', '../models/CategoryCollection', '../loader'], function(require, BaseView, BrandsModel, CategoryCollection, loader) {
  return BaseView.extend({
    type: "FilterControlView",

    brandModel: new BrandsModel(),
    categoryColletion: new CategoryCollection(),
    data: {
      brand: [],
      price: {},
      category: []
    },
    filterModel: null,
    initialize: function() {
      //loader.getTemplate('goodsfilter.html');
      var BaseModel = require('../models/BaseModel');
      this.filterModel = new BaseModel();
      var url = window.app.api + "/productlist-filterargs";
      var data = {};
      this.filterModel.ajaxOptions = {
        url: url,
        data: data,
        needReset: true,
        success: this.onSuccess.bind(this),
        error: this.onError.bind(this),
      }
    },

    oncategoryColletionReset: function(collection, options) {
      var me = this;
      var result = [];
      for (var i = 0; i < collection.models.length;) {
        var s = i + 3;
        if (s < collection.models.length) {
          result.push(collection.models.slice(i, i + 3));
        } else {
          result.push(collection.models.slice(i, collection.models.length));
        }
        i = s;
      }
      var rows = "";
      result.forEach(function(it, index) {
        var item = "";
        it.forEach(function(it, index) {
          item += '<div category-id="' + it.get('id') + '" class="filtercondition-category-item" > <div>' + it.get('text') + '</div> </div>';
        });
        rows += '<div class="filtercondition-category-row " >' + item + '</div>';
      });
      this.$('.filtercondition-category').empty();
      this.$('.filtercondition-category').append(rows);
    },
    onReset: function(collection, options) {
      var me = this;
      var result = [];
      for (var i = 0; i < collection.models.length;) {
        var s = i + 3;
        if (s < collection.models.length) {
          result.push(collection.models.slice(i, i + 3));
        } else {
          result.push(collection.models.slice(i, collection.models.length));
        }
        i = s;
      }
      var rows = "";
      result.forEach(function(it, index) {
        var item = "";
        if (index > 0) {
          it.forEach(function(it, index) {
            if (index == 1) {
              item += '<div data-id="' + it.get('id') + '" class="condition-row-mid condition-item condition-item-mid" > <img src="' + it.get('image') + '"> </div>';
            } else {
              item += '<div data-id="' + it.get('id') + '" class="condition-row-mid condition-item" > <img src="' + it.get('image') + '"> </div>';

            }
          });
        } else {
          it.forEach(function(it, index) {
            if (index == 1) {
              item += '<div data-id="' + it.get('id') + '" class="condition-item condition-item-mid" > <img src="' + it.get('image') + '"> </div>';
            } else {
              item += '<div data-id="' + it.get('id') + '" class="condition-item" > <img src="' + it.get('image') + '"> </div>';
            }
          });
        }
        rows += '<div class="condition-row " >' + item + '</div>';


      });
      this.$('.condition-wrap').empty();
      this.$('.condition-wrap').append(rows);
      this.$('.condition-item').on('click',this.brandSelect.bind(this));
    },
    render: function() {

      BaseView.prototype.render.apply(this, arguments);
      // var template = library.getTemplate('goodsfilter.html');
      // this.$el.empty().append(template);
      // this.onRender();
      return this;
    },
    filter: function(e) {
      this.$(".goodsfilter .typeselected").removeClass('typeselected');
      this.$(e.currentTarget).addClass('typeselected');
      if (this.$(e.currentTarget).attr('index') == 3) {
        this.$('.goodswrap').css({
          "display": "none"
        });
        this.$('.filtercondition ').css({
          "display": "block"
        });

      } else {
        this.$('.goodswrap').css({
          "display": "block"
        });
        this.$('.filtercondition ').css({
          "display": "none"
        });
      }

    },
    brandSelect: function(e) {
      var curId = this.$(e.currentTarget).attr('data-id');
      var index = this.data.brand.indexOf(curId);
      if(index > -1){
        var hasEl = curId;
      }
      if (!hasEl) {//未选择
        this.$(e.currentTarget).addClass('condition-item-selected');
        this.data.brand.push(this.$(e.currentTarget).attr('data-id'));
      } else {// 已选择
        this.data.brand.splice(index, 1);
        this.$(e.currentTarget).removeClass('condition-item-selected');
      }
    },
    comfirm: function() {
      this.trigger('filterResult', this);
      //return this.data;
    },
   /* comfirm: function() {
      this.trigger('filterResult', this);
      //return this.data;
    },*/
    categorySelect: function(e) {
      e.preventDefault();
      var me = this;
      var hasEl = this.data.category.find(function(it) {
        if (this.$(e.currentTarget).attr('category-id') == it) {
          return it;
        }
      });
      if (!hasEl) {
        this.$(e.currentTarget).find('div').addClass('filtercondition-category-selected');
        this.data.category.push(this.$(e.currentTarget).attr('category-id'));
      } else {
        this.data.category.find(function(it, index, arr) {
          if (this.$(e.currentTarget).attr('category-id') == it) {
            me.data.category.splice(index, 1);
          }
        });
        this.$(e.currentTarget).find('div').removeClass('filtercondition-category-selected');
      }
      return false;
    },
    inputPrice: function(e) {
      if (this.$(e.currentTarget).attr('inputprice') == "min") {
        this.data.price.min = this.$(e.currentTarget).val();
      } else {
        this.data.price.max = this.$(e.currentTarget).val();
      }

    },
    onRender: function() {
      this.$el.find('.bottom-button').bind('click', this.comfirm.bind(this));
      this.$(".filtercondition-category").on("click", ".filtercondition-category-item", this.categorySelect.bind(this));
      this.$(".filtercondition-priceinput").on("change", "input", this.inputPrice.bind(this));
      this.listenTo(this.brandModel, "reset", this.onReset);
      this.listenTo(this.categoryColletion, "reset", this.oncategoryColletionReset);
    },

    // 由页面调用
    initFilterData: function(categoryId) {
      this.filterModel.ajaxOptions.data.category = categoryId;
      this.filterModel.loadData();
    },

    onSuccess: function(data) {
      if (data && data.status == 'ok') {
        //初始化数据
        this.categoryColletion.reset(data.data.filterCategory);
        this.brandModel.reset(data.data.filterBrand);
      }
    },
    onError: function(res) {
      console.log(res);
    },
  });

});
