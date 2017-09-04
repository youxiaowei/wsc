define(['./PageView', 'require'], function(PageView, require) {
    return PageView.extend({
        type: 'shopingcart',
        events: {
            "click .goback": "goBack",
            "click .goToShopping": "goHome",
            "click .unlogin_tips_btn": "goLogin",
            "click .shopingcart-settlement": "onClickBuy",
            "click .shopingcart-choicebox-all": "onSelectedAll",
            "click .shopingcart-goods-edit-spec": "editCartItem",
            "click .shopingcart-goods-delete": "deleteItem",
            "click .icomoon-moremore": "menuMore",
            "click .shopingcart-goods-listitem": "cartItemClick"
        },
        shopListView: null,
        userid: null,
        listViewType: 0,
        orderconfirmeflag:0,
        initialize: function() {
            this.userid = window.application.getLocalStorage( "userid");
            this.shopListView = this.findComponent( 'shopingcartlistview');
            this.listenTo(this.findComponent('PopupMenu'), "toSearch", this.toSearch.bind(this));
        },
        toSearch: function(e) {
            this.findComponent("SearchMidPageView") .show();
        },
        render: function() {
            PageView.prototype.render.apply(this, arguments);
            return this;
        },
        menuMore: function(e) {
            this.findComponent("PopupMenu") .show();
        },
        cartItemClick: function(e) {
            if(this.listViewType == 1) return;
            var targetView = $(e.target);
            if(targetView.hasClass( "shopingcart-choicebox-goods")) return;
            if(targetView.hasClass( "shopingcart-goods-edit-btn-plus")) return;
            if(targetView.hasClass( "shopingcart-goods-edit-btn-minus")) return;
            if(targetView.hasClass( "shopingcart-goods-edit-spec")) return;
            if(targetView.hasClass( "shopingcart-goods-delete")) return;
            if(targetView.hasClass( "shopingcart-goods-edit-input")) return ;
            if(targetView.hasClass("icomoon-spread")) return ;
            var itemView = $(e.currentTarget);
            var goodsId = itemView.attr("data-pid");
            if(goodsId) {
                Backbone.history.navigate( "#shopingcart-navigate/itemdetail?goodsid=" + goodsId, {
                    trigger: true
                });
            }
        },
        onResume: function() {
            $('#shopingcart-ed')
                .removeClass('active')
                .text('编辑');
            $('.shopingcart-footer').show();
            $('.shopingcart-manage').hide();
            var page_type = application.getQueryString( 'back');
            if(page_type == "true") {
                this.toggleBar && this.toggleBar('hide');
                $('#shopingcart-back')
                    .css("display", "table-cell");
            } else {
                this.toggleBar && this.toggleBar('show');
                $('#shopingcart-back')
                    .css("display", "none");
            }
            this.shopListView.initData($('.shopingcart-ed') .text() == "完成");
            this.updateBottom();
            
        },
        updateBottom: function() {
            if(window.location.href.indexOf('back=true') > 0) {
                $('.shopingcart-manage')
                    .css('bottom', '0');
                $('.shopingcart-footer')
                    .css('bottom', '0');
                this.$('.push-for-you')
                    .css('padding-bottom', '2.2rem');
            } else {
                $('.shopingcart-manage')
                    .css('bottom', '1.2rem');
                $('.shopingcart-footer')
                    .css('bottom', '1.2rem');
                this.$('.push-for-you')
                    .css('padding-bottom', '2.2rem');
            }
            this.setTotal();
        },
        onRender: function() {
            this.isRender = true;
            this.updateBottom();
            this.initDataFinished();
            var _this = this;
            //头部的按钮只能初始化一次
            _this.$el.find('.shopingcart-ed') .click(function() {
                if($(this) .hasClass('active')) {
                	orderconfirmeflag=0;
                    _this.updateCart();
                    $(this) .removeClass('active');
                    $(this) .text('编辑');
                    _this.listViewType = 0;
                    $('.shopingcart-goods-edit') .hide();
                    $( '.shopingcart-goods-details-info-show' ) .show();
                    $('.shopingcart-manage') .hide();
                    if($('.ShopingcartListView') .html()) {
                        $('.shopingcart-footer') .show();
                    } else {
                        $('.shopingcart-footer') .hide();
                    }
                    $('.shopingcart-goods-details-title').css(
                    		{"-webkit-line-clamp":"2","right":"0rem"}
                    		);
                    _this.updateBottom();
                    _this.updateShoppingCartNum();
                    _this.findComponent( "PushForYouView") .$el.show();
                    $("#shopingcartlistview") .css({ "margin-bottom": "0" });
                } else {
                	orderconfirmeflag=1;
                    //点击编辑
                    $(this) .addClass('active');
                    $(this) .text('完成');
                    _this.listViewType = 1;
                    $('.shopingcart-goods-edit') .show();
                    $( '.shopingcart-goods-details-info-show' ).show();
                    $('.shopingcart-manage') .show();
                    $('.shopingcart-footer') .hide();
                    $('.shopingcart-goods-details-title').css(
                    		{"-webkit-line-clamp":"1","right":"1.2rem"}
                    		);
                    _this.updateBottom();
                    _this.findComponent( "PushForYouView") .$el.hide();
                    $("#shopingcartlistview") .css({ "margin-bottom": "2.7rem" })
                }
            });
           
        },
        updateShoppingCartNum:function(){
            var newData = this.shopListView.collection.toJSON();
            var oldData = this.shopListView.cartListData;
            var userInfo = window.application.getUserInfo();
            for (var i = 0; i < newData.length; i++) {
                if(oldData && oldData[i].number && oldData[i].number != newData[i].number){
                    var options = {
                        path: '/modifyCart',
                        type: 'POST',
                        data: {
                            userId: userInfo.userid,
                            cartId: newData[i].cartId,
                            productId: newData[i].productId,
                            number: newData[i].number
                        },
                        showLoading: false,
                        success: this.updateNumSuccess.bind(this),
                        error: this.updateNumError.bind(this)
                    };
                    this.updateData(options);
                }
            }
        },
        updateNumSuccess: function(){

        },
        updateNumError: function(){

        },
        editCartItem: function(e) {
            // library.Toast("正在开发中...");
            // return;
            var itemView = $(e.target)
                .parents(".shopingcart-goods-listitem");
            var cid = itemView.attr("data-index");
            var itemModel = this.shopListView.collection.find({
                cartId: cid
            });
            this.findComponent("CartEditorView")
                .show(itemModel, this.editItemResult.bind(
                    this));
            $(e.target)
                .addClass("icomoon-spread-close");
        },
        getSpecEditData: function(itemModel) {
            console.log(itemModel.productSpec);
            data = {
                spec1: [],
                spec2: []
            };
            // TODO 这里的数据需要修正
            data.image = itemModel.imgurl;
            data.price = itemModel.price;
            data.spec1.push({
                id: 123,
                name: "白色"
            });
            data.spec1.push({
                id: 143,
                name: "黑色"
            });
            data.spec1.push({
                id: 133,
                name: "驼色"
            });
            data.spec2.push({
                id: 123,
                name: "35"
            });
            data.spec2.push({
                id: 143,
                name: "36"
            });
            data.spec2.push({
                id: 133,
                name: "37"
            });
            data.spec2.push({
                id: 136,
                name: "38"
            });
            return data;
        },
        editItemResult: function() {
            $(".icomoon-spread") .removeClass("icomoon-spread-close");
        },
        initDataFinished: function() {
            this.initView();
        },
        initView: function() {
            var _this = this;
            _this.$el.find('.shopingcart-choicebox-manage')
                .click(function() {
                    if($(this) .hasClass('icomoon-choice')) {
                        $(this) .removeClass( 'icomoon-choice') .removeClass('theme-color');
                        _this.$el.find( '.shopingcart-choicebox-store' )
                            .removeClass( 'icomoon-choice')
                            .removeClass('theme-color');
                        _this.$el.find( '.shopingcart-choicebox-goods' )
                            .removeClass( 'icomoon-choice')
                            .removeClass('theme-color');
                    } else {
                        $(this) .addClass('icomoon-choice') .addClass('theme-color');
                        _this.$el.find( '.shopingcart-choicebox-store' )
                            .addClass('icomoon-choice')
                            .addClass('theme-color');
                        _this.$el.find( '.shopingcart-choicebox-goods' )
                            .addClass('icomoon-choice')
                            .addClass('theme-color');
                    }
                });
            _this.$el.find('.shopingcart-manage-delete')
                .click(function() {
                    var choiceLength = $( '.shopingcart-choicebox-goods.icomoon-choice.theme-color' ) .length;
                    if(choiceLength == 0) {
                        library.Toast("您还没有选择商品哦！", 1000);
                    } else {
                        library.MessageBox("提示信息",
                            "确定要删除这" + choiceLength +
                            "种商品吗？", [{
                                leftText: "确定",
                                callback: function() {
                                    var
                                        cartIds = [];
                                    $( '.shopingcart-choicebox-goods' ) .each( function() {
                                            if( $( this ) .hasClass( 'icomoon-choice' ) ) {
                                                var cartid = $( this ) .parents( '.shopingcart-goods-listitem' ) .attr( 'data-index' );
                                                cartIds .push( cartid );
                                            }
                                        }
                                    );
                                    _this.deleteCart( cartIds );
                                }
                            }, {
                                rightText: "取消",
                                callback: function() {}
                            }]
                        );
                    }
                });
            _this.$el.find('.shopingcart-manage-collection')
                .click(function() {
                    var choiceLength = $( '.shopingcart-choicebox-goods.icomoon-choice.theme-color' ) .length;
                    if(choiceLength == 0) {
                        library.Toast("您还没有选择商品哦！", 1000);
                    } else {
                        library.MessageBox("提示信息",
                            "确定要将这" + choiceLength +
                            "种移入我的收藏？", [{
                                leftText: "确定",
                                callback: function() {
                                    var cartIds = [];
                                    $( '.shopingcart-choicebox-goods' ) .each( function() {
                                            if( $( this ) .hasClass( 'icomoon-choice' ) ) {
                                                var cartid = $( this ) .parents( '.shopingcart-goods-listitem' ) .attr( 'data-index' );
                                                cartIds .push(
                                                        cartid
                                                );
                                            }
                                        }
                                    );
                                    _this.moveCollection( cartIds );
                                    _this.deleteCart( cartIds );
                                }
                            }, {
                                rightText: "取消",
                                callback: function() {}
                            }]
                        );
                    }
                });
        },
        deleteItem: function(e) {
            var _this = this;
            library.MessageBox("提示信息", "确定要删除吗？", [{
                leftText: "确定",
                callback: function() {
                    var cartId = $(e.target)
                        .parents(
                            ".shopingcart-goods-listitem"
                        )
                        .attr("data-index");
                    var ids = [];
                    ids.push(cartId);
                    _this.deleteCart(ids);
                }
            }, {
                rightText: "取消",
                callback: function() {}
            }]);
        },
        baseModel: null,
        deleteCart: function(cartIds) {
            if(!cartIds || cartIds.length <= 0) {
                library.Toast("请选择要删除的物品");
                return;
            }
            cartIds = cartIds.join(',');
            var _this = this;
            var userInfo = window.application.getUserInfo();
            var options = {
                path: '/deleteCart',
                type: 'POST',
                data: {
                    userId: userInfo.userid,
                    cartIds: cartIds
                },
                showLoading: true,
                success: this.deleteSuccess.bind(this),
                error: this.deleteError.bind(this)
            };
            this.updateData(options);
            
        },
        deleteSuccess: function(res) {
            if(res && res.status == 0) {
                library.Toast(res.message || "删除成功");
                this.shopListView.initData(true);
                this.updateshoppingcart();
            }
        },
        deleteError: function(res) {
            library.Toast(res ? res.message : "操作失败，请重试");
        },
        //微商城中购物车列表没有移入收藏
        moveCollection: function(cartIds) {
            if(!cartIds || cartIds.length <= 0) {
                library.Toast("请选择要收藏的物品");
                return;
            }
            var userInfo = window.application.getUserInfo();
            cartIds = cartIds.join(',');
            var options = {
                path: '/collect-products',
                type: 'POST',
                data: {
                    productid: cartIds,
                    userid: userInfo.userid
                },
                showLoading: true,
                success: this.moveSuccess.bind(this),
                error: this.moveError.bind(this)
            };
            this.updateData(options);
        },
        moveSuccess: function(res) {
            if(res && res.status == 'ok') {
                //library.Toast(res.message || "收藏成功");
                library.Toast("收藏成功");
                if(!this.shopListView.cartListData.length) {
                    this.shopListView.initData();
                    $('.shopingcart-manage')
                        .hide();
                    $('#shopingcart-ed')
                        .removeClass('active')
                        .text('编辑');
                }
            }
        },
        moveError: function(res) {
            library.Toast(res ? res.message : "操作失败，请重试");
        },
        updateData: function(options) {
            if(!this.baseModel) {
                var BaseModel = require(
                    '../models/BaseModel');
                this.baseModel = new BaseModel();
            }
            this.baseModel.loadData(options);
        },
        updateCart: function() {
            // var carts = [];
            // for(var key in this.shopListView.cartInfo){
            //   carts.push(this.shopListView.cartInfo[key]);
            // }
            // var temp = {
            //   carts:JSON.stringify(carts)
            // }
            // if(carts.length > 0){
            //   var options = {
            //     path: '/modifyCart',
            //     type: 'POST',
            //     data: {
            //       carts: JSON.stringify(temp)
            //     },
            //     showLoading:true,
            //     success:this.updateCartSuccess.bind(this),
            //     error:this.updateCartError.bind(this)
            //   };
            //   this.updateData(options);
            // }
            this.completeUpdate();
        },
        updateCartSuccess: function(res) {
            if(res && res.status == 'ok') {
                library.Toast(res.message || "操作成功");
                this.shopListView.initData(true);
                this.updateshoppingcart();
            }
            this.completeUpdate();
        },
        updateCartError: function(res) {
            library.Toast(res.message || "操作失败，请重试");
            this.completeUpdate();
        },
        completeUpdate: function() {
            //点击完成
            $('.shopingcart-ed')
                .removeClass('active')
                .text('编辑');
            $('.shopingcart-goods-edit')
                .hide();
            $('.shopingcart-goods-details-info-show')
                .show();
            $('.shopingcart-manage')
                .hide();
            $('.shopingcart-footer')
                .show();
            this.shopListView.cartInfo = {}; // 清空需要更新的购物车
        },
        goBack: function(e) {
            window.history.back();
        },
        goHome: function() {
            window.location.href = '#home-navigate';
            //var url = "#home-navigate";
            //Backbone.history.navigate(url, {
            //    trriger:true
            //});
        },
        goLogin: function() {
            var url = "#shopingcart-navigate/login";
            Backbone.history.navigate(url, {
                trigger: true
            });
        },
        createOrderItem: function(data) {
            var item = {};
            item.itemNumber = data.number;
            item.type = data.type;
            item.spec = data.spec;
            item.name = data.name;
            item.cartId = data.cartId;
            item.goodsId = data.productId;
            // FIXME 商品组id需要接口返回,没有返回时下单不成功
            item.itemId = data.itemid || "";
            item.tradePrice = data.price;
            item.totalPrice = item.tradePrice;
            item.imgurl = data.image;
            return item;
        },
        onSelectedAll: function() {
            var choicelength = $('.icomoon-choicebox')
                .length;
            if($('.icomoon-choice')
                .length < choicelength) {
                this.$('.icomoon-choicebox')
                    .addClass('icomoon-choice')
                    .addClass('theme-color');
            } else {
                this.$('.icomoon-choicebox')
                    .removeClass('icomoon-choice')
                    .removeClass('theme-color');
            }
            this.updateBottom();
        },
        onClickBuy: function(e) {
            var _this = this;
            var shops = [];
            var cartid = [];
            var choiceLength = 0;
            $('.shopingcart-item')
                .each(function(index) {
                    var itemdom = $(
                        '.shopingcart-choicebox-goods.icomoon-choice.theme-color'
                    );
                    choiceLength = itemdom.length;
                    if(choiceLength == 0) {
                        library.Toast("您还没有选择商品哦！",
                            1000);
                    } else {
                        var cartListData = _this.shopListView.collection.toJSON();
                        //商店数据
                        var shopItem = cartListData[index];
                        var shopInfo = {};
                        //shopInfo.shopId = shopItem.shopid;
                        shopInfo.shopName = shopItem.shopname;
                        shopInfo.postage = '065201';
                        shopInfo.items = [];
                        var cartid = shopItem.cartId;
                        if($( '.shopingcart-goods-listitem[data-index="' + cartid + '"]')
                            .find( '.shopingcart-choicebox-goods' )
                            .hasClass('icomoon-choice')
                        ) {
                            shopInfo.items.push(_this.createOrderItem( shopItem));
                        }
                        if(shopInfo.items.length > 0) {
                            shops.push(shopInfo);
                        }
                    }
                });
            if(choiceLength) {
                window.app.shopsOrder = shops;
                console.log("====>>>");
                console.log(shops);
                Backbone.history.navigate( "#shopingcart-navigate/create-order", { trigger: true });
            }
        },
        updateshoppingcart: function() {
            var shopmodel = require('../models/BaseModel');
            var userInfo = window.application.getUserInfo();
            var userInfo = userInfo.userid;
            var shoppingcart = new shopmodel();
            var options = {
                url: window.app.api + '/shoppingcart',
                type: "GET",
                needReset: true,
                data: {
                    userid: userInfo
                },
                success: function(res) {
                    var data = res.data;
                    var num = 0;
                    _.map(data, function(index) {
                        _.map(index.productList, function( index) {
                            num = num + index .number;
                         })
                    })
                    var userInfo = window.application.getUserInfo();
                    userInfo.cartNumber = num;
                    window.application.setLocalStorage( 'userinfo', userInfo);
                },
                error: function() {
                    //请求出错处理
                }
            };
            // shoppingcart.loadData(options);
            
        },
        //传店铺父级Item对象
        setTotal: function() {
            var total = 0;
            $( '.shopingcart-choicebox-goods.icomoon-choice.theme-color' )
                .each(function() {
                    //获取价钱
                    var price = parseFloat($(this)
                        .parent()
                        .find( '.shopingcart-goods-details-unit-price' )
                        .attr("data-price"));
                    //获取数量
                    var number = parseInt($(this)
                        .parent()
                        .find( '.shopingcart-goods-edit-input' )
                        .val());
                    total += (price * 100) * number;
                });
            total = total / 100.0;
            $('.shopingcart-info-total-price')
                .text("¥" + total);
        }
    });
});
