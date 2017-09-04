define(['./PageView'], function(PageView) {
  return PageView.extend({
    events: {
      "change .mui-numbox-input": "inputchange"
    },
    inputchange: function() {
      var index = $('.mui-numbox-input').val();
      if(index > 100 )
      {
        index = 100 ;
      }
      if(index < 10 )
      {
        index = 10 ;
      }
      index = parseInt(index);
      $(".mui-numbox-input").val(index);
    },
    render: function() {
      PageView.prototype.render.apply(this, arguments);
      return this;
    },
    onRender: function() {
      _this = this;
      this.$el.find('.info-title-svg' ).click(function(){
        // $(".add-shop-cart").css("display","none");
         $(".add-shop-cart").removeClass("add-shop-cart-show");
      });
      this.$el.find('.info-method-staple').click(function(){
        if(_this.$('.info-method-staple').hasClass("info-spec-selected-no"))
        {
          _this.$('.info-method-staple').removeClass('info-spec-selected-no');
          _this.$('.info-method-staple').addClass('info-spec-selected');
          _this.$('.info-method-microcredit').addClass('info-spec-selected-no');
          _this.$('.info-method-microcredit').removeClass('info-spec-selected');
          _this.$('.info-method-tips').text("最小起批量100");
          _this.$('.shopcart-info-spec').hide();
        }
      });
      this.$el.find('.info-method-microcredit').click(function(){
        if(_this.$('.info-method-microcredit').hasClass("info-spec-selected-no"))
        {
          _this.$('.info-method-microcredit').removeClass('info-spec-selected-no');
          _this.$('.info-method-microcredit').addClass('info-spec-selected');
          _this.$('.info-method-staple').addClass('info-spec-selected-no');
          _this.$('.info-method-staple').removeClass('info-spec-selected');
          _this.$('.info-method-tips').text("最小起批量10");
          _this.$('.shopcart-info-spec').show();
        }
      });
      this.$el.find('.info-spec-box').click(function(event){
        var index = $(event.target).attr('data-index');
        _this.$(".info-spec-box").removeClass('info-spec-selected');
        _this.$(".info-spec-box").addClass('info-spec-selected-no');
        _this.$(".info-spec-box[data-index='"+ index +"']").removeClass('info-spec-selected-no');
        _this.$(".info-spec-box[data-index='"+ index +"']").addClass('info-spec-selected');
      });
      this.$el.find('.mui-numbox-btn-minus').click(function(){
        var index = $(".mui-numbox-input").val();
        index = parseInt(index);
        index = index - 1;
        if(index >= 10){
          $(".mui-numbox-input").val(index);
        }
      });
      this.$el.find('.mui-numbox-btn-plus').click(function(){
        var index = $(".mui-numbox-input").val();
        index = parseInt(index);
        index = index + 1;
        if(index <= 100){
          $(".mui-numbox-input").val(index);
        }
      });
    }
  });

});
