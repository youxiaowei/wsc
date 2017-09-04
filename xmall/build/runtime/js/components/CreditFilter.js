// 发票编辑信息组件
define(['./BaseView', 'require', '../models/CreditFilterCondition'], function(
    BaseView, require, CreditFilterCondition) {
    return BaseView.extend({
        type: "CreditFilter",
        initialize: function() {},
        curShow: "",
        leftValue: {},
        rightValue: {},
        firstLoadListView: function(leftvalue, rightvalue) {
            this.leftValue = leftvalue || {
                name: "商城",
                id: ""
            };
            this.rightValue = rightvalue || {
                name: "全部分类",
                id: ""
            };
            this.shoptitle.html(leftvalue.name);
            this.categorytitle.html(rightvalue.name);
            this.pageview.refreshList(leftvalue, rightvalue);
        },
        onRender: function() {
            var cm = new CreditFilterCondition();
            cm.loadData(this.getFilterCondition());
            // this.initData();
        },
        setLeftValue: function(itemData) {
            this.leftValue = itemData;
            this.shoptitle.html(itemData.name);
            this.hide();
            this.pageview.refreshList(itemData, this.rightValue);
        },
        setRightValue: function(itemData) {
            this.rightValue = itemData;
            this.categorytitle.html(itemData.name);
            this.hide();
            this.pageview.refreshList(this.leftValue,
                itemData);
        },
        render: function() {
            var _this = this;
            this.paddingTopView = $(
                "<div class='padding-top-view'></div>");
            this.filterAreaWrapper = $(
                "<div class='cdt-fliter-area-wrapper'></div>"
            );
            var leftArea = $(
                "<div class='cdt-fliter-area cdt-fliter-area-left'></div>");
            this.shoptitle = $("<span></span>");
            leftArea.append(this.shoptitle);
            var rightArea = $(
                "<div class='cdt-fliter-area'></div>");
            this.categorytitle = $("<span></span>");
            rightArea.append(this.categorytitle)
                .append($(
                    "<span class='cdt-fliter-icon icomoon-pullup'></span>"
                ));
            this.leftDetailAreaWrapper = $(
                "<div class='cdt-filter-detail'></div>"
            );
            this.leftDetailArea = $(
                "<div class=' cdt-filter-left-detail'></div>"
            );
            this.rightDetailAreaWrapper = $(
                "<div class='cdt-filter-detail'></div>"
            );
            this.rightDetailArea = $(
                "<div class='cdt-filter-right-detail'></div>"
            );
            this.leftDetailAreaWrapper.append(this.leftDetailArea);
            this.rightDetailAreaWrapper.append(this.rightDetailArea);
            this.bk = $("<div class='cdt-fliter-bk'></div>");
            this.filterAreaWrapper.append(leftArea)
                .append(rightArea);
            // leftArea.bind("click", function() {
            //     _this.paddingTopView.show();
            //     if(_this.curShow == "left") {
            //         _this.hide();
            //         leftArea.removeClass(
            //             "cdt-fliter-item-selected"
            //         );
            //         return;
            //     }
            //     rightArea.removeClass(
            //         "cdt-fliter-item-selected");
            //     leftArea.addClass(
            //         "cdt-fliter-item-selected");
            //     _this.curShow = "left";
            //     _this.showLeft();
            // });
            rightArea.bind("click", function() {
                _this.paddingTopView.show();
                if(_this.curShow == "right") {
                    _this.hide();
                    rightArea.removeClass(
                        "cdt-fliter-item-selected"
                    );
                    return;
                }
                leftArea.removeClass(
                    "cdt-fliter-item-selected");
                rightArea.addClass(
                    "cdt-fliter-item-selected");
                _this.curShow = "right";
                _this.showRight();
            });
            this.bk.bind("click", function() {
                _this.hide();
            });
            this.paddingTopView.bind("click", function() {
                _this.hide();
            })
            this.paddingTopView.hide();
            this.$el.append(this.paddingTopView)
                .append(this.filterAreaWrapper)
                .append(this.bk)
                .append(this.leftDetailAreaWrapper)
                .append(this.rightDetailAreaWrapper);
            return this;
        },
        hasBindData: false,
        getFilterCondition: function() {
            var options = {
                path: "/getCreditFilterCondition",
                type: "POST",
                data: {},
                success: this.onGetConditionSuccess.bind(
                    this),
                error: this.onGetConditionError.bind(
                    this)
            }
            return options;
        },
        onGetConditionSuccess: function(data) {
        	console.log("aaaawwwa"+JSON.stringify(data));
            this.initData(data);
        },
        onGetConditionError: function() {},
        initData: function(filterData) {
            var _this = this;
            filterData = filterData.data || {};
            // filterData = {
            //   sellerlist:[{"name":"三主粮","id":"111"},{"name":"四主粮","id":"222"},{"name":"五主粮","id":"2122"},{"name":"五主粮","id":"2122"},{"name":"五主粮","id":"2122"}],
            //   categorylist:[{"name":"大麦","id":"2222"},{"name":"小麦","id":"2323"},{"name":"大小麦","id":"2323"}]
            // };
            if(this.hasBindData) {
                return;
            }
            //左边的
            var sellerlist = filterData.channelList || [];
            console.log(sellerlist);
            var sellerAll = [{
                "name": "商城",
                "id": ""
            }];
            if(sellerlist[0]){
                this.$el.find('.cdt-fliter-area-left span').text(sellerlist[0].name);
            }
            //sellerlist = sellerAll.concat(sellerlist);
            // for(var i = 0, j = sellerlist.length; i < j; i++) {
            //     var itemData = sellerlist[i];
            //     var shopitem = $(
            //         "<div class='cdt-filter-item'>" +
            //         itemData.name + "</div>");
            //     (function(_shopitem, _itemData, me) {
            //         _shopitem.bind("click", function(e) {
            //             me.setLeftValue(
            //                 _itemData);
            //         });
            //     })(shopitem, itemData, this);
            //     this.leftDetailArea.append(shopitem);
            // }
            var categoryList = filterData.categoryList || [];
            var cateoryALL = [{
                "name": "全部分类",
                "id": ""
            }];
            categoryList = cateoryALL.concat(categoryList);
            for(var i = 0, j = categoryList.length; i < j; i++) {
                var itemData = categoryList[i];
                var categoryitem = $(
                    "<div class='cdt-filter-item'>" +
                    itemData.name + "</div>");
                (function(_categoryitem, _itemData, me) {
                    _categoryitem.bind("click",
                        function(e) {
                            me.setRightValue(
                                _itemData);
                        });
                })(categoryitem, itemData, this);
                this.rightDetailArea.append(categoryitem);
            }
            this.firstLoadListView(sellerlist[0] || {
                "name": "商城",
                "id": ""
            }, {
                "name": "全部分类",
                "id": ""
            });
            this.rightDetailAreaWrapper.append($(
                "<div class='cdt-filter-bottom'></div>"
            ));
            this.leftDetailAreaWrapper.append($(
                "<div class='cdt-filter-bottom'></div>"
            ));
            this.hasBindData = true;
        },
        show: function() {
            this.$el.addClass("cdt-fliter-show");
            this.filterAreaWrapper.css({
                "z-index": 10
            });
            this.bk.css({
                "display": "block"
            });
            this.paddingTopView.show();
        },
        hideLeft: function() {
            this.leftDetailAreaWrapper.css({
                "display": "none"
            });
        },
        hideRight: function() {
            this.rightDetailAreaWrapper.css({
                "display": "none"
            });
        },
        showLeft: function() {
            this.show();
            this.hideRight();
            this.leftDetailAreaWrapper.css({
                "display": "block"
            });
        },
        showRight: function() {
            this.show();
            this.hideLeft();
            this.rightDetailAreaWrapper.css({
                "display": "block"
            });
        },
        hide: function() {
            this.filterAreaWrapper.css({
                "z-index": 1
            });
            this.curShow = "";
            this.hideLeft();
            this.hideRight();
            this.$el.removeClass("cdt-fliter-show");
            document.body.scrollTop = document.getElementById(
                    "cdt-top-view")
                .offsetHeight;
            this.bk.css({
                "display": "none"
            });
            this.paddingTopView.hide();
        }
    });
});
