define(['./ListView'], function(ListView){

  return ListView.extend({
      jsonData:{
          "shopName" : "",
          "shopIcon" : "",
          "shopDec":"",
          "companyName":"",
          "companyArea":"",
          "companyAddr":"",
          "contact":"",
          "phone":"",
          "feature":""
      },
    type: 'Detailslist',
    render: function(){
        for (var x in this.jsonData){

            if(!this.jsonData[x]){
                this.jsonData[x]='这家伙很懒什么都没留下';
            }
        }
        this.$el.empty();
        var html='<header>'+
        '<div class="headerbox">'+
            '<div  id="d-business-back" class="business-back left-right nav-left">'+
            '<span class="icon icomoon-back"></span>'+
            '</div>'+
            '<div class="mid business-title" >'+
            '店铺详情'+
            '</div>'+
            '</div>'+
            '</header>';

      var iconHtml = "<a href='tel:"+ this.jsonData.phone +"'><span class='details-list-li-icon icomoon-phone'></span></a>";
          html+= '<div class="details-header">';
          html+= '<img class="details-icon" src="'+ this.jsonData.shopIcon +'" alt="'+ this.jsonData.shopName +'"/>';
          html+= '<span class="details-name">'+ this.jsonData.shopName +'</span>';
          html+= '<div style="clear:both"></div></div><div class="details-list"><ul>';
          html+= "<li class='details-list-li'><span class='details-list-li-left'>公司名称</span><span class='details-list-li-right'>"+this.jsonData.companyName+"</span></li>";
          html+= "<li class='details-list-li'><span class='details-list-li-left'>所在地区</span><span class='details-list-li-right'>"+this.jsonData.companyArea+"</span></li>";
          html+= "<li class='details-list-li'><span class='details-list-li-left'>详细地址</span><span class='details-list-li-right'>"+this.jsonData.companyAddr+"</span></li>";
          html+= "<li class='details-list-li'><span class='details-list-li-left'>联系人</span><span class='details-list-li-right'>"+this.jsonData.contact+"</span></li>";
          html+= "<li class='details-list-li'><span class='details-list-li-left'>联系电话</span><span class='details-list-li-right'>"+this.jsonData.phone+"</span>"+ iconHtml +"</li>";
          html+= '</ul></div>';
      this.$el.html(html);  //  this.el就是HTML节点，通过jQuery的html方法填充内容
        this.$('#d-business-back').click(function(){
            $('.business-detailslist-view').removeClass('business-detailslist-view-show');
            /*$("#business-main").css({display:'block'});
            $("#business-category").css({display:'none'});
            $(".details-body").css({display:'none'});*/
        });
      return this;
    },
    getCollection: function(){
      return this.collection;
    }
  });
});
