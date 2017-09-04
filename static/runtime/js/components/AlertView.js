// # AlertView (控件暂时有问题，有两个return，去掉后面的retrun函数后，组件依然不可用)
// ##author pengguangzong
// 弹出提示框 (控件暂时有问题，有两个return，去掉后面的retrun函数后，组件依然不可用)
//
//
// ## 配置
//
// 变量 | 类型 | required | 描述
// ----|------|----------|-----
// message  | string | true | 提示语言
// duration | number | false| 持续时间 (毫秒)
// 例子：
//
// ```js
// {
//     type: "AlertView",
//     message: "出错了！"
// }
// ```
////
define(['./BaseView', 'backbone', 'spin'], function(BaseView, Backbone, Spinner){

  return BaseView.extend({

    type: 'AlertView',

    defaults: {
			duration: 2000,
			autoDismiss: true,
			type: 'info',
			showSpin: true
		},

    // message: 'message'
    // triggerEvent: 'my:event'
    configure: function(options){

    },

    dismiss: function(){
			this.el.classList.remove('active');

			var me = this;
			var onTransitionEnd = function(){
				me.el.removeEventListener('webkitTransitionEnd', onTransitionEnd);
				me.el.removeEventListener('msTransitionEnd', onTransitionEnd);
        me.el.removeEventListener('oTransitionEnd', onTransitionEnd);
        me.el.removeEventListener('otransitionend', onTransitionEnd);
        me.el.removeEventListener('transitionend', onTransitionEnd);
				me.remove();

				if (me.onDismiss) me.onDismiss();
			}
			this.el.addEventListener('webkitTransitionEnd', onTransitionEnd);
			this.el.addEventListener('msTransitionEnd', onTransitionEnd);
      this.el.addEventListener('oTransitionEnd', onTransitionEnd);
      this.el.addEventListener('otransitionend', onTransitionEnd);
      this.el.addEventListener('transitionend', onTransitionEnd);
		}
  });
});
