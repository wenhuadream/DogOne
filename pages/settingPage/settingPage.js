// pages/setPage/setPage.js
var app = getApp();
var utils = require("../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    textLog: "",
    deviceId: "",
    name: "",
    allRes: "",
    serviceId: "",
    readCharacteristicId: "",
    writeCharacteristicId: "",
    notifyCharacteristicId: "",
    connected: true,
    canWrite: false,
    date:"",//实时日期
    time:"",//实时时间
    isPAL:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var devid = decodeURIComponent(options.deviceId);
    var devname = decodeURIComponent(options.name);
    var devserviceid = decodeURIComponent(options.serviceId);
    var log = that.data.textLog + "设备名=" + devname + "\n设备UUID=" + devid + "\n服务UUID=" + devserviceid + "\n";
    this.setData({
      textLog: log,
      deviceId: devid,
      name: devname,
      serviceId: devserviceid,
    });
    //获取特征值
    that.getBLEDeviceCharacteristics();
    //定时器
    setInterval(function(){
      that.setData({
        time: utils.formaotTimeToView(new Date(),that.data.isPAL?1000/25:1000/30),
        date: utils.formatDateToView(new Date()),
      });    
  },20);  
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.setKeepScreenOn) {
      wx.setKeepScreenOn({
        keepScreenOn: true,
        success: function (res) {
          //console.log('保持屏幕常亮')
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

    //退出页面
  backPage: function() {//无操作
    closeBLEConnection;
  },

  //清空log日志
  startClear: function () {
    var that = this;
    that.setData({
      textLog: ""
    });
  },
  //返回蓝牙是否正处于链接状态
  onBLEConnectionStateChange: function (onFailCallback) {
    wx.onBLEConnectionStateChange(function (res) {
      // 该方法回调中可以用于处理连接意外断开等异常情况
      console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`);
      return res.connected;
    });
  },
  //断开与低功耗蓝牙设备的连接
  closeBLEConnection: function () {
    var that = this;
    wx.closeBLEConnection({
      deviceId: that.data.deviceId
    })
    that.setData({
      connected: false,

    });
    wx.showToast({
      title: '连接已断开',
      icon: 'success'
    });
    setTimeout(function () {
      wx.navigateBack();
    }, 2000)
  },
  //获取蓝牙设备某个服务中的所有 characteristic（特征值）
  getBLEDeviceCharacteristics: function (order) {
    var that = this;
    wx.getBLEDeviceCharacteristics({
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      success: function (res) {
        for (let i = 0; i < res.characteristics.length; i++) {
          let item = res.characteristics[i]
          if (item.properties.read) {//该特征值是否支持 read 操作
            var log = that.data.textLog + "该特征值支持 read 操作:" + item.uuid + "\n";
            that.setData({
              textLog: log,
              readCharacteristicId: item.uuid
            });
          }
          if (item.properties.write) {//该特征值是否支持 write 操作
            var log = that.data.textLog + "该特征值支持 write 操作:" + item.uuid + "\n";
            that.setData({
              textLog: log,
              writeCharacteristicId: item.uuid,
              canWrite: true
            });

          }
          if (item.properties.notify || item.properties.indicate) {//该特征值是否支持 notify或indicate 操作
            var log = that.data.textLog + "该特征值支持 notify 操作:" + item.uuid + "\n";
            that.setData({
              textLog: log,
              notifyCharacteristicId: item.uuid,
            });
            that.notifyBLECharacteristicValueChange();
          }

        }

      }
    })
    // that.onBLECharacteristicValueChange();   //监听特征值变化
  },
  //启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。
  //注意：必须设备的特征值支持notify或者indicate才可以成功调用，具体参照 characteristic 的 properties 属性
  notifyBLECharacteristicValueChange: function () {
    var that = this;
    wx.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      characteristicId: that.data.notifyCharacteristicId,
      success: function (res) {
        var log = that.data.textLog + "notify启动成功" + res.errMsg + "\n";
        that.setData({
          textLog: log,
        });
        that.onBLECharacteristicValueChange();   //监听特征值变化
      },
      fail: function (res) {
        wx.showToast({
          title: 'notify启动失败',
          mask: true
        });
        setTimeout(function () {
          wx.hideToast();
        }, 2000)
      }

    })

  },
  //监听低功耗蓝牙设备的特征值变化。必须先启用notify接口才能接收到设备推送的notification。
  onBLECharacteristicValueChange: function () {
    var that = this;
    wx.onBLECharacteristicValueChange(function (res) {
      var resValue = utils.ab2hext(res.value); //16进制字符串
      var resValueStr = utils.hexToString(resValue);

      var log0 = that.data.textLog + "成功获取：" + resValueStr + "\n";
      that.setData({
        textLog: log0,
      });

    });
  },
  //界面跳转，跳转到调试模式界面
  goFunctionPage: function () {
    var that = this;
  
  //将主页面传过来的信息原封传到设置界面
    wx.navigateTo({
      url: '/pages/functionPage/functionPage?name=' + encodeURIComponent(that.data.name) + '&deviceId=' + encodeURIComponent(that.data.deviceId) + '&serviceId=' + encodeURIComponent(that.data.serviceId)
       });
  },
  //orderInput
  orderInput: function (e) {
    this.setData({
      orderInputStr: e.detail.value
    })
  },
  //发送指令按钮绑定函数
  sentOrder: function () {
    var that = this;
    var orderStr = "SetDate"+utils.formatDate(new Date()).slice(2);//去除年份前面的两位
    console.log(orderStr);
    let order = utils.stringToBytes(orderStr);
    that.writeBLECharacteristicValue(order);//设置日期

    //设置时间
    setTimeout(function () {//延时执行，
      var nowTime = new Date();//现在时间

      var sendtime = setInterval(function(){
          nowTime = new Date();
         if((1000-parseInt(utils.getMilliseconds(nowTime))) ==1000 ){
             clearInterval(sendtime);//先关闭定时器
             orderStr =  "SetTime"+utils.formatTime(nowTime);//去除年份前面的两位
             console.log(orderStr);
             order = utils.stringToBytes(orderStr);
             that.writeBLECharacteristicValue(order);
          }
      },1); //1ms定时器
    }, 100) //延迟50毫秒后执行
  },
  //向低功耗蓝牙设备特征值中写入二进制数据。
  //注意：必须设备的特征值支持write才可以成功调用，具体参照 characteristic 的 properties 属性
  writeBLECharacteristicValue: function (order) {
    var that = this;
    let byteLength = order.byteLength;
    var log = that.data.textLog + "当前执行指令的字节长度:" + byteLength + "\n";
    that.setData({
      textLog: log,
    });

    wx.writeBLECharacteristicValue({
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      characteristicId: that.data.writeCharacteristicId,
      // 这里的value是ArrayBuffer类型
      value: order.slice(0, 20),
      success: function (res) {
        if (byteLength > 20) {
          setTimeout(function () {
            // that.writeBLECharacteristicValue(order.slice(20, byteLength));
          }, 150);
        }
        var log = that.data.textLog + "写入成功：" + res.errMsg + "\n";
        that.setData({
          textLog: log,
        });
      },

      fail: function (res) {
        var log = that.data.textLog + "写入失败" + res.errMsg + "\n";
        that.setData({
          textLog: log,
        });
      }

    })
  },

  //单选框绑定函数
  radioChange:function(){
    var that = this;
    that.setData({
      isPAL: !that.data.isPAL,
    }); 
    
    var orderStr = that.data.isPAL?"SetModePAL":"SetModeNTSC";
    console.log(orderStr);
    var order = utils.stringToBytes(orderStr);
    that.writeBLECharacteristicValue(order);//发送设置
  },
  //查找设备按钮绑定函数
  findDevice:function(){
    var that = this;
    var orderStr = "SearchIt";
    console.log(orderStr);
    let order = utils.stringToBytes(orderStr);
    that.writeBLECharacteristicValue(order);//
  }
  
})