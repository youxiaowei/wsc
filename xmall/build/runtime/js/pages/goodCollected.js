define(['./PageView', 'require'], function(PageView, require) {
    return PageView.extend({
        events: {
            "click .header-icon-back": "goback",
            "click .filters-item": "select",
            "click .collector-edit": "edit",
            "click .goods-collector-li": "toDetail",
            "click .good-collected-checkbox": "check",
            "click .goods-collector-circle": "delete",
            "click .good-collected-button": "delete",
        },
        userInfo: null,
        goodsCollection: null,
        cids: [],
        num: 0,
        sortType: "0",
        onRender: function() {
            this.userInfo = window.application.getUserInfo();
            this.$('.default-item')
                .addClass("theme-color");
        },
        goback: function(e) {
            window.history.back();
        },
        onGoodsSuccess: function(res) {
            if(res && res.data && res.data.length == 0) {
                var blankicon = $(
                    "<div class = 'icomoon-withoutcollect add-blank-leaving-icon'></div><div class = 'add-blank-leaving-words'>您还未收藏什么商品哟~</div>"
                );
                this.$el.append(blankicon);
            }
        },
        onGoodsError: function(res) {
            library.Toast("网络出错");
        },
        getGoodsInfo: function() {
            var goodsPath = '/getFavList';
            this.goodsCollection.loadData(this.getAjaxOptions(
                goodsPath, this.userInfo.userid,
                this.sortType, this.onGoodsSuccess.bind(
                    this), this.onGoodsError.bind(
                    this)));
        },
        select: function(e) {
            $('.collector-edit')
                .text('编辑');
            this.$('.good-collected-bottom')
                .hide();
            this.$(".goodCollected-view")
                .css({
                    "padding-bottom": "0"
                });
            this.$('.filters-item')
                .removeClass("theme-color");
            $(e.target)
                .addClass("theme-color");
            var selected_item = $(e.target)
                .attr("class");
            if(selected_item.indexOf("decrease-first-item") >=
                0) {
                this.decrease();
            } else if(selected_item.indexOf(
                    "discount-first-item") >= 0) {
                this.discount();
            } else {
                this.getGoodsInfo();
            }
        },
        decrease: function() {
            this.getGoodsInfo();
        },
        discount: function() {
            this.getGoodsInfo();
        },
        edit: function() {
            if($('.collector-edit')
                .text() == "编辑") {
                $('.collector-edit')
                    .text("完成");
                this.$('.good-collected-bottom')
                    .show();
                this.$(".goods-collector-sell")
                    .css({
                        width: "56%"
                    });
                this.$(".goods-collector-circle")
                    .addClass("icomoon-choicebox");
                this.$(".goods-collector-circle")
                    .show();
                this.$(".goodCollected-view")
                    .css({
                        "padding-bottom": "1.2rem"
                    });
                this.num = $('.goods-collector-circle.icomoon-choice').length;
                this.$(".right-span-num")
                    .text(this.num);
            } else {
                $('.collector-edit')
                    .text("编辑");
                this.$('.good-collected-bottom')
                    .hide();
                this.$(".goods-collector-circle")
                    .removeClass("icomoon-choicebox");
                this.$(".goods-collector-sell")
                    .css({
                        width: "66%"
                    });
                this.$(".goods-collector-circle")
                    .hide();
                this.$(".goodCollected-view")
                    .css({
                        "padding-bottom": "0"
                    });
            }
        },
        check: function(e) {
            if($(e.currentTarget)
                .attr("class")
                .indexOf("theme-color") >= 0) {
                $(e.currentTarget)
                    .removeClass("icomoon-choice")
                    .removeClass("theme-color");
                this.$(".goods-collector-circle")
                    .removeClass("icomoon-choice")
                    .removeClass("theme-color");
                this.num = 0;
                this.$(".right-span-num")
                    .text(this.num);
            } else {
                $(e.currentTarget)
                    .addClass("icomoon-choice")
                    .addClass("theme-color")
                this.$(".goods-collector-circle")
                    .addClass("icomoon-choice")
                    .addClass("theme-color");
                this.num = $('.goods-collector-circle.icomoon-choice').length;
                this.$(".right-span-num")
                    .text(this.num);
            }
            this.cids = [];
            var _this = this;
            $('.goods-collector-circle.icomoon-choice').each(function(index, item){
                _this.cids.push($(item).attr('data-cid'));
            });
        },
        delete: function(e) {
            if($(e.currentTarget) .attr("class") .indexOf("goods-collector-circle") >= 0) {
                if($(e.currentTarget) .attr("class") .indexOf("theme-color") >= 0) {
                    $(e.currentTarget) .removeClass("icomoon-choice") .removeClass("theme-color");
                    this.num = $('.goods-collector-circle.icomoon-choice').length;
                    this.$(".right-span-num")
                        .text(this.num);
                } else {
                    $(e.currentTarget) .addClass("icomoon-choice") .addClass("theme-color");
                    this.num = $('.goods-collector-circle.icomoon-choice').length;
                    this.$(".right-span-num")
                        .text(this.num);
                }
                this.cids = [];
                var _this = this;
                $('.goods-collector-circle.icomoon-choice').each(function(index, item){
                    _this.cids.push($(item).attr('data-cid'));
                });
            } else {
                this.deleteInfo(this.cids);
            }

        },
        getAjaxOptions: function(path, userid, sortType,
            success, error) {
            var options = {
                path: path,
                showLoading: true,
                type: "POST",
                needReset: true,
                data: {
                    userId: userid,
                    sort: sortType
                },
                success: success,
                error: error
            }
            return options;
        },
        toDetail: function(e) {
            if($(e.target)
                .attr("class")
                .indexOf("goods-collector-circle") >= 0) {} else {
                var cid = e.currentTarget.dataset.cid
                var url =
                    "#my-navigate/itemdetail?goodsid=" +
                    cid;
                Backbone.history.navigate(url, {
                    trigger: true
                });
            }
        },
        good_detail: function(e) {
            var cid = e.currentTarget.dataset.cid
            var target = e.currentTarget.className;
            if(e.target.dataset.name == "goods" || e.target
                .dataset.name == "shop") {
                this.deleteInfo(e.target.dataset.name, cid)
            } else {
                if(target == "shop-collector-li") {
                    var url =
                        "#my-navigate/business?shopid=" +
                        cid;
                    Backbone.history.navigate(url, {
                        trigger: true
                    });
                } else if(target == "goods-collector-li") {
                    var url =
                        "#my-navigate/itemdetail?goodsid=" +
                        cid;
                    Backbone.history.navigate(url, {
                        trigger: true
                    });
                }
            }
        },
        deleteInfo: function(cids) {
            if(!cids || cids.length <= 0) {
                library.Toast("请选择要删除的物品");
                return;
            }
            cids = cids.join(',');
            if(!this.baseModel) {
                var BaseModel = require(
                    '../models/BaseModel');
                this.baseModel = new BaseModel();
            }
            var data = {};
            data.userid = this.userInfo.userid;
            //删除商品收藏
            var _this = this;
            var path = "/cancelFav";
            var options = {
                path: path,
                data: {
                    userId : this.userInfo.userid,
                    productIds: cids
                },
                success: function(res) {
                    if(res && res.status == '0') {
                        library.Toast(res.message);
                        _this.getGoodsInfo();
                        _this.edit();
                    } else {
                        library.Toast(res.message);
                    }
                }.bind(this),
                error: function() {
                    library.Toast("操作失败，请重试");
                }.bind(this),
            }
            this.baseModel.loadData(options);
        },
        onResume: function() {
            this.goodsCollection = this.findComponent( 'GoodsCollectorView') .collection;
            this.getGoodsInfo();
            this.toggleBar && this.toggleBar('hide');
            this.$('.bar')
                .show();
        }
    });
});
