define(['underscore', './BaseView',], function(_, BaseView){

  //options: {items: [{name:, action:  (event or url)}],
  //          target:
  //          }
  return BaseView.extend({

    type: 'MySegmentedView',

    itemTemplate: _.template("<a class='control-item segmented-item' data-index='<%=index%>'><%=name%></a>"),

    events: {
      "click a": "onSelect"
    },

    tabs: {},
    paramInfo: null,

    render: function(){
      this.$el.empty();
      this.$el.append('<div class="segmented-control"></div>');
      this.$el.append('<div class="segmented-content"></div>');
      if (this.options.items) {

        var $f = $(document.createDocumentFragment());
        _.reduce(this.options.items, _.bind(function($f, each, i){
          each = _.defaults(each, {name: '', index: i});
          var a = this.itemTemplate(each);

          return $f.append( $(a) );
        }, this), $f);
        this.$el.find('.segmented-control').append( $f );

        this.setActive(0);
      }

      return this;
    },

    _createItem: function(item){
      var $f = $(document.createDocumentFragment());
      this.getItemPage(item.page)
      .then(function(page){
        $f.append(page.$el);
        this.$('.segmented-content').empty().append($f);
        this.initCurrentPageData(item.page);
      }.bind(this))
      .catch(function(err){
        console.error(err)
        alert("页面加载失败")
      });
    },

    createComponent: function(cfg,index) {
      if(!this.tabs[cfg.type]){
        var Component = window.library.getComponent(cfg.type);
        if (!Component) throw new Error('Component ' + cfg.type + ' Not Exists.');
        this.tabs[cfg.type] = new Component(cfg).render();
        this.tabs[cfg.type].el.setAttribute('data-type', cfg.type);
        this.tabs[cfg.type].setOptions(cfg); // TODO: should be removed ?
      }
      this.tabs[cfg.type].initData && this.tabs[cfg.type].initData(this.paramInfo ? this.paramInfo[index] : {});
      var $f = $(document.createDocumentFragment());
      $f.append(this.tabs[cfg.type].$el);
      this.$('.segmented-content').empty().append($f);
    },

    initCurrentPageData: function(pageId){
      this.tabs[pageId].initData && this.tabs[pageId].initData(this.paramInfo);
    },

    getItemPage: function(id){

      if (!this.tabs[id]) {
        // 没有缓存
        return loader.createPage(id)
        .then(function(page){
          this.tabs[id] = page.render();
          return this.tabs[id];
        }.bind(this));
      } else {
        // 有缓存
        return Promise.resolve(this.tabs[id]);
      }
    },

    setActive: function(index){
      this.$("a").removeClass('segmented-item-active').removeClass('theme-color').removeClass('theme-border-color');
      this.$("a[data-index='"+ index +"']").addClass('segmented-item-active').addClass('theme-color').addClass('theme-border-color');
      var item = this.options.items[index];

      if(item.type){
        this.createComponent(item,index);
      }else{
        this._createItem(item,index);
      }
    },

    onResume: function(){
      var item = this.options.items[0];
      this.tabs[item.type].initData && this.tabs[item.type].initData(this.paramInfo ? this.paramInfo[0] : {});
    },

    onSelect: function(event){
      var index = $(event.target).attr('data-index');
      this.setActive(index);
    }
  });
});
