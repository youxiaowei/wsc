define(['./BaseView', '../models/AddressDetailModel', 'require', '../libs/cityselector/jquery.cxselect', '../loader'], function(BaseView, addressModel, require, ct, loader) {
  return BaseView.extend({

    defaults: {
      pageStatus: 'add'
    },
    _this: null,
    addressInfo: null,
    events: {
      "click .goback": "goback",
      "click .address-editBtn": "saveClick"
    },

    initialize: function() {
      _this = this;

    },
    render: function() {
      // 异步加载
      loader.getTemplate('addressEditView.html')
          .then(function(template) {
          //编辑收货地址
          var _this = this;
          window.setTimeout(function(){
            if (_this.options.pageStatus != 'add') {
              _this.addressInfo = new addressModel(_this.options.addressInfo);
              _this.onDetailSuccess(template,_this.addressInfo.toJSON());
            } else {
              _this.addressInfo = new addressModel({receiverAddr:""});
              _this.onDetailAddSuccess(template(_this.addressInfo.toJSON()));
            }
          },11);

        }.bind(this))
        .catch(function() {
          this.$el.text('Failed to load fragment: ' + arguments);
        }.bind(this));
      return this;
    },
    onDetailSuccess: function(template, data) {
      this.$el.empty().append(template(data));
      this.onEditAddr(data);
    },
    onDetailAddSuccess: function(template) {
      this.$el.empty().append(template);
      this.onRender();
    },
    onDetailError: function() {

    },
    onEditAddr: function(data) {
      var _this = this;
      $(".address-edit-info").show();
      // ymall api /initDefaddress
      // wemall api /getProvinceList
      _this.sendData(window.app.api + "/my-address/getProvinceList", {}, function(res1) {
        if (res1.status == '0') {
          var html = '';
          for (var i = 0; i < res1.data.length; i++) {
            html += "<option value=" + res1.data[i].id + ">" + res1.data[i].name + "</option>";
          }
          $("#city select[name='address.idP']").append(html);
          $("#city select[name='address.idP']").val(data.receiverProvinceId);
          $("#city select[name='address.idP']").trigger('change', [true]);
        }
      });

      $("#city select[name='address.idP']").bind('change', function(e, firstload) {
        _this.sendData(window.app.api + "/my-address/getCityList", {
          pid: e.target.value
        }, function(res2) {
          if (res2.status == '0') {
            var tmp = '<option value=-1>请选择</option>';
            var html = '<option value=-1>请选择</option>';
            for (var i = 0; i < res2.data.length; i++) {
              html += "<option value=" + res2.data[i].id + ">" + res2.data[i].name + "</option>";
            }
            $("#city select[name='address.idCity']").empty();
            $("#city select[name='address.idArea']").empty();
            $("#city select[name='address.idArea']").append(tmp);
            $("#city select[name='address.idCity']").append(html);
            if (firstload) {
              $("#city select[name='address.idCity']").val(data.receiverCityId);
              $("#city select[name='address.idCity']").trigger('change', [true]);
            }
          }
        });
      });
      $("#city select[name='address.idCity']").bind('change', function(e, firstload) {

        _this.sendData(window.app.api + "/my-address/getCityList", {
          pid: e.target.value
        }, function(res2) {
          if (res2.status == '0') {
            var html = '<option value=-1>请选择</option>';
            for (var i = 0; i < res2.data.length; i++) {
              html += "<option value=" + res2.data[i].id + ">" + res2.data[i].name + "</option>";
            }
            $("#city select[name='address.idArea']").empty();
            $("#city select[name='address.idArea']").append(html);
            if (firstload) {
              $("#city select[name='address.idArea']").val(data.receiverRegionId);
            }
          }
        });
      });
    },
    onRender: function() {
      var _this = this;
      $(".address-edit-info").show();
      _this.sendData(window.app.api + "/my-address/getProvinceList", {}, function(res1) {
        if (res1.status == '0') {
          var html = '';
          for (var i = 0; i < res1.data.length; i++) {
            html += "<option value=" + res1.data[i].id + ">" + res1.data[i].name + "</option>";
          }
          $("#city select[name='address.idP']").append(html);
        }
      });
      $("#city select[name='address.idP']").bind('change', function(e) {
        _this.sendData(window.app.api + "/my-address/getCityList", {
          pid: e.target.value
        }, function(res2) {
          if (res2.status == '0') {
            var tmp = '<option value=-1>请选择</option>';
            var html = '<option value=-1>请选择</option>';
            for (var i = 0; i < res2.data.length; i++) {
              html += "<option value=" + res2.data[i].id + ">" + res2.data[i].name + "</option>";
            }
            $("#city select[name='address.idCity']").empty();
            $("#city select[name='address.idArea']").empty();
            $("#city select[name='address.idArea']").append(tmp);
            $("#city select[name='address.idCity']").append(html);
          }
        });
      });
      $("#city select[name='address.idCity']").bind('change', function(e) {
        _this.sendData(window.app.api + "/my-address/getCityList", {
          pid: e.target.value
        }, function(res2) {
          console.log(res2);
          if (res2.status == '0') {
            var html = '<option value=-1>请选择</option>';
            for (var i = 0; i < res2.data.length; i++) {
              html += "<option value=" + res2.data[i].id + ">" + res2.data[i].name + "</option>";
            }
            $("#city select[name='address.idArea']").empty();
            $("#city select[name='address.idArea']").append(html);
          }
        });
      });

    },

    addressModel: null,
    getAddressModel: function() {
      if (!this.addressModel) {
        var AddressModel = require('../models/BaseModel');
        this.addressModel = new AddressModel();
      }
      return this.addressModel;
    },

    sendData: function(url, data, callback) {
      var model = this.getAddressModel();
      model.ajaxOptions = {
        url: url,
        type: 'POST',
        data: data,
        success: callback,
        error: function() {
        },
      }
      model.loadData();
    },
    vertify: function(v) {
      if (v && v != -1) {
        return v;
      } else {
        library.Toast("所有信息都必须填写完整哦");
        return;
      }
    },
    saveClick: function(e) {
      //判断是修改的还是新增的
      var _this = this;
      var user = window.application.getUserInfo();
      if (!user) {
        library.Toast('您尚未登录');
        return;
      }
      var address = {
        userId: user.userid,
        receiver: this.$el.find('.aName').val(),
        receiverAddr: this.$el.find('.aDetail').val(),
        receiverPhone: this.$el.find('.aLink').val(),
        receiverRegion: this.$el.find('.area').val(),
        receiverProvince: this.$el.find('.province').val(),
        receiverCity: this.$el.find('.city').val()
      };
      for (var x in address) {
        if (x == 'receiverPhone') {
          if (!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(address[x]))) {
            library.Toast("不是完整的11位手机号或者正确的手机号前七位");
            return;
          }
        }
        if (!address[x]) {
          library.Toast('所有信息必须填写完整');
          return;
        }
      }
      var model = this.getAddressModel();
      if (this.options.pageStatus == 'edit') { // 修改地址
        address.addressId = this.addressInfo.get("addressId");
        model.ajaxOptions = {
          url: window.app.api + '/my-address/edit',
          data: address,
          success: this.createAddressSuccess.bind(this),
          error: function() {
          },
        }
      } else { // 新建收货地址
        model.ajaxOptions = {
          url: window.app.api + '/my-address/add',
          data: address,
          success: this.createAddressSuccess.bind(this),
          error: function() {
          },
        }
      }
      this.$el.removeClass('addressEdit-view-show');
      model.loadData();
    },
    createAddressSuccess: function() {
      this.$el.removeClass('addressEdit-view-show');
      this.options.callback && this.options.callback('save');
    },
    createAddressError: function() {
      library.Toast('保存失败，服务器在开小差', 1000);
    },
    goback: function(e) {
      this.$el.removeClass('addressEdit-view-show');
    },
    remove: function() {
      Backbone.View.prototype.remove.apply(this, arguments);
    },

  });
});
