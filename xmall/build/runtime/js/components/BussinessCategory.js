/**
 * Created by liuqingling on 15/12/17.
 */
define(['./BaseView','backbone'], function(BaseView,Backbone){


    return BaseView.extend({
        type: 'BussinessCategory',
        jsonData:[
                {id:"1",name:'aaa'},{id:"1",name:'bbb'}
        ],
        render: function(){
            var _this=this;
            this.$el.empty();
            _this.$el.find('.business-goods-wrap').empty();
            //this.$el.addClass("ymall-loading-wrapper");
            this.$el.html(' <div class="business-goods-filter"> <header> <div class="headerbox"> <div  id="category-business-back" class="business-back left-right nav-left"> <span class="icon icomoon-back"></span> </div> <div class="mid business-title" >宝贝分类 </div> </div> </header> <div class="business-contentwrap" > <ul class="business-goods-wrap"> </ul> </div> </div> ');
            //
            //new abc().fetch({'success':function(data){
            _this.$el.find('.business-goods-wrap').append(' <li business-category-index='+'-1'+' class="icomoon-more"> <span>'+'全部商品'+'</span> </li>');

            this.jsonData.forEach(function(it,index){

                    _this.$el.find('.business-goods-wrap').append(' <li business-category-index='+it.id+' class="icomoon-more"> <span>'+it.name+'</span> </li>');
                });
            this.$('#category-business-back').click(function(){
                $("#business-main").css({display:'block'});
                //$("#business-category").css({display:'none'});
                _this.$el.removeClass('business-category-view-show');
                //$(".details-body").css({display:'none'});
            });
            _this.$el.find('.business-goods-wrap li').click(function(e){
                var cid=$(e.currentTarget).attr('business-category-index');
                _this.$el.removeClass('business-category-view-show');
                _this.trigger('bussiness-category',cid);
            });
            //
            //}});
            return this;
        }
    });
});
