define(['react', 'hogan'], function(React, Hogan){

  return React.createClass({

    componentDidMount: function(){
      this.props.collection.on("add remove update reset sort", this.updateData);
    },
    componentWillUnmount: function(){
      this.props.collection.off("add remove update reset sort", this.updateData);
    },
    updateData: function(){
      this.setState({
        data: this.props.collection.toJSON()
      });
    },
    render: function(){
      this.state.data.map(function(item){
        // 编译模板
        var template = Hogan.compile(this.props.template);
        var html = template.render(item);
        return (
          <div className="table-view-cell" dangerouslySetInnerHTML={{__html: html}}></div>
        );
      }, this);

      return (
        <div className="ListView">
          <div className="scroller">
            <ul className="table-view">

            </ul>
            <button ref="loadMore" class="loadmore">
              <div class="label">加载更多</div>
              <span class="loading-icon"></span>
            </button>
            <div ref="endMessage" className="empty-view">
              没有更多数据
            </div>
            <div ref="errorMessage" className="error-view">
              网络异常
            </div>
          </div>
        </div>
      );
    }
  });
});
