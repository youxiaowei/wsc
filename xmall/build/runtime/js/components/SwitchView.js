/**
 * Created by Zero Zheng on 15/12/01.
 */
define(['./BaseView'], function(BaseView) {
    return BaseView.extend({
        type: "SwitchView",
        events: {
          'click .switchview-switch': 'switchClick',
        },
        defaults: {
            IsOpen:false
        },
        callBack: null,
        switchDiv:null,
        render: function() {
            /*新增div*/
            this.switchDiv = document.createElement('div');
            $(this.switchDiv).addClass('switchview-switch');
            var switch_handleDiv = document.createElement('div');
            $(switch_handleDiv).addClass("switch-handle");
            $(this.switchDiv).append(switch_handleDiv);
            this.changeNotify();
            /*视图绑定div*/
            this.$el.append(this.switchDiv);

            return this;
        },
        changeNotify: function(){
          if(this.options.IsOpen){
            $(this.switchDiv).addClass('active');
          }else {
            $(this.switchDiv).removeClass('active');
          }
        },
        setStatus: function(status){
          this.options.IsOpen = status;
          //this.render();
          this.changeNotify();
        },
        setBgBland: function(){
          this.$('.switchview-switch').addClass('switchview-bland');
        },
        switchClick:function(event){
          this.$el.find('.switchview-switch').toggleClass('active');
          this.trigger('switchClick', this);
          this.options.IsOpen = !this.options.IsOpen;
          this.callBack && this.callBack(this.options.IsOpen);
        }
    })
})
