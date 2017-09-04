//地址选择页
define(['./PageView','require'], function(PageView,require){
  return PageView.extend({
    list:{

    },
    type:"1",
    events:{
          'click .header-icon-back': 'onBack',
         
    },
    
    initialize: function(){
      
    },
    onRender:function(){
      
    },
    onResume: function(){

    	this.type = application.getQueryString("type");
      var title = "选择省份";
      switch (this.type) {
        case "1":
          title = "选择省份";
          this.list= localStorage.getItem('provinceList');
          break;
        
        case "2":
          title = "选择城市";
          this.list=localStorage.getItem('cityList');
          break;
        case "3":
        title = "选择区县";
          this.list=localStorage.getItem('areaList');
        break;
      
        default:
          title = "选择省份";
          this.list= localStorage.getItem('provinceList');
          break;
      }
      
     
      this.$el.find(".title").text(title);
      this.showlist();
    },
    showlist:function(){
      var liststr = this.list;
      var list = JSON.parse(liststr);
      if(list &&list.length>0){
        this.$el.find(".selectList").html("");
        var html ="<div class='region'><ul>";
        for(var i=0;i<list.length;i++){ 
          html+='<li class="selectItem" value=' + list[i].id + '>' + list[i].name + '</li>';
        }
        html +='</ul></div>';
        this.$el.find(".selectList").append(html);
      }
      var _this= this;
      this.$el.find(".selectItem").bind('click', function(e) {
         var str= e.currentTarget.attributes.value.nodeValue;
         var name = e.currentTarget.innerText;
         var address = {
           id:str,
           name:name,
           type:_this.type
         }
         window.app.address= address;
         window.history.back();
      });

    },
       
    onBack: function(){
      window.history.back();
    },   
  });
});
