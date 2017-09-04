//发票页
define(['./PageView','require'], function(PageView,require){
  return PageView.extend({
    type:'invoice',

    events:{
          'click .header-icon-back': 'onBack',
          'click .btn-sure': 'onSave',
          'click #invoice-need': 'invoiceSelect',
          'click #invoice-unneed': 'invoiceSelect',
          "click .icomoon-moremore":"menuMore"
    },
    invoice: "不需要",
    initialize: function(){
      this.listenTo(this.findComponent('PopupMenu'),"toSearch",this.toSearch.bind(this));
    },
    menuMore: function(e){
      this.findComponent("PopupMenu").show();
    },
    toSearch: function(e){
      this.findComponent("SearchMidPageView").show();
    },
    onRender:function(){
      this.$("#invoice-unneed").addClass("theme-color").addClass("theme-border-color");
      if(window.app.invoice_head && window.app.invoice_content){
        this.$(".invoice-head-input").val(window.app.invoice_head);
        this.$(".invoice-content-input").val(window.app.invoice_content);

      }
    },
    onResume: function(){
      this.toggleBar && this.toggleBar("hide");
      this.$('.bar').show();
      if(window.app.invoice){
        if(window.app.invoice == "需要"){
          this.$("#invoice-need").addClass("theme-color")
            .addClass("theme-border-color");
          this.$("#invoice-unneed").removeClass("theme-color")
            .removeClass("theme-border-color");
        }
        else{
          this.$("#invoice-unneed").addClass("theme-color")
            .addClass("theme-border-color");
          this.$("#invoice-need").removeClass("theme-color")
            .removeClass("theme-border-color");
        }
      }
    },

    onBack: function(){
      window.history.back();
    },
    onSave: function(){
      if(this.$(".invoice-head-input").val() && this.$(".invoice-content-input").val()){
          var invoice = {};
          invoice.title = this.$(".invoice-head-input").val();
          invoice.content = this.$(".invoice-content-input").val();
          window.app.invoice = invoice;
          window.history.back();
      }else  library.Toast("请确认发票抬头和内容填写完整", 2000);
    },
    invoiceSelect: function(e){
      var id = $(e.currentTarget).attr("id");
      this.$(e.currentTarget).addClass("theme-color")
        .addClass("theme-border-color");
      if(id == "invoice-need"){
        this.$("#invoice-unneed").removeClass("theme-color")
          .removeClass("theme-border-color");
      }
      else{
        this.$("#invoice-need").removeClass("theme-color")
          .removeClass("theme-border-color");
        window.app.invoice = null;
        window.history.back();
      }
    },
  });
});
