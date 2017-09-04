define(['./CarouselView'], function(CarouselView){
	return CarouselView.extend({
		type: "AdCardView",

    createItem: function(item) {
      var carouselItem = document.createElement('div');

      carouselItem.classList.add('image');
      var img = document.createElement('img');
      if (this.slickOptions.lazyLoad == 'ondemand') {
        img.setAttribute('data-lazy', item.get('adImage'));
      } else {
        img.src = item.get('adImage');
      }
      var type=item.get('adType');
      var id=item.get('adId');
      var target = item.get("adTarget");
			var name = item.get("adName")?item.get("adName"):"微商城";
      var a = document.createElement('a');
			if(type == "0"){
				a.href="#home-navigate/itemdetail?goodsid="+target;
			}else{
			    //手机端不需要跳转链接
				// a.href="#home-navigate/my-webview?weburl="+target+"&webname="+name;
			}
      a.appendChild(img);
      carouselItem.appendChild(a);

      return carouselItem;
    },

	});
});
