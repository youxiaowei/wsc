define(['./ListView'], function(ListView){
  return ListView.extend({
    type: 'HomeSeckillTimerView',

    defaults:{
      timer: null
    },
    initialize: function(){
      this.setTimer(this);
    },
    render: function(){
      this.countdown(this);
      return this;
    },
    setTimer:function(_this){
      var html = '';
      var Hours = 0;  //剩余几小时
      var HoursA = 0;  //时A
      var HoursB = 0;  //时B
      var MinutesA = 0;  //分A
      var MinutesB = 0;  //分B
      var SecondsA = 0;  //秒A
      var SecondsB = 0;  //秒B
      //实例化时间
      var nowTimer=new Date();
      //剩余几小时
      Hours = 24-nowTimer.getHours();
      HoursA = 0;
      //三小时为一个轮回
      HoursB = parseInt(Hours%3);
      //取分的十位数
      MinutesA =parseInt((59-nowTimer.getMinutes())/10);
      //取分的个位数
      MinutesB =(59-nowTimer.getMinutes())%10;
      //取秒的十位数
      SecondsA =parseInt((59-nowTimer.getSeconds())/10);
      //取秒的个位数
      SecondsB =(59-nowTimer.getSeconds())%10;
      html = '<div class="home-seckill-timer" id="seckill_time">';
      html+= '<span class="home-seckill-time">'+HoursA+'</span>';
      html+= '<span class="home-seckill-time">'+HoursB+'</span>';
      html+= '<span class="home-seckill-time-separator">:</span>';
      html+= '<span class="home-seckill-time">'+MinutesA+'</span>';
      html+= '<span class="home-seckill-time">'+MinutesB+'</span>';
      html+= '<span class="home-seckill-time-separator">:</span>';
      html+= '<span class="home-seckill-time">'+SecondsA+'</span>';
      html+= '<span class="home-seckill-time">'+SecondsB+'</span>';
      html+= '</div>';
      _this.$el.html(html);
    },
    countdown:function(_this){
      setInterval(function() {
         _this.setTimer(_this);
      }, 1000);
    }
  });
});
