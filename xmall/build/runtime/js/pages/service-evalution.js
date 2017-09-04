define(['./PageView','require'], function(PageView,require) {
    return PageView.extend({
        events:{
            "click .header-icon-back": "goback",
            "click .icomoon-moremore": "menuMore",
            "click .menu-search":"toSearch",
            "click .service-comment-type-group": "typeSelector",
            "click .comment-level-block": "levelSelector",
            "click .select-organization":"toSender",
            "click .sender-select-item": "itemChoose",
            "click .h-span-left": "goBack",
            "click .comment-submit-btn": "submit",
        },
        type: 0,
        targetId: null,
        commentContent: null,
        commentLevel: "5",
        leaderId: null,
        methodId: null,
        initialize:function(){
            this.listenTo(this.findComponent('PopupMenu'),"toSearch",this.toSearch.bind(this));
        },
        typeSelector:function(e){
            /* 0为评论上级，1为评论渠道机构*/
            var typeSelected;
            if($(e.target).attr("data-index")==1){
                typeSelected = 0;
                this.type = 0;
                $('.type-choice-ico').removeClass('theme-color').removeClass('icomoon-choice').removeClass('icomoon-choicebox');
                $('.first-ico').addClass('theme-color').addClass('icomoon-choice');
                $('.second-ico').addClass('icomoon-choicebox');
                $('.select-organization').hide();
                $('.comment-target').show();
            }
            else{
                typeSelected = 1;
                this.type = 1;
                $('.type-choice-ico').removeClass('theme-color').removeClass('icomoon-choice').removeClass('icomoon-choicebox');
                $('.second-ico').addClass('theme-color').addClass('icomoon-choice');
                $('.first-ico').addClass('icomoon-choicebox');
                $('.select-organization').show();
                $('.comment-target').hide();
            }
        },
        levelSelector:function(e){
            $('.comment-level-block').removeClass('evaluate-tab-active');
            $(e.target).addClass('evaluate-tab-active');
            this.commentLevel = $(e.target).attr('data-index');
            console.log(this.commentLevel);
        },
        toSearch: function(e){
            this.findComponent("SearchMidPageView").show();
        },
        menuMore: function(e){
            this.findComponent("PopupMenu").show();
        },
        toSender: function(){
            var _this = this;
            var sender_head = $("<div class='sender-select-header'/>");
            var span_left = $("<span class='icomoon-back h-span-left'/>");
            var span_middle = $("<h1 class='h-span-middle'/>");
            span_middle.text("选择渠道机构");
            sender_head.append(span_left);
            sender_head.append(span_middle);
            this.$(".sender-sellect-container").append(sender_head);
            setTimeout(function(){
                _this.$(".sender-sellect-container").addClass("sender-transform");
            },50);
            this.$("#SenderSelect").show();
            this.$(".service-evalution-view").hide();

        },
        itemChoose: function(e){
            var content = this.$(e.currentTarget).text();
            this.methodId = this.$(e.currentTarget).attr("data-id");
            this.$(".service-evalution-view").show();
            // this.$("#SenderSelect").hide();
            this.$(".sender-select-header").remove();
            this.sender = content;
            this.$(".sender-choose").text(content);
            this.$(".select-tips").hide();
            this.$(".sender-sellect-container").removeClass("sender-transform");
        },
        goBack: function(){
            this.$(".select-tips").show();
            this.$(".sender-choose").text("");
            this.$(".service-evalution-view").show();
            // this.$("#SenderSelect").hide();
            this.$(".sender-select-header").remove();
            this.$(".sender-sellect-container").removeClass("sender-transform");
        },
        goback: function(e) {
            window.history.back();
        },
        onRender: function(){
            var userInfo = window.application.getUserInfo();
            this.getData("/getServiceInfo",{userId: userInfo.userid});
        },
        getData: function(url, data){
            var Model = require('../models/AjaxCollection');
            var model = new Model();
            _this = this;
            var options = {
                path: url,
                type: "POST",
                needReset: true,
                data: data,
                datatype: "json",
                success: function(res) {
                    console.log(res.data);
                    if(res.data.superInfo.superId){
                        _this.leaderId = res.data.superInfo.superId;
                    }
                   
                    _this.findComponent("SenderSelect").collection.reset(res.data.channelInfo);
                    if(res.data.superInfo.superName){
                         _this.$(".comment-target-name").text(res.data.superInfo.superName +' ('+ res.data.superInfo.superPhone+')');
                         // _this.$("comment-target-contact").text("13800138000");
                    }else{
                         _this.$(".comment-target-name").text("您还没有上级");
                    }
                    _this.$("#input-areaOfService").val(res.data.superInfo.APPRAISE_CONTENT);
                    $(".comment-level-block").removeClass("evaluate-tab-active");
                    var commentLevel = res.data.superInfo.APPRAISE_LEVEL;
                    switch (commentLevel){
                        case "5":
                            $(".comment-level-block").first().addClass("evaluate-tab-active");
                            break;
                        case "4":
                            $(".comment-level-block4").addClass("evaluate-tab-active");
                            break;
                        case "3":
                            $(".comment-level-block3").addClass("evaluate-tab-active");
                            break;
                        case "2":
                            $(".comment-level-block2").addClass("evaluate-tab-active");
                            break;
                        case "1":
                            $(".comment-level-block1").addClass("evaluate-tab-active");
                            break;
                        default:
                            $(".comment-level-block").first().addClass("evaluate-tab-active");
                            break;
                    }
                    // $(".comment-level-block").removeClass("evaluate-tab-active");
                    // $(".comment-level-block").first().addClass("evaluate-tab-active");
                    // _this.findComponent("input-area").innerText= res.data.superInfo.APPRAISE_CONTENT;
                },
                error: function() {

                }
            };
            model.loadData(options);
        },
        sendData: function(url,data){
            var Model = require('../models/AjaxCollection');
            var model = new Model();
            _this = this;
            var options = {
                path: url,
                type: "POST",
                needReset: true,
                data: data,
                datatype: "json",
                success: function(res) {
                    library.Toast("评价成功");
                    setTimeout(function(){
                    	 typeSelected = 0;
                         this.type = 0;
                         $('.type-choice-ico').removeClass('theme-color').removeClass('icomoon-choice').removeClass('icomoon-choicebox');
                         $('.first-ico').addClass('theme-color').addClass('icomoon-choice');
                         $('.second-ico').addClass('icomoon-choicebox');
                         $('.select-organization').hide();
                         $(".comment-level-block").removeClass("evaluate-tab-active");

                         $(".comment-level-block").first().addClass("evaluate-tab-active");
                    },2000) 
                },
                error: function() {
                    library.Toast("评价失败");
                }
            };
            model.loadData(options);
        },
        submit: function(){
            _this = this;
             var userInfo = window.application.getUserInfo();
            if(this.type == 0){
                this.targetId = this.leaderId;
                if(!this.targetId){
                    library.Toast("您还没有上级");
                    return;
                }
            }
            else if(this.type == 1){
                this.targetId = this.methodId;
                if(!this.targetId){
                    library.Toast("渠道机构不能为空");
                    return;
                }
            }
            
            if(!this.commentLevel){
                library.Toast("评分等级不能为空");
                return;
            }
            this.commentContent = this.$(".input-area").val();
            this.sendData("/addServiceComment",
                {
                    userId: userInfo.userid,
                    type : _this.type,
                    targetId : _this.targetId,
                    commentContent: _this.commentContent,
                    commentLevel: _this.commentLevel
                }
            );
        },
    });
});