define(['./StaticCollection'], function(StaticCollection){
    return StaticCollection.extend({
        demoData:{
            items : [
                {
                    cardId : "LC1234453",
                    cardValue : "10"
                },
                {
                    cardId : "LC1234455",
                    cardValue : "20"
                }
            ]
            
        },
        initialize: function(){
            this.reset(this.demoData.items);
        }

    });
});