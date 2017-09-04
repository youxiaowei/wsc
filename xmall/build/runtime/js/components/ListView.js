//    ListView  列表数据
//
// className:ListView

// # ListView

// 展示列表

// ## 配置

// 变量 | 类型 | required | 描述
// ----|------|----------|-----
//     template | string | true | 列表项模板，对应到js/templates下的文件名
// collection | object | true | 通过type属性指定自定义数据源，对应到js/models下模块名
// iscroll | boolean | false | 是否使用IScroll
// autoload | boolean | false | 是否自动加载数据，默认为true
// style | string | false | 继承了BaseView的公有属性，针对此组建el的样式
// paging | boolean | false | 分页
// templateType | string | false | 模板类型 分别为mustache,underscore
// filterKey  | string | false | 数据源过滤值
// filterValue | string | false | filterKey 和 filterValue 需要同时用
// events |  obj | false | 事件指定events: {"click .loadmore": "onLoadMore","click li": "onRowSelect" }
//
//
//
// 例子：

// 自定义数据源

// ```
// {
//   type: 'ListView',
//      options: {
//  collection: {
//    type: 'MyCollection'
//  }
// }
// }
// ```

// 动态数据源（需要配合app-bricks使用）

// ```
// {
//   type: 'ListView',
//       options: {
//   collection: {
//     type: 'RemoteCollection',
//         id: '{{动态数据源id}}'
//   }
// }
// }
// ```

// ## 事件

// ### 此组件监听的事件
// 事件 | 描述
// ----|------
//     reset | 重新加载列表
// filter | 过滤列表


// ### 此组件发出的事件
// 事件 | 描述
// ----|-----
//     |

// ## API

// refresh

// setEditing

// reset

// filter

// ## data-action API

// 当列表项内有可点击元素，可以使用data-action API分别监控这些元素的点击事件。

// 只需要在可点击元素上添加data-action属性，
// 就可以通过监听ListView的"action:{{name}}"，响应某个内部按钮事件。

// ```html
// <li>
// <div>
// {{name}}
// </div>
// <button data-action="delete">Delete</button>
//     <div data-action="update">Update</div>
//     </li>
// ```

// ```js
// var listView = this.find('my-listview');
// this.listenTo(listView, 'action:delete', this.onDelete);
// ```

// ## FAQ

// Q: 我需要在ListView展现之前，处理一下数据

// A: 例如我们需要将年龄大于等于18的会员，标记为成年，成年的会员展示联系按钮，否则显示“不能联系”，以下为伪代码：

// app.js

// ```
// {
//   pages: {
//     'myView': {
//       components: [
//         {
//           id: 'memberListView',
//           type: 'ListView', options: {
//           template: 'member_tpl.mustache',
//           collection: {
//             type: 'Members'
//           }
//         }
//         }
//       ]
//     }
//   }
// }
// ```

// member_tpl.mustache
// 模板

// ```
// <div>
// <div>{{name}}</div>

// {{#adult}}
// <button>Contact</button>
// {{/adult}}
// {{^adult}}
// <div>could not contact</div>
// {{/adult}}
// </div>
// ```

// Members.js

// ```
// BaseCollection.extend({

//   // json_models为一个json数组
//   postParse: function(json_models){
//     return json_models;
//   },

//   parse: function(response){
// 取出结果数组
//     var result = response;
// 后处理
//     result = this.postParse(result);
// 最终结果
//     return result;
//   }
// });
// ```
// MyPageView.js

// ```js
// var collection = this.find("memberListView").collection;
// collection.postParse = function(json_models){
//   return _.map(json_models, function(each){
//     each.adult = each.age >= 18;
//     return each;
//   });
// }
// collection.fetch();
// ```

