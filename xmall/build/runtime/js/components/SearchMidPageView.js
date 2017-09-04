define(['./BaseView','backbone'], function(BaseView,Backbone){
  return BaseView.extend({
    type: 'SearchMidPageView',
    localStorageKey:"xmallsearchstory",
    scrollTop:0,
    blur:function(){
      this.searchInput.blur();
    },
    show:function(){
      var _this = this;
      this.scrollTop = document.body.scrollTop;
      document.body.scrollTop = 0;

      this.wraper.show();
      this.searchInput.focus();
      var history = this.getSearchHistoryArr();
      this.historyWrapper.empty();
      if(history.length>0){
        this.historyWrapper.append($("<div class='search-mid-his-item' style='color:#B3B3B3'>搜索历史</div>"));
        for(var i=0,j=history.length;i<j;i++){
          var sitem = $("<div class='search-mid-his-item'>"+history[i]+"</div>");
          (
            function(_sitem,itemname,me){
              _sitem.bind('click',function(){
                 var keyword = itemname;
                  me.hide();
                  window.app.searchKey = keyword;
                  if(keyword!=""){
                    me.setSearchHistoryItem(keyword);
                  }
                  if(me.pageview.$pagename=="productlist"){
                    me.pageview.keyword = keyword;
                    me.pageview.initData();
                  }else{
                    Backbone.history.navigate("#home-navigate/product-list", {
                      trigger: true
                    });
                  }
                  me.searchInput.val('');
                  me.blur();
              });
            }
          )(sitem,history[i],this);

          this.historyWrapper.append(sitem);
        }
        var clearBtn = $("<button class='search-mid-clear-btn'>清除历史纪录</button>");
        clearBtn.bind('click',function(){
          window.localStorage.removeItem(_this.localStorageKey);
          _this.historyWrapper.empty();
        });
        this.historyWrapper.append(clearBtn);
      }
    },
    getSearchHistoryArr:function(){
      var sehis = window.localStorage.getItem(this.localStorageKey);
      var history =[];
      if(!sehis){return [];}
      try{
         history = JSON.parse(sehis);
      }catch(e){

      }
      return history;
    },
    setSearchHistoryItem:function(key){
      var history = this.getSearchHistoryArr();
      if(history.length>=5){
        history = history.slice(0,4);
      }
      var sign = 0;
      for(var i in history){
        if(history[i] == key){
            sign = 1;
            break;
        }
      }      
      if(sign == 0){
        history = [key].concat(history);
      }
      
      window.localStorage.setItem(this.localStorageKey,JSON.stringify(history))
    },
    render: function(){
      this.wraper = $("<div class='search-mid-page'></div>");
      var header = $("<div class='common-search search-style2'></div>");
      var leftArea =  $("<div class='common-search-mid-view'></div>");
      var leftAreaInner =  $("<div class='common-search-left-inner'></div>");
      this.searchInput  = $("<input type='text' placeholder='请输入商品'/>");
      var From = $("<form action='javascript:void(0);' style='display:inline-block;width:85%;'></from>");
      From.append(this.searchInput);
      var _this=this;

      document.body.addEventListener("touchmove",function(e){
            _this.searchInput.blur();
      });



      this.searchInput[0].addEventListener("keydown",function(e){

        if(e.keyCode==13){
          var keyword = _this.searchInput.val()||"";
            _this.hide();
            window.app.searchKey = keyword;
            if(keyword!=""){
              _this.setSearchHistoryItem(keyword);
            }
            Backbone.history.navigate("#home-navigate/product-list", {
              trigger: true
            });
            _this.callback();
            _this.searchInput.val('');
            _this.blur();
        }
      });
      var leftSearchIcon = $("<span class='icomoon-search'></span>");
      leftAreaInner.append(leftSearchIcon).append(From);
      leftArea.append(leftAreaInner);

      var rightArea = $("<div class='common-cancel-right'><span>取消</span></div>");
      var _this=this;
      rightArea.bind('click',function(){
        _this.hide();
      });

      header.append(leftArea).append(rightArea);
      this.historyWrapper = $("<div></div>");

      this.wraper.append(header).append(this.historyWrapper);
      this.$el.append(this.wraper);

      return this;
    },
    hide:function(){
      this.wraper.hide();
      document.body.scrollTop=this.scrollTop||0;
    },


    callback: function(){

    }
  });
});
