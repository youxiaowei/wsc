define(['backbone'], function(Backbone){

  return Backbone.Model.extend({
    //url: function(){
    //  return "";
    //},
    //
    defaults: {
      account: '',
      name: '',
      sex: '保密',
      birthday: '',
      headurl: './images/login/person_head.png',
      phoneNum:''
    },
    //
    //parse: function(data){
    //
    //  return data;
    //}

  });
});
