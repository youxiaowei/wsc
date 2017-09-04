define(['require','./BaseView'], function(require,BaseView){
	return BaseView.extend({

    listEl: null,
    title: null,
    selectedOption: {},
    callBack: null,

		optionsPay:null,
		optionsSend:null,
		selectorType:null,
		sendWayMap:{},

    events:{
      "click .order-options-row": "rowClick",
      "click .btn-submit": "submit"
    },

		render:function(){
      this.$el.empty();
      var template = library.getTemplate('order-options-selector.html');
      this.$el.append(template);
      this.listEl = $(this.$el.find('.selector-options-ul'));
			return this;
		},

		requestModel : null,
		setOrderOptinos: function(title,selectedId,args){
			this.title = title;
			this.$('.selector-title').empty().append(title);
			this.selectedOption.id = selectedId;
			this.selectorType = args;

			if(args == 'payselector'){//支付方式选择
				// if(this.optionsPay){// TODO 取缓存
				// 	this.layoutOptions(this.optionsPay);//如果已经存在缓存中，则直接显示，不用加载数据
				// 	return;
				// }
				var path = '/payway';
				var data = {};
			}else{// 配送方式选择
				// TODO
				// if(this.sendWayMap[selectedId]){//如果缓存中已经有改店铺的配置信息，则直接显示。
				// 	this.selectedOption.id = selectedId;
				// 	this.optionsSend = this.sendWayMap[selectedId];
				// 	this.layoutOptions(this.optionsSend);
				// 	return;
				// }
				var path = '/sendway';
				var data = {
					shopid:args
				}
			}

			if(!this.requestModel){
				var Model = require('../models/BaseModel');
				this.requestModel = new Model();
			}

			var options = {
				path:path,
				data:data,
				success:this.success.bind(this),
				error:this.error.bind(this)
			}
			this.requestModel.loadData(options);
		},

		success: function(res){
			if(res && res.status == 'ok'){
				if(this.selectorType == 'payselector'){
					this.optionsPay = res.data;
				}else{
					this.optionsSend = res.data;
					this.sendWayMap[this.selectedOption.id] = this.optionsSend;//店铺配送方式以店铺id存入map中。
				}
				this.layoutOptions(res.data);
			}else{
				library.Toast(res ? res.message : "哎哟，网络出小差哦~");
				this.$el.hide();
			}
		},
		error: function(res){
			library.Toast("哎哟，网络出小差哦~");
			this.$el.hide();
		},

		layoutOptions: function(options){
			this.listEl.empty();
			var _this = this;
			_.each(options,function(option,index){
				var row = $("<li></li>");
				row.addClass("order-options-row");
				var rowLeft = $("<div></div>");
				rowLeft.addClass("order-options-row-name").append(option.name);
				var rowRight = $("<div></div>");
				rowRight.addClass("order-options-row-select").addClass("theme-color");
                console.log(option);
                console.log(_this);
				if(option.id == _this.selectedOption.id || option.name == _this.selectedOption.name ){

                    rowRight.addClass("icomoon-right");
				};
				row.attr('data-index',index);
				row.append(rowLeft).append(rowRight);
				_this.listEl.append(row);
			});
		},

    rowClick: function(e){
      var index = $(e.target).attr('data-index');
			if(this.selectorType == 'payselector'){
				if(!this.optionsPay){
					return;
				}
				var selector = this.optionsPay[index];
				var options = this.optionsPay;
			}else{
				if(!this.optionsSend){
					return;
				}
				var selector = this.optionsSend[index];
				var options = this.optionsSend;
			}
			this.selectedOption = selector;


        $('.order-options-row-select').removeClass('icomoon-right');
        $(e.currentTarget).find('.order-options-row-select').addClass('icomoon-right');
    },
    submit: function(e){
        //弹出框的确认

			if(!this.selectedOption){
				if(this.selectorType == 'payselector'){
					library.Toast("请选择支付方式");
				}else{
					library.Toast("请选择配送方式");
				}
				return;
			}
      this.callBack && this.callBack(this.selectedOption);
      this.$el.find('.order-options-content').removeClass('order-options-content-show');
      //this.$el.hide();
        $('.common-message-cover').hide();
    }

	});
});
