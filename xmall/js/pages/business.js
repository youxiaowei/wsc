/**
 * Created by liuqingling on 15/11/28.
 */
//{
//    shopid:'',
//    bannerurl:"",
//    shopname:'',
//    shoplog:"",
//   isCollected:false
//   allproductlist:[
//  ]
//}
define(['./PageView','../models/BusinessModle','require'], function(PageView,BusinessModle,require) {

    return PageView.extend({
        events: {
            "click .home-goods-box": "goDetails",
            "click .header-box-mid-inner": "toSearch",

        },
        toSearch:function(){
            this.findComponent("searchMidPageView").show();
        },
        isload:false,
        BusinessModle:new BusinessModle(),

        initialize:function(){
            this.listenTo(this.BusinessModle,'bussiness-update',this.updateui);
            this.listenTo(this.findComponent('business-category'),'bussiness-category',this.onCategory);
        },
        onCategory:function(cid){
            console.log(cid);
            if(cid==-1){
                this.$el.find('li[business-index="0"]').trigger('click',{
                    shopid:window.application.getQueryString('shopid'),
                });
            }else{
                this.$el.find('li[business-index="0"]').trigger('click',{
                    shopid:window.application.getQueryString('shopid'),
                    categoryid:cid
                });
            }

        },
        updateui:function(){
            //更新搜藏
            if(this.BusinessModle.get('iscollected')){
               $('.business-collect').addClass('theme-color');
            }
            $('.business-brandinfo img').attr('src',this.BusinessModle.get('shoplogo'));
            $('.business-shop p').text(this.BusinessModle.get('shopname'));
            this.$el.find("#business-bottom-contact a").attr("href","tel:" + this.BusinessModle.get('tel'));
            $('.logo-wrap').css({'background-image':"url("+this.BusinessModle.get('banner')+")"});
        },
        render: function() {
            PageView.prototype.render.apply(this, arguments);
            return this;
        },
        onRender:function(){
            var me=this;
            $('.add-blank-leaving-icon').removeClass("icomoon-wait").removeClass("add-blank-leaving-icon");
            $('.add-blank-leaving-words').text("").removeClass("add-blank-leaving-words");
            $(".business-product").show();
            this.findComponent('business-category').$el.addClass('business-category-view');
            this.$el.find('#business-bottom-category').click(function(){
              me.findComponent('business-category').$el.addClass('business-category-view-show');
                //$('.business-category-view').addClass('business-category-view-show');
                /*me.$('#business-category').css({display:"block"});
                me.$('#business-main').css({display:"none"});*/
            });
            this.$el.find('.business-collect').click(function(e){
                    if(me.$(e.currentTarget).hasClass('theme-color')){
                        library.Toast('您已经收藏');
                        return;
                    }
                var uid=JSON.parse(window.localStorage.getItem("userinfo"));
                if(uid){


                     var options = {
                        url:window.app.api+'/collect-shop',
                        type: "POST",
                        needReset:true,
                        data:{userid:uid.userid,shopid:window.application.getQueryString('shopid')},
                        datatype: "json",
                        success:function (res) {
                                  console.log(res);
                                  if(res.status=='ok'){

                                  me.$('.business-collect').addClass('theme-color');

                                    library.Toast(res.data);
                                  }

                                },
                        error:function () {
                            //请求出错处理
                             }
                      }

                      if (!this.baseModel) {
                        var BaseModel = require('../models/BaseModel');
                        this.baseModel = new BaseModel();
                      }
                      this.baseModel.loadData(options);

                }else{
                    library.Toast("请先登录");
                }


            });
            this.$el.find('.business-tab li').click(function(e,p){
                me.$('.business-tab li').removeClass('theme-color');
                me.$(e.currentTarget).addClass('theme-color');
                var tab=me.$(e.currentTarget).attr('business-index');
                if(tab==0){

                    me.$("#allproducts").css({display:'block'});
                    me.$("#newproducts").css({display:'none'});
                    //type:0是获取所有商铺,type:1是获取新品上市的商铺
                    if(p&&p.shopid&&!p.categoryid) {
                        me.newColletion = me.findComponent('allproducts').getCollection();

                        me.newColletion.loadData({
                            path: '/shop-productlist',
                            data: {shopid: p.shopid, type: 0, pageindex: 1,pagesize:10,sorttype:0},
                            needReset: true,
                            showLoading: true,
                            type: 'GET',
                            //success:this.onSuccess.bind(this),
                            //error:this.onError.bind(this)
                        });
                    }else if(p&&p.shopid&&p.categoryid){
                        me.newColletion = me.findComponent('allproducts').getCollection();

                        me.newColletion.loadData({
                            path: '/getgoodsbyshopcategory',
                            data: {categoryid: p.categoryid,pageindex: 1,pagesize:10,sorttype:0},
                            needReset: true,
                            showLoading: true,
                            type: 'GET',
                            //success:this.onSuccess.bind(this),
                            //error:this.onError.bind(this)
                        });
                    }
                }else{
                    me.$("#allproducts").css({display:'none'});
                    me.$("#newproducts").css({display:'block'});
                    if(p&& p.shopid) {
                        me.newColletion = me.findComponent('newproducts').getCollection();

                        me.newColletion.loadData({
                            path: '/shop-productlist',
                            data: {shopid: p.shopid, type: 1, pageindex: 1,pagesize:10,sorttype:0},
                            needReset: true,
                            showLoading: true,
                            type: 'GET',
                            //success:this.onSuccess.bind(this),
                            //error:this.onError.bind(this)
                        });
                    }
                }
            });

            this.$el.find('#business-main .nav-left').click(function(){

                window.history.back();
            });
            this.$el.find('.nav-right').click(function(){
                //me.$('#business-category').css({display:"block"});
                me.findComponent('business-category').$el.addClass('business-category-view-show');
                //$('.business-category-view').addClass('business-category-view-show');
                //me.$('#business-main').css({display:"none"});
                //if(me.$el.find('.table-view').length>0){
                //    me.$el.find('.table-view').attr('class','bussiness-horizontal-view');
                //}else{
                //    me.$el.find('.bussiness-horizontal-view').attr('class','table-view');
                //}
            });

            this.$el.find("#business-bottom-detail").click(function(){
                $('.business-detailslist-view').addClass('business-detailslist-view-show');
                /*me.$el.find("#business-main").css({display:'none'});
                me.$el.find("#business-category").css({display:'none'});
                me.$el.find(".details-body").css({display:'block'});*/
            });

            //this.listenTo(this.BusinessModle,'hello',this.updateui);
            //this.BusinessModle.fetch({'success':function(){
            //    me.updateui();
            //}});
            this.$el.find('li[business-index="1"]').trigger('click',{shopid:window.application.getQueryString('shopid')});
            this.$el.find('li[business-index="0"]').trigger('click',{shopid:window.application.getQueryString('shopid')});
        },
        init:function(){
            var shopid=window.application.getQueryString('shopid');
            var _this = this;

              var options1 = {

                    url:window.app.api+'/shop',
                    type: "GET",
                    needReset:true,
                    data:{shopid:shopid},
                    datatype: "json",
                    success:function (res) {
                                console.log(res);
                                if(res.status=='ok'){
                                    _this.BusinessModle.set(res.data);
                                    _this.BusinessModle.trigger('bussiness-update');
                                }

                             },
                    error:function () {
                        //请求出错处理
                         }
                  }

                  if (!this.baseModel) {
                    var BaseModel = require('../models/BaseModel');
                    this.baseModel = new BaseModel();
                  }
                  window.setTimeout(function(){
                    _this.baseModel.loadData(options1);
                  },300);

//获取店铺详情
            var options2 = {

                    url:window.app.api+'/getshopinfo',
                    type: "GET",
                    needReset:true,
                    data:{shopid:shopid},
                    datatype: "json",
                    success:function (res) {
                            console.log(res);
                            if(res.status=='ok'){
                                var detailist=  _this.findComponent("business-detailslist");
                                detailist.jsonData=res.data;
                                detailist.render();

                                // _this.BusinessModle.set(res.data);
                            }

                        },
                    error:function () {
                        //请求出错处理
                         }
                  }

                  if (!this.baseModel) {
                    var BaseModel = require('../models/BaseModel');
                    this.baseModel = new BaseModel();
                  }

                  window.setTimeout(function(){
                    _this.baseModel.loadData(options2);
                  },300);

              var options3 = {

                    url:window.app.api+'/getshopcategory',
                    type: "GET",
                    needReset:true,
                    data:{shopid:shopid},
                    datatype: "json",
                    success:function (res) {
                            console.log(res);
                            if(res.status=='ok'){
                                var detailist=  _this.findComponent("business-category");
                                detailist.jsonData=res.data;
                                detailist.render();
                                // _this.BusinessModle.set(res.data);
                            }
                        },
                    error:function () {
                        //请求出错处理
                         }
                  }

                  if (!this.baseModel) {
                    var BaseModel = require('../models/BaseModel');
                    this.baseModel = new BaseModel();
                  }

                  window.setTimeout(function(){
                    _this.baseModel.loadData(options3);
                  },300);

        },
        onResume:function(){
            PageView.prototype.onResume.apply(this, arguments);
            this.init();
        },


    });

});
