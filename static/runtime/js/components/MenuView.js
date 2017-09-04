define(['underscore', './BaseView'], function(_, BaseView){

  //options: {menus: [{name:, action:  (event or url)}],
  //          target:
  //          scrollable:
  //          numberOfLines:
  //          }
  return BaseView.extend({

    type: 'MenuView',

    itemTemplate: _.template("<a class='control-item' href='<%=href%>' data-index='<%=index%>'><%=name%></a>"),

    events: {
      "click a": "onSelect"
    },

    configure: function(options){

      this.$el.append('<div class="menu-control"></div>');
      this.options = options;
      if(options.scrollable){
        this.$el.find('.menu-control').addClass('scrollable');
      }
      if (options.menus) {

        var $f = $(document.createDocumentFragment());

        _.reduce(options.menus, _.bind(function($f, each, i){
          each = _.defaults(each, {href: 'javascript: void(0)', name: '', index: i});
          var a = this.itemTemplate(each);
          if(i == 0){
            a = $(a).addClass("active");
          }
          return $f.append( a );
        }, this), $f);

        this.$el.find('.menu-control').append( $f );
      }
    },

    onSelect: function(event){
      this.$("a").removeClass('active');
      event.target.classList.add('active');

      var index = this.$('a').index(event.target);
      var menu = this.options.menus[index];
      if (menu.action) {    //事件
        Backbone.trigger(menu.action,this.options);
      } else {
        //TODO: 其他触发方式，例如URL
      }
    },
  });
});
