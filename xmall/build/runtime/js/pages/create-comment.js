define(['require', './PageView'], function(require,PageView) {
    return PageView.extend({
        type: 'create-comment',
        events: {
            "click .header-icon-back": "goBack",
            "click .header-icon-menu": "menuMore",
            "click img": "imgClick",
            "click .level-item": "commentLevel",
            'click .evaluate-star': 'makeStar',
            "click .look-order": "goBack",
            "click .back-home": "goHome",
            "click .create-comment-btn": "submitComment"
        },
        order: null,
        orderType:null,
        productList: null,
        product: null,
        imgArray: [],
        editItem: null,
        level:null,
        initialize: function() {
            this.listenTo(this.findComponent('PopupMenu'),
                "toSearch", this.toSearch.bind(this));
        },
        menuMore: function(e) {
            this.findComponent("PopupMenu")
                .show();
        },
        toSearch: function(e) {
            this.findComponent("SearchMidPageView")
                .show();
        },
        goBack: function() {
            window.history.back();
        },
        goHome: function() {
            Backbone.history.navigate('#home-navigate/home', {
                trigger: true
            });
        },
        toDetail: function() {
            var orderId = this.order.get('orderId');
            Backbone.history.navigate(
                "#my-navigate/order-detail?" + orderId, {
                    trigger: true
                });
        },
        submitComment: function(e) {
        	
            if(!this.$(".level-item").hasClass("level-item-selected")){
            	library.Toast("请选择评价态度");
            	return false;
            }
            if(!this.$(".comment-content-text").val()){
            	library.Toast("请输入评价内容");
            	return false;
            }
            var arr= this.$(".comment-content-text").val();
            var reg = /^[\u4e00-\u9fa50-9A-Za-z]{10,200}$/;
            if(!reg.test(arr)){
            	library.Toast("评价内容在10~200之间");
            	return false;
            }
            var BaseModel = require('../models/BaseModel');
            var baseModel = new BaseModel();
            var cont = this.$(".comment-content-text").val();
            _this = this;
            var orderId;
            var productId;
            var list;
            if(this.orderType =='10200'){
            	this.order = window.app.waitCommentOrder;
            	this.productList=this.order;
            	orderId=this.productList[0].orderId;
            	productId=this.productList[0].productId;
            	list=this.productList;
            }else{
            	var pro = (this.order.get("productList"));
            	orderId=this.order.get("orderId");
            	productId=pro[0].productId;
            	list=this.pro;
            }
            var userInfo = window.application.getUserInfo();
            var options = {
                type: "POST",
                path: "/addComment",
                data: {
                    userId: userInfo.userid,
                    commentList:list ,
                    productId: productId,
                    orderId:  orderId,
                    level: _this.level,
                    commentContent: cont ? cont : "无"
                },
                showLoading:true,  //显示加载图
                datatype: "json", //"xml", "html", "script", "json", "jsonp", "text".
                success: function(res){
                	_this.$("#create-comment-info")
                     .hide();
                	_this.$(".create-comment-btn")
                         .hide();
                	_this.$(".create-comment-success")
                     .show();
                },
                error: function(){
                    library.Toast("网络错误");
                }
            };
             baseModel.loadData(options);


            // $(".create-comment-info")
            //     .hide();
            // $(".create-comment-success")
            //     .show();
            // $(".create-comment-btn")
            //     .hide();

        },
        makeStar: function(e) {
            var _this = this;
            //返回父元素
            var _parent = $(e.currentTarget)
                .parent();
            var _parents = $(e.currentTarget)
                .parents('.evaluate-goods-marking')
                .next('.evaluate-goods-comment');
            var _star = $(e.currentTarget)
                .data('star');
            //设置星标值
            _parents.attr('data-star', _star);
            //移除所有选中元素
            _parent.find('.evaluate-star')
                .removeClass( 'icomoon-star comment--star-selected')
                .addClass('icomoon-starunclick');
            //当前元素添加选中
            $(e.currentTarget)
                .removeClass('unclick icomoon-starunclick')
                .addClass( 'icomoon-star comment--star-selected');
            //遍历前面的元素添加选中
            $(e.currentTarget) .prevAll()
                .each(function() {
                    $(this).removeClass( 'unclick icomoon-starunclick' )
                        .addClass( 'icomoon-star comment--star-selected' );
                });



        },
        onResume: function() {
            console.log(111);
            PageView.prototype.onResume.apply(this, arguments);
            this.orderType=window.app.waitCommentOrderType;
            if(this.orderType =='10200'){
            	this.order = window.app.waitCommentOrder;
            	this.productList=this.order;
            }else{
            	this.order = window.app.waitCommentOrder;
            	this.productList = this.order.get("productList");
            }
            console.log(this.productList);
            if(this.productList) {
                this.findComponent("CreateCommentListView")
                    .collection.reset(this.productList);
                this.contentView = $(
                    ".image-upload-content");
                //绑定事件
                this.$('.input-image-upload')
                    .bind("change", this.handleFiles.bind(
                        this));
            }
            $(".create-comment-info")
                .show();
            $(".create-comment-success")
                .hide();
        },
        onRender: function() {

            console.log(222);

        },
        imagefiles: [],
        handleFiles: function(e) {
            this.editItem = $(e.target)
                .parents(".create-comment-list-item");
            var _this = this;
            var files = $(e.target)[0].files;
            var output = [];
            for(var i = 0, f; f = files[i]; i++) {
                var imageType = /image.*/;
                if(!f.type.match(imageType)) {
                    continue;
                }
                var _id = Math.random() * new Date();
                var imagefile = {
                    _id: _id,
                    file: f
                };
                var reader = new FileReader();
                reader.onload = function(e) {
                    var imgData = e.target.result;
                    _this.addImage(imgData, _id);
                    imagefile.src = imgData;
                }
                _this.imagefiles.push(imagefile);
                reader.readAsDataURL(f);
                if(_this.imgArray.length >= _this.options.max -
                    1) {
                    _this.hideAdd();
                    return;
                }
            }
        },
        commentLevel: function(e) {
            var curItem = $(e.target)
                .parents(".comment-level");
            curItem.find(".level-item")
                .removeClass("level-item-selected");
            $(e.target)
                .addClass("level-item-selected");
            if($(e.target).text() == "好评")
                this.level = "5";
            else if($(e.target).text() == "较好")
                this.level = "4";   
            else if($(e.target).text() == "一般")
                this.level = "3";    
            else if($(e.target).text() == "较差")
                this.level = "2";    
            else if($(e.target).text() == "差评")
                this.level = "1";                   
        },
        addImage: function(imgData, _id) {
            var img = $('<img />');
            img.attr('src', imgData);
            img.attr('_id', _id);
            this.imgArray.push(imgData);
            //this.preview.append(img);
            this.editItem.find(".image-preview")
                .append(img);
            if(this.imgArray.length == 5) {
                this.editItem.find(".image-add")
                    .hide();
            }
        },
        getImagesValue: function() {
            var files = [];
            this.imagefiles.forEach(function(it, index, a) {
                files[index] = it.file;
            });
            return files;
        },
        remove: function() {
            //解绑
            this.$('.input-image-upload')
                .unbind("change", this.handleFiles);
        },
        imgClick: function(e) {
            this._modalAtlasList();
        },
        //弹出幻灯片
        _modalAtlasList: function() {
            var windowWidth = window.innerWidth,
                $atlas_list = $(
                    '<div class="atlas-list"></div>'),
                $atlas_top = $(
                    '<div class="atlas-top"></div>'),
                $atlas_top_back = $(
                    '<div class="atlas-top-back-btn"></div>'
                );
            var spanBack = $(
                '<span class=" icommon icomoon-back"></span>'
            );
            $atlas_top_delete = $(
                '<div class="atlas-top-delete icomoon icomoon-delete"></div>'
            );
            atlas_footer = [
                    '<span class="atlas-span-info">',
                    '<span class="atlas-span-current">1</span>',
                    '<span class="atlas_span_total">/' +
                    this.imagefiles.length + '</span>',
                    '</span>'
                ].join(''),
                $atlas_footer = $(atlas_footer);
            $atlas_top_back.append(spanBack)
                .append($atlas_footer);
            slick_out_wrapper = [
                    '<div class="slick-out-wraper">',
                    '<div class="slick-container" style="width: ' +
                    window.innerWidth + 'px"></div>',
                    '</div>'
                ].join(''),
                $slick_out_wrapper = $(slick_out_wrapper);
            //返回按钮
            $atlas_top_back.on('click', function(event) {
                $atlas_list.css({
                    "transition": "all 0.5s ease",
                    "-webkit-transition": "all 0.5s ease",
                    "transform": "translate3d(" +
                        (windowWidth) +
                        "px, 0, 0)"
                });
                window.setTimeout(function() {
                    $atlas_list.remove();
                }, 600);
            });
            var me = this;
            $atlas_top_delete.on('click', function(event) {
                var current = $atlas_list.find(
                        '.atlas-span-current')
                    .text();
                if(!current) return;
                current = parseInt(current);
                if(me.imagefiles.length >= current) {
                    current--;
                    me._removeCurrentImg(current);
                    // 退出
                    $atlas_list.css({
                        "transition": "all 0.5s ease",
                        "-webkit-transition": "all 0.5s ease",
                        "transform": "translate3d(" +
                            (windowWidth) +
                            "px, 0, 0)"
                    });
                    window.setTimeout(function() {
                        $atlas_list.remove();
                    }, 600);
                }
            });
            $atlas_top.append($atlas_top_back);
            $atlas_list.append($atlas_top)
                .append($atlas_top_delete)
                .append($slick_out_wrapper);
            $('body')
                .append($atlas_list);
            // create slick instance
            var $slick_el = $atlas_list.find(
                '.slick-container');
            this.slick = $slick_el.slick({
                lazyLoad: 'ondemand',
                autoplay: false,
                swipeToSlide: true,
                dots: false,
                speed: 100,
                adaptiveHeight: true
            });
            if(this.imagefiles) {
                var me = this;
                setTimeout(function() {
                    me.imagefiles.forEach(function(
                        item) {
                        $slick_el.slick(
                            'slickAdd',
                            me._createAtlasItem(
                                item));
                    });
                    $slick_el.on('beforeChange',
                        function(event, slick,
                            currentSlide,
                            nextSlide) {
                            var description =
                                '';
                            var current =
                                nextSlide + 1;
                            $atlas_list.find(
                                    '.atlas-footer-h'
                                )
                                .text(
                                    description
                                );
                            $atlas_list.find(
                                    '.atlas-span-current'
                                )
                                .text(current);
                        });
                }, 0);
            }
            //动画效果
            $atlas_list.css({
                "transition": "none",
                "-webkit-transition": "none",
                "transform": "translate3d(" + (
                    windowWidth) + "px, 0, 0)"
            });
            window.setTimeout(function() {
                $atlas_list.css({
                    "transition": "all 0.5s ease",
                    "-webkit-transition": "all 0.5s ease",
                    "transform": "translate3d(0, 0, 0)"
                });
            }, 30);
        },
        _removeCurrentImg: function(index) {
            this.editItem.find(".image-preview")
                .children()
                .eq(index)
                .remove();
            this.imagefiles.splice(index, 1);
            this.imgArray.splice(index, 1);
        },
        _createAtlasItem: function(item) {
            var carouselItem = [
                '<div class="slick-imagediv">',
                '<img class="slick-img" src="' + item.src +
                '" />', '</div>'
            ].join('');
            return $(carouselItem)[0];
        }
    });
});
