define([
  'underscore',
  './BaseView'
], function(_, BaseView){

  /*
   * Title text with link
   */
  return BaseView.extend({

    type: 'TitleView',

    defaults: {
      title: '标题'
    },

    configure: function(options) {
      this.textNode.textContent = options.title;
      if (options.href) {
        this.link.href = options.href;
      }
    },

    render: function(){

      // link node
      var link = this.link = document.createElement('a');
      link.href = 'javascript:void(0)';

      // title text node
      var textNode = this.textNode = document.createTextNode(this.options.title || '');

      // build structure
      link.appendChild(textNode);
      this.el.appendChild(link);

      return this;
    }

  });
});
