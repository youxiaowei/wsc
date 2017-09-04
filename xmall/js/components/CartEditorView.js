define(['./BaseView','require'], function(BaseView,require){
	return BaseView.extend({
    type: "CartEditorView",

    events:{
      "click .goods-editor-btn": "submit",
      "click .cart-editor-view-corver": "hide",
      "click .cart-editor-view-close": "hide"

    },
		callback:null,

		goodsNumber:"1",
		render:function(){
      var template = library.getTemplate("cart-editor-view.html");
      this.$el.append(template);
			return this;
		},
    hide: function(){
      this.$(".cart-editor-view").removeClass("cart-editor-view-show");
      this.$(".cart-editor-view-corver").hide();
			this.callback && this.callback();
    },
    show: function(data,callback){
			this.callback = callback;
      this.$(".cart-editor-view").addClass("cart-editor-view-show");
      this.$(".cart-editor-view-corver").show();
			this.setSpecInfo(data);
    },
		curModifyGoodsInfo:{},
		curMidifyGoodsId:null,
		wantToModifyGoodsId:null,
		setSpecInfo: function(data){
			// this.$(".goods-price").text("￥"+data.price);
			var part1View = this.$(".spec-part1-content");
 			part1View.empty();
			var _this = this;
			this.goodsNumber = data.attributes.number;
			var specInfo = data.attributes.productSpec;
			var firstLevelSpecName = specInfo.specName;
			var firstLevelSpecWrapper = $("<div></div>");
			var specValues = specInfo.specValues;
			this.curModifyGoodsInfo = data.attributes;
			this.curMidifyGoodsId = data.attributes.productId;
			var f,fv;
			for(var i=0,j=specValues.length;i<j;i++){
				var firstLevelItemInfo = specValues[i];
				var specParamValues = firstLevelItemInfo.specParamValues;

				var firstLevelItem = $("<span class='spec-part-item'>"+firstLevelItemInfo.specParamName+"</span>");
				for(var n=0,m=specParamValues.length;n<m;n++){
					if(specParamValues[n].goodsId==data.attributes.productId){
						f = firstLevelItem;
						fv = specParamValues;
					}
				}
				(
					function(_firstLevelItem,_specParamValues){
						_firstLevelItem.bind("click",function(){
						 _this.firstLeveiItemClick(_firstLevelItem,_specParamValues,"");
						});
					}
				)(firstLevelItem,specParamValues);
				firstLevelSpecWrapper.append(firstLevelItem);
			}

			// specParamId specParamName specParamValueName
			this.secondLevelWrappe = $("<div></div>");
			part1View.append("<div>"+firstLevelSpecName+"</div>").append(firstLevelSpecWrapper).append(this.secondLevelWrappe);

			this.firstLeveiItemClick(f,fv,data.attributes.productId);
		},
		selectedFirstLevelItem:null,
		firstLeveiItemClick:function(firstItem,secondItemValues,productId){
			var _this = this;
			if(this.selectedFirstLevelItem){
				this.selectedFirstLevelItem.removeClass("spec-part-item-selected");
			}
			this.secondLevelWrappe.html('');
			this.selectedFirstLevelItem = firstItem;
			firstItem.addClass("spec-part-item-selected");
			var selectedSecondItem,secondLevelData;
			for(var i=0,j=secondItemValues.length;i<j;i++){
				var secondItemValue = secondItemValues[i];

				if(secondItemValue.specValue==""){
					this.$(".goods-img").attr("src",secondItemValue.specImage);
					this.$(".goods-price").html("￥"+secondItemValue.specPrice);
					this.$(".goods-stack").html("库存"+secondItemValue.specStack+"件");
					
					
					this.wantToModifyGoodsId = secondItemValue.goodsId;
					continue;
				}

				var secondItem  =$("<span class='spec-part-item'>"+secondItemValue.specValue+"</span>") ;
				this.secondLevelWrappe.append(secondItem);
				if(productId==""&&i==0){
					selectedSecondItem = secondItem;
					secondLevelData = secondItemValue;
				}else{
					if(	productId==secondItemValue.goodsId){
							selectedSecondItem = secondItem;
							secondLevelData = secondItemValue;
					}
				}
				(function(_secondItem,_secondItemValue){
					_secondItem.bind("click",function(){
						_this.secondItemClick(_secondItem,_secondItemValue);
					});
				})(secondItem,secondItemValue);
// 				goodsId
// :
// "95ba39f2c11d4c0885018911b8d364c0"
// specId
// :
// "5ce3a3295af84196ac1c02956b65f9a3"
// specImage
// :
// "http://shopi.yonyou.com/upload/20150505/7f9d986cbb9846af91478e2157bd904c.png"
// specPrice
// :
// 10.8
// specStack
// :
// 995
// specValue
// :
// "500g"
			}
			this.secondItemClick(selectedSecondItem,secondLevelData);
		},
		selectedSecondItem:null,
		secondItemClick:function(item,itemData){
			if(!item){return;}
			this.wantToModifyGoodsId = itemData.goodsId;
			this.$(".goods-img").attr("src",itemData.specImage);
			if(this.selectedSecondItem){
				this.selectedSecondItem.removeClass("spec-part-item-selected");
			}
			this.selectedSecondItem = item;
			this.selectedSecondItem.addClass("spec-part-item-selected");
		},


		createSpecItem: function(spec,isSelected){
			var view = $("<span class='spec-part-item'></span>");
			if(isSelected){
				view.addClass("spec-part-item-selected");
			}
			view.text(spec.name+"");
			view.attr("data-index",spec.id);
			return view;
		},

		specChanged: function(e){
			var specView = this.$(e.target).parent();
			var specList = specView.children();
			for(var i = 0 ; i < specList.length; i++){
				$(specList[i]).removeClass("spec-part-item-selected");
			}
			this.$(e.target).addClass("spec-part-item-selected");
			if(specView.hasClass("spec-part1-content")){
				// TODO
			}else{
				// TODO
			}

		},

    submit: function(e){

			var ModifyModel = require('../models/BaseModel');

			var _ModifyModel = new ModifyModel();
			if(this.wantToModifyGoodsId==this.curMidifyGoodsId){
				this.hide();
				return;
			}
			var userInfo = window.application.getUserInfo();
			var userid = userInfo.userid;
			var _this = this;
			_ModifyModel.loadData({
			  path:"/modifyCart",
			  type:"POST",
			  needReset:false,
			  data: {
			    userId:userid,
			    cartId:this.curModifyGoodsInfo.cartId,
			    productId:this.wantToModifyGoodsId,
			    number:this.goodsNumber
			  },
			  success:function(){
					var c = _this.pageview.findComponent("shopingcartlistview").collection;
					c.ajaxOptions = {
	          path: '/getCartList',
	          type: "POST",
	          data: {userId:userInfo.userid},
	          showLoading:true,
	          needReset:true,
	          success:_this.getListSuceess.bind(_this),
	          error:_this.getListError.bind(_this)
	        }
	        c.loadData();

				},
			  error:function(){

				}
			});

      this.hide();
    },
		getListSuceess:function(){
			$('.shopingcart-goods-edit').show();
			$('.shopingcart-goods-details-info-show').hide();
			$('.shopingcart-manage').show();
			$('.shopingcart-footer').hide();
		},
		getListError:function(){}
	});
});
