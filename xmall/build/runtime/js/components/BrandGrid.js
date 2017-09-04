define(['./BaseView','../models/BrandsModel'], function(BaseView,BrandsModel){

    return BaseView.extend({
        type: 'BrandGrid',
        brandsModel:new BrandsModel(),
        template:null,
        data:[],
        initialize:function(){
            //this.listenTo(this.brandModel,"add",this.add);
            this.listenTo(this.brandsModel,"reset",this.onReset);
            this.brandsModel.fetch();
        },
        render: function(){
            //this.template=library.getTemplate('goodslist/brandgrid.html');
            //this.$el.html(this.template);

            return this;
        },
        onRender:function(){

        },
        onReset: function(collection, options){

            var me = this;
            var result=[];

            for(var i=0;i<collection.models.length;){
                var s=i+3;
                if(s<collection.models.length){
                    result.push(collection.models.slice(i,i+3));
                }else{
                    result.push(collection.models.slice(i,collection.models.length));
                }
                i=s;
            }
            var rows="";
            result.forEach(function(it,index){
                var item="";
                if(index>0){
                    it.forEach(function(it,index){
                        if(index==1){
                            //item+='<div class=" condition-row-mid condition-item condition-item-mid" > <a href="'+it.get('url')+'"><img src="'+it.get('image')+'"></a> </div>';
                            item+='<div data-id="'+it.get('id')+'" class=" condition-row-mid condition-item condition-item-mid" > <img src="'+it.get('image')+'"> </div>';
                        }else{
                            //item+='<div class=" condition-row-mid condition-item" > <a href="'+it.get('url')+'"><img src="'+it.get('image')+'"></a> </div>';
                            item+='<div data-id="'+it.get('id')+'" class=" condition-row-mid condition-item" > <img src="'+it.get('image')+'"> </div>';

                        }
                    });
                } else{
                    it.forEach(function(it,index){
                        if(index==1){
                            item+='<div data-id="'+it.get('id')+'" class="condition-item condition-item-mid" > <img src="'+it.get('image')+'"> </div>';
                            //item+='<div class="condition-item condition-item-mid" > <a href="'+it.get('url')+'"><img src="'+it.get('image')+'"></a> </div>';
                        }else{
                            //item+='<div class=" condition-item" > <a href="'+it.get('url')+'"><img src="'+it.get('image')+'"></a> </div>';
                            item+='<div data-id="'+it.get('id')+'" class=" condition-item" > <img src="'+it.get('image')+'"> </div>';
                        }
                    });
                }
                rows+='<div class="condition-row " >'+item+'</div>';


            });

            //this.$('.condition-wrap').empty();
            //this.$('.condition-wrap').append(rows);
            var html='<div class="filtercondition-title"> <b class="filtercondition-title-icon">|</b><span>品牌</span> </div> <div class="condition-wrap"> '+rows+'</div>';
            this.$el.html(html);
            this.$el.find(".condition-wrap").on("click", ".condition-item",this.brandSelect.bind(this));

        },
        getValue:function(){
            return this.data;
        },
        brandSelect:function(e){
            var me = this;
            var hasEl=this.data.find(function(it){
                if(this.$(e.currentTarget).attr('data-id')==it){
                    return it;
                }
            });
            if(!hasEl){

                this.$(e.currentTarget).addClass('condition-item-selected');
                this.data.push(this.$(e.currentTarget).attr('data-id'));
            }else{

                this.data.find(function(it,index,arr){
                    if(this.$(e.currentTarget).attr('data-id')==it){
                        me.data.splice(index,1);
                    }
                });
                this.$(e.currentTarget).removeClass('condition-item-selected');
            }
            console.log(this.data);
        },
        onRemove:function(){
            BaseView.prototype.onRemove.apply(this);
            this.$(".condition-wrap").undelegate("click", ".condition-item",this.brandSelect.bind(this));

        }
    });
});