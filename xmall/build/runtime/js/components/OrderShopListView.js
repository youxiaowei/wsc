define(['./ListView'], function(ListView){
	return ListView.extend({

    getCollection: function(){
    	return this.collection;
    },
	});
});