define([
  'require',
  '../loader',
  'underscore',
  'backbone',
  './BaseView',
  'backbone.paginator'
], function(require, loader, _, Backbone, BaseView, PageableCollection) {

  String.prototype.endsWith = function(s) {
    return s === '' || this.slice(-s.length) === s;
  };

  return BaseView.extend({

    type: 'ListView',

    events: {
      "click .loadmore": "onLoadMore",
      "click li": "onRowSelect"
    },

    defaults: {
      autoload: true
    },

    mapping: {},

    initialize: function(options) {
      BaseView.prototype.initialize.apply(this, arguments);
      // ListView组件响应的事件
      this.on('reset', this.reset);
    },

    remove: function() {
      BaseView.prototype.remove.apply(this, arguments);

      this.off();

      this.stopListening();
    },

    render: function() {
      var scroller = $(
        '<div class="scroller">' +
          '<ul class="table-view">' +
          '</ul>' +
        '</div>'
      );
      this.$el.append(scroller);

      this.loadmore = this.getLoadingBar(this.options.isAutoLoadMore);
      this.loadmore.hide().appendTo(scroller);

      return this;
    },

    getLoadingBar: function(isAutoLoadMore){
      var loadingBar = $("<div></div>");
      if(this.options.paging){
        if(isAutoLoadMore){
          loadingBar.addClass("loadmore-loading");
          var msg = $("<span class='label'></span>");
          msg.text("加载更多");
          var loading = $("<span class='icomoon-load'></span>");
          loading.addClass('listview-loadingbar');
          /*for(var index = 1; index < 13; index ++){
            var path = $("<span ></span>");
            path.addClass('path'+index);
            loading.append(path);
          }*/
          loadingBar.append(loading).append(msg);
        }else {
          var loadingBar = $(
            '<button class="loadmore">' +
            '<div class="label">加载更多</div>' +
            '<span class="loading-icon"></span>' +
            '</button>');
        }
      }
      return loadingBar;
    },    /**
     * options:
     * paging: 是否分页，boolean
     * template: 列表项模板，string，文件名，如果是js结尾
     */
    configure: function(options) {
      // 防止多次组件被setOptions()，有重复数据
      this.removeAllItems();
      delete this.template;

      var o = options;

      if (options.iscroll == 'true') {
        this.IScroll = new IScroll(this.el, {
          probeType: 2,
          scrollX: false,
          scrollY: true,
          mouseWheel: true
        });
      }
      //if (options.paging) this.loadmore.show();

      // 模板
      if (o.template) {
        // 文件名形式传入
        this.template = window.library.getTemplate(o.template);
      }

      if (options.collection) {

        if (typeof options.collection == 'string') {
          //根据ID在application获取collection实例
          this.collection = window.application.getCollection(options.collection);
        } else if (options.collection instanceof Backbone.Collection) {
          this.collection = options.collection;
        } else if (options.collection.type) {
          _Collection = require('../models/' + options.collection.type);
          // 第一个参数为初始数据，第二个参数为个性配置
          this.collection = new _Collection(options.collection.items || [], options.collection);
        }

        // 绑定数据集事件
        this.bindCollectionEvents(this.collection);

        this.reset(this.collection);

        // // 自动加载，分页，且collection支持分页API
        if (options.autoload && options.paging && this.collection.getFirstPage) {
          this.collection.getFirstPage();
        }else if (options.autoload) {
          this.collection.fetch();
        }

      }

      this.$('.empty-view').remove();
      this.emptyView = $(
        "<div>已经加载全部</div>"
        // window.library.getTemplate(o.emptyTemplate) || "<div>没有更多数据</div>"
      ).addClass('empty-view').hide();
      this.$('.scroller').append(this.emptyView);

      this.$('.error-view').remove();
      this.errorView = $(
        "<div>网络异常</div>"
        // window.library.getTemplate(o.errorTemplate) || "<div>网络异常</div>"
      ).addClass('error-view').hide();
      this.$('.scroller').append(this.errorView);
    },

    // 绑定模型的事件
    bindCollectionEvents: function(collection) {

      this.stopListening();

      var me = this;

      this.listenTo(collection, 'end', function() {
        me.loadmore.hide();
      });

      this.listenTo(collection, 'add', function(model, collection, options) {
        me.addItem(model);
        me.refresh();
      });

      this.listenTo(collection, 'remove', function(model, collection, options) {

        var viewItem = me.mapping[model.cid];
        //TODO: animate
        if(viewItem) {
          viewItem.animate('1s fadeOut', function() {
            viewItem.remove();
            delete me.mapping[model.cid];
          });
        }
      });

      this.listenTo(collection, 'change', function(model, collection, options) {
        //TODO: update item
        // 用模板重新渲染item，用jquery的replace方法替换旧的
      });

      this.listenTo(collection, 'reset', this.reset);

      this.listenTo(collection, 'empty', this.onEmpty);
      this.listenTo(collection, 'sync', this.onSync);
      this.listenTo(collection, 'error', this.onError);
      this.listenTo(collection, 'notify', this.reset);

    },

    //
    // ListView API
    //
    refresh: function() {
      if(this.collection.hasNextPage() && this.collection.getNextPage){
        this.loadmore.show();
        $(this.loadmore.find('.label')).empty().append("加载更多");
      }else{
        if(this.options.isAutoLoadMore){
          if(this.collection.length>0){
            this.loadmore.show();
            this.loadmore.empty().text("已加载全部");
          }else{
            this.loadmore.hide();
          }
        }else{
          if(this.collection.length>0){
            this.loadmore.show();
            $(this.loadmore.find('.label')).empty().append("已加载全部");
          }else{
            this.loadmore.hide();
          }
        }
      }
      if (this.IScroll) {
        setTimeout(_.bind(function() {
          this.IScroll.refresh();
        }, this), 0);
      }
    },

    setEditing: function(editing) {

      this.editing = editing;

      if (editing) {
        this.$el.addClass('editing');
      } else {
        this.$el.removeClass('editing');

        // deselect all item
        this.getChildren().forEach(function(child) {
          child.removeClass('selected');
        });
      }
    },

    // reolad data
    reset: function(collection) {
      if (this.options.paging) this.loadmore.show();
      //remove all items
      this.removeAllItems();

      var me = this;
      var models;
      if(collection instanceof PageableCollection){
        models = collection.mode == "server" ? collection.models : collection.fullCollection.models;
      }else if(collection instanceof Array){
        models = collection;
      }else{
        models = collection.models;
      }
      _.each(models, function(model) {
        me.addItem(model);
      });

      this.refresh();
    },

    onEmpty: function(collection, response, options) {
      this.loadmore.hide();
      this.emptyView.show();
      this.errorView.hide();
    },
    onError: function(collection, response, options) {
      this.loadmore.hide();
      this.emptyView.hide();
      this.errorView.show();
    },

    //
    // ListView Evnets
    //
    onLoadMore: function(event) {
      var loadmoreButton = event.currentTarget;
      this.trigger('loadmore', this, event);
      if(this.collection.hasNextPage()){
        this.collection.getNextPage();
      }else{
        library.Toast("已加载全部",2000);
        $(this.loadmore.find('.label')).empty().append("已加载全部");
        console.log("all the pages have been loaded")
      }
    },

    callback: null,

    setCallBack:function(callback){
      this.callback = callback;
    },

    onRowSelect: function(event) {
      var li = event.currentTarget;
      var liCollection = this.el.querySelector('ul').children;
      var index = _.indexOf(liCollection, li);
      var item = this.getChildren()[index];
      if (!this.editing) {
        var action = event.target.getAttribute('data-action');
        if (action) {
          this.trigger('action:' + action, event);
        } else {
          this.trigger('itemSelect', this, item, index, event);
          this.trigger('select', this, item, index, event);
        }
      } else {
        // item.toggleSelect();
        item.toogleClass('selected');
      }
      this.callback && this.callback({item: item,index: index});
    },

    currentItem: null,
    addItem: function(item) {
      var viewItem;
      if (item instanceof Backbone.Model) {
        // convert object to Item
        try {
          if(!this.template) { // 如果没有配置模板，动态生成模板、
            var keys = _.keys(item.attributes);
            var ctype = keys[2] || keys[1] || keys[0];
            var _template = "<li class='table-view-cell media'><a href='#' class='navigate-right'><div class='media-body'><%=" + ctype + "%></div></a></li>";
            this.template = _.template(_template); // 默认读取underscore模板
          }
          // TODO: 提供更多参数
          // var params = _.extend(item.toJSON(), {listView: this});
          viewItem = this.template(item.toJSON()); //new this.itemClass({data: item.toJSON()});
        } catch(e) {
          this.stopListening();
          console.log('\t模板变量不合法！\t\n' + e);
          //alert('\t模板变量不合法！\t\n' + e);
        }
      }
      viewItem = $(viewItem);
      this.currentItem = viewItem;
      this.mapping[item.cid] = viewItem;
      this.addChild(viewItem);
      this.$("ul.table-view").append($(viewItem));
    },

    //id or item instance
    //TODO: not work yet
    removeItem: function(item) {

      var indexToRemove = $.isNumberic(item) ? item : this.getChildren().indexOf(item);

      if (indexToRemove != -1) {
        this.getChildren().splice(indexToRemove, 1);
      }
    },

    removeAllItems: function() {
      _.each(this.getChildren(), function(child) {
        child.remove();
      });

      this.getChildren().splice(0, this.getChildren().length);
    }
  });
});
