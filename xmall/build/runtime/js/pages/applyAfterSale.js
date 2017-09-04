define(['./PageView','require','../libs/canlendar' ,'../libs/wechat'],
		function(PageView,require, canlendar ,wechat) {
	return PageView.extend({
		events: {
			"click .header-icon-back": "goback",
			"click .icomoon-moremore": "menuMore",
			"click .menu-search":"toSearch",
			"click .preImg": "imgClick",
			"click .choice-return":"selectReturn",
			"click .choice-exchange":"selectExchange",
			"click .image-upload":"upload",
			"click .apply-after-reason":"selectSale",
			"click .apply-after-sale-btn":"doSaleService",
		},
		saleDetail:null,
		imgArray: [],
		editItem:null,
		imagefiles: [],
		applyType:null, //applyType是申请售后的类型，01为申请退货，02为申请换货
		shopAfterSaleType:null, //订单类型
		shopAfterSale:null,   //套餐信息
		initialize:function(){
			
			if(this.isWeiXin()){//初始化微信签名
				this.initWechat();
			}
		},
		initWechat: function(){
			var Model = require('../models/BaseModel');
			var wechatModel = new Model();
			var options = {
					url: window.app.api+'/getSignUrl',
					type: "POST",
					needReset:true,
					data:{
						url: document.location.origin + document.location.pathname
					},
					success:function(res) {
						if (res.status == '0') {
							wechat.init(res.data);
						}else{
							library.Toast('JS-SDK签名失败');
						}
					},
					error:function () {
						library.Toast('JS-SDK签名失败');
					}
			};
			wechatModel.loadData(options);
		},
		isWeiXin: function(){
			var ua = window.navigator.userAgent.toLowerCase();
			if(ua.match(/MicroMessenger/i) == 'micromessenger'){
				return true;
			}else{
				return false;
			}
		},
		onResume: function() {
			//上传图片测试数据
			//var res = {"status":"0","message":"图片上传成功","data":{"imageurl":"http://szli.gootese.com/upload/20160818/CAuwx3YPe1_cB3Xi6mVtirS339uj29D5XxN0aBi-IPAIziERjY6ccppjiHzsfo_7.jpg"}}
			//this.addImage(res.data.imageurl,"")
			$('.bar-tab').hide();
			this.$(".apply-after-num").hide();
			//绑定事件
			//this.$('.input-image-upload').bind("change", this.handleFiles.bind(this));
			$(".reason-id").text('');
			$(".add-apply-comment").text('');
			this.$(".package-num").val('')
			console.log(this.$(".package-num").val())
			this.shopAfterSaleType=window.app.shopAfterSaleType;
			this.shopAfterSale=window.app.shopAfterSale;
			if(this.shopAfterSaleType == '10200'){
				this.$(".apply-after-num").show();
				//选中换货按钮
				this.selectExchange();
				//this.$(".choice-return").unbind("click");
				applyType = "02";
                 //获取售后原因列表
				this.getPackageSaleService();
			}else{
				applyType = "01";
				this.getSaleService();
			}
		},
		getPackageSaleService:function(){
			var _this=this;
			var Model = require('../models/BaseModel');
			var packageSaleService = new Model();
			var options = {
					url: window.app.api+'/getReturnReasonSet',
					type: "POST",
					needReset:true,
					data:{
						
					},
					success:function(res) {
						if(res.status == 0){
							console.log(res)
							_this.saleDetail = res.data.returnslist;
						}
					},
					error:function () {

					}
			};
			packageSaleService.loadData(options);
		},
		getSaleService:function(){
			var _this=this;
			var orderId = window.application.getQueryString('orderId');
			var ogid = window.application.getQueryString('ogid');
			var Model = require('../models/BaseModel');
			var saleService = new Model();
			var userInfo = window.application.getUserInfo();
			var userid = userInfo ? userInfo.userid : "";
			var options = {
					url: window.app.api+'/getServiceApplication',
					type: "POST",
					needReset:true,
					data:{
						orderid:orderId,
						memberid:userid,
						ogid:ogid
					},
					success:function(res) {
						_this.saleDetail = res.data.returnslist;
						//设置可退金额
						$(".return-money-most").text(res.data.goodsamount);
						var a = $(".return-money-most").text();
					},
					error:function () {

					}
			};
			saleService.loadData(options);
		},
		selectSale:function(){
			$(".apply-after-service").empty();
			var list = this.saleDetail;
			for ( var i in list) {
				$(".apply-after-service").append("<div hidden='true'>"+list[i].id+"</div><div class='row-service'>"+list[i].name+"</div>")
			};
			$(".apply-after-service").animate({"opacity":"1"});
			$(".row-service").click(function(){
				$(".reason-description").text($(this).text());
				$(".reason-id").text($(this).prev().text());
				$(".apply-after-service").animate({"opacity":"0"});
				$(".apply-after-service").empty();
			});
		},
		upload:function(){
			var _this=this;
			if(this.isWeiXin()){//TODO 从微信选择上传
				var Model = require('../models/BaseModel');
				var wechatModel = new Model();
				var userinfo = JSON.parse( localStorage.getItem( 'userinfo' ) );
				wechat.chooseImage(function(localIds){
					library.LoadingBar('正在上传');
					//选择图片后马上上传
					wechat.uploadImage(localIds.toString(), 0,function(serverId){
						var options = {
								url: window.app.api+'/uploadImageWX',
								type: "POST",
								needReset:true,
								data:{
									mediaId :  serverId,
									userId: userinfo.userid
								},
								success:function(res) {
									library.DismissLoadingBar();
									if (res.status == '0') {
										_this.addImage(res.data.imageurl,"")
									}else{
										library.Toast(res && res.message ? res.message : "上传失败" );
									}
								},
								error:function () {
									library.DismissLoadingBar();
									library.Toast('网络错误');
								}
						};
						wechatModel.loadData(options);
					});
				});
			}else{
				alert("请从微信上传")
			}
		},
		handleFiles: function(e) {
			this.editItem = $(e.target).parents(".add-comment-photo");
			var _this = this;
			var files = $(e.target)[0].files;
			var output = [];

			for (var i = 0, f; f = files[i]; i++) {
				var imageType = /image.*/;
				if (!f.type.match(imageType)) {
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
				if (_this.imgArray.length >= _this.options.max - 1) {
					_this.hideAdd();
					return;
				}
			}
		},
		selectReturn:function(){
			if(this.shopAfterSaleType == '10200'){
				return;
			}
			this.$(".apply-after-num").hide();
			$(".most-return-num").show();
			$('.choice-circle').removeClass('icomoon-choice').removeClass('theme-color').addClass('icomoon-choicebox');
			$('.choice-return').find('.choice-circle').removeClass('icomoon-choicebox').addClass('icomoon-choice theme-color');
			applyType = "01";
		},
		selectExchange:function(){
			this.$(".apply-after-num").show();
			$(".most-return-num").hide();
			$('.choice-circle').removeClass('icomoon-choice').removeClass('theme-color').addClass('icomoon-choicebox');
			$('.choice-exchange').find('.choice-circle').removeClass('icomoon-choicebox').addClass('icomoon-choice theme-color');
			applyType = "02";
		},
		toSearch: function(e){
			this.findComponent("SearchMidPageView").show();
		},
		menuMore: function(e){
			this.findComponent("PopupMenu").show();
		},
		goback: function(e) {
			window.app.shopAfterSaleType="";
			window.history.back();
		},

		imgClick: function(e){
			this._modalAtlasList();
		},
		remove: function() {
			//解绑
			this.$('.input-image-upload').unbind("change", this.handleFiles);
		},
		addImage: function(imgData, _id) {
			var img = $('<img />');
			img.attr('src', imgData);
			img.attr('_id', _id);
			img.addClass('preImg');
			this.imgArray.push(imgData);
			//this.preview.append(img);
			//this.editItem.find(".image-preview").append(img);
			var	imagefile={}
			imagefile.src = imgData;
			this.imagefiles.push(imagefile);
			this.$(".image-preview").append(img);
			if (this.imgArray.length == 5) {
				this.editItem.find(".image-add").hide();
			}
		},

		//弹出幻灯片
		_modalAtlasList: function() {
			var windowWidth = window.innerWidth,
			$atlas_list = $('<div class="atlas-list"></div>'),
			$atlas_top = $('<div class="atlas-top"></div>'),
			$atlas_top_back = $('<div class="atlas-top-back-btn"></div>');
			var spanBack = $('<span class=" icommon icomoon-back"></span>');
			$atlas_top_delete = $('<div class="atlas-top-delete icomoon icomoon-delete"></div>');
			atlas_footer = [
			                '<span class="atlas-span-info">',
			                '<span class="atlas-span-current">1</span>',
			                '<span class="atlas_span_total">-' + this.imagefiles.length + '</span>',
			                '</span>'
			                ].join(''),
			                $atlas_footer = $(atlas_footer);
			$atlas_top_back.append(spanBack).append($atlas_footer);
			slick_out_wrapper = [
			                     '<div class="slick-out-wraper">',
			                     '<div class="slick-container" style="width: ' + window.innerWidth + 'px"></div>',
			                     '</div>'
			                     ].join(''),
			                     $slick_out_wrapper = $(slick_out_wrapper);

			//返回按钮
			$atlas_top_back.on('click', function(event) {
				$atlas_list.css({
					"transition": "all 0.5s ease",
					"-webkit-transition": "all 0.5s ease",
					"transform": "translate3d(" + (windowWidth) + "px, 0, 0)"
				});
				window.setTimeout(function() {
					$atlas_list.remove();
				}, 600);
			});
			var me = this;
			$atlas_top_delete.on('click',function(event){
				var current = $atlas_list.find('.atlas-span-current').text();
				if(!current) return;
				current = parseInt(current);
				if(me.imagefiles.length >= current){
					current--;
					me._removeCurrentImg(current);
					// 退出
					$atlas_list.css({
						"transition": "all 0.5s ease",
						"-webkit-transition": "all 0.5s ease",
						"transform": "translate3d(" + (windowWidth) + "px, 0, 0)"
					});
					window.setTimeout(function() {
						$atlas_list.remove();
					}, 600);
				}
			});

			$atlas_top.append($atlas_top_back);
			$atlas_list.append($atlas_top).append($atlas_top_delete).append($slick_out_wrapper);
			$('body').append($atlas_list);

			// create slick instance
			var $slick_el = $atlas_list.find('.slick-container');
			this.slick = $slick_el.slick({
				lazyLoad: 'ondemand',
				autoplay: false,
				swipeToSlide: true,
				dots: false,
				speed: 100,
				adaptiveHeight: true
			});

			if (this.imagefiles) {
				var me = this;
				setTimeout(function() {
					me.imagefiles.forEach(function(item) {
						$slick_el.slick('slickAdd', me._createAtlasItem(item));
					});
					$slick_el.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
						var description = '';
						var current = nextSlide + 1;
						$atlas_list.find('.atlas-footer-h').text(description);
						$atlas_list.find('.atlas-span-current').text(current);
					});
				}, 0);
			}

			//动画效果
			$atlas_list.css({
				"transition": "none",
				"-webkit-transition": "none",
				"transform": "translate3d(" + (windowWidth) + "px, 0, 0)"
			});

			window.setTimeout(function() {
				$atlas_list.css({
					"transition": "all 0.5s ease",
					"-webkit-transition": "all 0.5s ease",
					"transform": "translate3d(0, 0, 0)"
				});
			}, 30);
		},
		_removeCurrentImg: function(index){
			//this.editItem.find(".image-preview").children().eq(index).remove();
			this.$(".image-preview").children().eq(index).remove();
			this.imagefiles.splice(index, 1);
			this.imgArray.splice(index, 1);
		},
		_createAtlasItem: function(item) {
			var carouselItem = [
			                    '<div class="slick-imagediv">',
			                    '<img class="slick-img" src="' + item.src + '" />',
			                    '</div>'
			                    ].join('');

			return $(carouselItem)[0];
		},
		//申请售后
		doSaleService:function(){
			var applyImage;
			if(this.imgArray){
				applyImage = this.imgArray.join(";");
			}else{
				applyImage="";
			}
			if(applyType == 01){
				if(!$(".reason-id").text()){
					library.Toast("请选择退货原因", 2000);
					return;
				}
				if(!$(".add-apply-comment").val()){
					library.Toast("请填写退货原因", 2000);
					return;
				}
			}else{
				if(!$(".reason-id").text()){
					library.Toast("请选择换货原因", 2000);
					return;
				}
				if(!$(".add-apply-comment").val()){
					library.Toast("请填写换货原因", 2000);
					return;
				}
			}
			
			var userInfo = window.application.getUserInfo();
			var userid = userInfo ? userInfo.userid : "";
			var Model = require('../models/BaseModel');
			var doSaleService = new Model();
			var _this=this;
			var orderId = window.application.getQueryString('orderId');
			var productId = window.application.getQueryString('productId');
			var number = window.application.getQueryString('number');
			var ogid = window.application.getQueryString('ogid');
			
			if(this.shopAfterSaleType == '10200'){
				if(!this.$(".package-num").val()){
					library.Toast('数量不能为空');
					return false;
				}
				//判断数量
				var reg=/^[0-9]*$/;
				if(!reg.test(this.$(".package-num").val())){
					library.Toast('请输入正整数');
					return false;
				}
				console.log(this.shopAfterSale.itemProduct.goodsNumber+"aaaaaaaa")
				console.log(this.$(".package-num").val()+"aaaaaaaa")
				if(this.$(".package-num").val()>this.shopAfterSale.itemProduct.goodsNumber){
					library.Toast('可售后的数量不足');
					return false;
				}
				var options1 = {
						url: window.app.api+'/saveAfterSave',
						type: "POST",
						needReset:true,
						data:{
							orderid:this.shopAfterSale.item.orderId,
							extensioncode:"02",//换货ID
							reasonsId:this.$(".reason-id").text(),
							applyreason:this.$(".add-apply-comment").val(),
							imgUrl:applyImage,
							goodsid:this.shopAfterSale.itemProduct.goodsId,
							memberId:userid,
							exchangeNumber:this.$(".package-num").val(),//this.shopAfterSale.itemProduct.goodsNumber,
							goodsAmount:this.$(".return-money-most").text(),
							ogid:this.shopAfterSale.itemProduct.ogid,
							ordergoodsid:this.shopAfterSale.itemProduct.orderGoodsId
						},
						success:function(res) {
							console.log(res)
							library.Toast("申请成功");
							window.history.back();
						},
						error:function () {

						}
				};
				doSaleService.loadData(options1);
				
			}else{
				//判断数量
				if(applyType == "02"){
					
					if(!this.$(".package-num").val()){
						library.Toast('数量不能为空');
						return false;
					}
					var reg=/^[0-9]*$/;
					if(!reg.test(this.$(".package-num").val())){
						library.Toast('请输入正整数');
						return false;
					}
					if(this.$(".package-num").val()>number){
						library.Toast('可售后的数量不足');
						return false;
					}
					number = this.$(".package-num").val();
				}
				var options = {
						url: window.app.api+'/applyService',
						type: "POST",
						needReset:true,
						data:{
							serviceType:applyType,//退换货ID
							applyReason:this.$(".reason-id").text(),
							applyDes:this.$(".add-apply-comment").val(),
							applyImages:applyImage,
							productId:productId,
							userId:userid,
							orderId:orderId,
							ordergoodsid:ogid,
							exchangeNumber:number,
							goodsAmount:this.$(".return-money-most").text()
						},
						success:function(res) {
							 library.Toast("申请成功");
							window.history.back();
						},
						error:function () {

						}
				};
				doSaleService.loadData(options);
			}
		}
	});
});