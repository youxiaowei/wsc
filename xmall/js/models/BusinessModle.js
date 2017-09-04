/**
 * Created by liuqingling on 15/12/8.
 */
//{
//    shopid:'',
//        bannerurl:"",
//    shopname:'',
//    shoplog:'images/product_list/1.jpg'
//   isCollected:false
//   allproductlist:[
//  ]
//}
define(['backbone'], function(backbone){

    return backbone.Model.extend({

        defaults: {
            shoplogo:"images/product_list/1.jpg",
            shopid:102001,
            shopname:"中国大保健",
            tel:"13431027468",
            isCollected:true
        },
    });
});
