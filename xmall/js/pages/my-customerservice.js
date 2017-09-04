/* Create by colinyeah on 2016/3/21 */
define( [ './PageView', 'require' ], function( PageView, require ) {
    return PageView.extend( {
        events: {
            "click .header-icon-back": "goback",
            "click .icomoon-moremore": "menuMore",
            "click .segmented-item": "onActive",
            'change .testfile': "fileChange",
            'click .customerservice-goods-details': "customerservice"
            
        },
        initialize: function() {
            this.listenTo( this.findComponent( 'PopupMenu' ),
                "toSearch", this.toSearch.bind( this ) );
        },
        toSearch: function( e ) {
            this.findComponent( "SearchMidPageView" )
                .show();
        },
        menuMore: function( e ) {
            this.findComponent( "PopupMenu" )
                .show();
        },
        goback: function( e ) {
            window.history.back();
        },
        onResume: function() {
            PageView.prototype.onResume.apply( this,
                arguments );
            var listType = application.getQueryString(
                "list_type" );
            if( listType ) {
                this.indexTab = listType;
            } else {
                this.indexTab = 0;
            }
            this.$( '.order-list-title' )
                .text( "全部订单" );
            this.initData();
        },
        initData: function() {
            this.listCollection = this.findComponent(
                    'AllCustomerService' )
                .collection;
            this.userInfo = window.application.getUserInfo();
            if( !this.userInfo ) {
                library.Toast( "您尚未登录，请前往登录", 2000 );
                window.history.back();
            }
            this.listCollection.queryData = {           	
        		memberId: this.userInfo.userid,
        		resultType: this.indexTab + "",
                datetype:0,
                index:1,
                size:10
            };
            $( '.add-blank-leaving-icon' )
                .removeClass( "icomoon-without" )
                .removeClass( "add-blank-leaving-icon" );
            $( '.add-blank-leaving-words' )
                .text( "" )
                .removeClass( "add-blank-leaving-words" );
            $( "#AllOrderListView" )
                .show();
            this.listCollection.loadData( {
                url: this.listCollection.allServiceUrl,
                data: this.listCollection.queryData,
                index:1,
                size: 10,
                needReset: true,
                showLoading: true,
                success: this.onSuccess.bind( this ),
                error: this.onError.bind( this )
            } );
        },
        onSuccess: function( data ) {
            if( data && data.status != '0' ) {
                library.Toast( "网络错误，请稍后再试", 2000 );
            }
            this.setPageStatus(data);
        },
        onError: function() {
            library.Toast( "抱歉，网络错误", 2000 );
            this.setPageStatus(data);
        },
        setPageStatus: function(data) {
        	if(data.data.list.length==0){
//            if( !this.listCollection.length || this.listCollection
//                .length == 0 ) {
                this.$el.find('.add-blank-leaving-icon').remove();
                this.$el.find('.add-blank-leaving-words').remove();
                $( "#AllCustomerService" )
                    .hide();
                var blankicon = $(
                    "<div class = 'icomoon-without add-blank-leaving-icon'></div><div class = 'add-blank-leaving-words'>您还没有相关售后服务哟~</div>"
                );
                this.$el.find( ".customerServiceView" )
                    .append( blankicon );
            } else {
                $( "#AllCustomerService" )
                    .show();
                $( ".icomoon-without" )
                    .remove();
                $( ".add-blank-leaving-words" )
                    .remove();
            }
            this.setActive( this.indexTab );
        },
        setActive: function( index ) {
            this.$( "a" )
                .removeClass( 'segmented-item-active' )
                .removeClass( 'theme-color' )
                .removeClass( 'theme-border-color' );
            this.$( "a[data-index='" + index + "']" )
                .addClass( 'segmented-item-active' )
                .addClass( 'theme-color' )
                .addClass( 'theme-border-color' );
            var str = "#my-navigate/my-customerservice?list_type=" + index;
          //  Backbone.history.navigate(str, {
           //     trigger: true
           // });
        },
        customerservice:function(e){
        	
        	
        	var Model = require('../models/BaseModel');
			var cancelMod = new Model();
			var aid=$(e.currentTarget).find("#saleDetail").text();
			var imgDetail=$(e.currentTarget).find("#imgDetail").text();
			Backbone.history.navigate(
                    "#my-navigate/my-customer-detail?aid="+aid+"&imgDetail="+imgDetail, {
                        trigger: true
                });
			
        },
        
        onActive: function( e ) {
            this.$( ".control-item" )
                .removeClass( "segmented-item-active" )
                .removeClass( "theme-color" )
                .removeClass( "theme-border-color" );
            var view = $( e.currentTarget );
            view.addClass( "segmented-item-active" )
                .addClass( "theme-color" )
                .addClass( "theme-border-color" );
            var index = $( e.currentTarget )
                .attr( 'data-index' );
            this.indexTab = index;
            this.listCollection.filterData(index);
        },
    } );
} );
