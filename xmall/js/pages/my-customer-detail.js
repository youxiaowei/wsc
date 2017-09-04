define( [ './PageView', 'require' ], function( PageView, require ) {
	
	return PageView.extend( {
		events: {
            "click .nav-left": "goback",
            
            
        },
		initialize: function() {
            this.listenTo( this.findComponent( 'PopupMenu' ),
                "toSearch", this.toSearch.bind( this ) );
        },
        toSearch: function(e) {
            this.findComponent( "SearchMidPageView" )
                .show();
        },
        menuMore: function(e) {
            this.findComponent( "PopupMenu" )
                .show();
        },
        goback: function() {
            window.history.back();
            //applyService
        },
		
		 onResume: function(){			
        	var _this=this;
        	var aid = window.application.getQueryString('aid');
        	var imgDetail= window.application.getQueryString('imgDetail');
        	var Model = require('../models/BaseModel');
			var cancelMod = new Model();
			var options = {
					path: "/aftersalesinfo",
					type: "POST",
					data: {
						aid:aid,					
					},
					showLoading: true,
					needReset: true,
					success: function(res){	
						console.log(imgDetail);
						if(res.status==0){
							//商品信息
							$(".dealTime").html(res.data.dealTime);
							$(".reason").html(res.data.reason);
							$(".applyReason").html(res.data.applyReason);
							$(".sale").html(res.data.orderSn);
							$(".goods-details-img img").attr("src",imgDetail);
							$(".goods-details-title").text(res.data.goodsName);
							$(".goods-details-spec").text("￥"+res.data.price);
							$(".goods-details-num").text(res.data.goodsNumber);
							if(res.data.afterSaleType=="01"){
								$(".applyService").text("退货");
							}else if(res.data.afterSaleType=="02"){
								$(".applyService").text("换货")
							}else if(res.data.afterSaleType=="03"){
								$(".applyService").text("维修")
							};;
							/*if(res.data.orderStatus=="4"){
								$(".goods-details-state").text("审核中");
							};*/
							//处理状态
							//if(res.data.auditstate=="0"){							
								$(".pointzero").addClass("now-status");
								$(".pointzerotext").css("color","red");								
								 $(".status-description-str").text("正在审核您的申请，请耐心等候");								
								 /*}else if(res.data.auditstate=="1"){//1未通过 
								$(".pointzero").addClass("now-status");
								$(".pointone").addClass("now-status");								
								$(".pointzerotext").css("color","red");
								$(".pointonetext").css("color","red");								
								$(".status-description-str").text("未通过您的申请，请耐心等候处理");
							}else*/ if(res.data.auditstate=="2"||res.data.auditstate=="0"){//0初始态//2通过
								$(".pointzero").addClass("now-status");
								$(".pointone").addClass("now-status");
								$(".pointtwo").addClass("now-status");
								$(".pointzerotext").css("color","red");
								$(".pointonetext").css("color","red");
								$(".pointtwotext").css("color","red");								 
								//$(".status-description-str").text("已通过您的申请，请耐心等候处理");
								$(".status-description-str").text("申请处理中，请耐心等候处理");
							}/*else if(res.data.auditstate=="3"){//3驳回
								$(".pointzero").addClass("now-status");
								$(".pointone").addClass("now-status");
								$(".pointtwo").addClass("now-status");
								$(".pointthree").addClass("now-status");
								$(".pointzerotext").css("color","red");
								$(".pointonetext").css("color","red");
								$(".pointtwotext").css("color","red");
								$(".pointthreetext").css("color","red");
								$(".status-description-str").text("已驳回您的申请");
							}*/else if(res.data.auditstate=="4"|| res.data.auditstate=="3"){//4完成
								
								$(".pointzero").addClass("now-status");
								$(".pointone").addClass("now-status");
								$(".pointtwo").addClass("now-status");
								$(".pointhree").addClass("now-status");
								$(".pointfour").addClass("now-status");
								$(".pointzerotext").css("color","red");
								$(".pointonetext").css("color","red");
								$(".pointtwotext").css("color","red");
								$(".pointhreetext").css("color","red");
								$(".pointfourtext").css("color","red");
								$(".status-description-str").text("您的售后申请已完成");
							}
			            	return;
							
						}else{
							library.Toast(res.message);
						}						 						 

					},
					error:function(){

					}
			}           
			cancelMod.loadData(options);
        	
			 
			 
		 }
		
		
		
		
			
		
		
	})
		
	
})