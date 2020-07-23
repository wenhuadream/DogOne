# DogOne
DogOne微信小程序，时间码同步，蓝牙同步LTC，蓝牙调试。

2020/07/22  wenhua
1：仓库建立。
2：工程文档建立。
 
2020/07/23 zbj
1: 在settingPage.js的234行 if((parseInt(utils.getMilliseconds(new Date()))) < 5 )修改了BUG， 重要语句 这里的时间小于5ms校时，也可以设置更小的值。  
2：在settingPage.js的75行 增加了onUnload时关闭蓝牙连接，否则后面不能搜索到这个设备。
3：index.js的130行，如果没有isopen ，尝试先关闭蓝牙再开启蓝牙。
4：index.js的152行，原来把isopen的数据更改位置放错，并且应该是isopen：false而不是ture。
5：修改了about.wxml，增加了版本的显示。
6：util.js的91行，将日期的“/”改为“-”，以保持和硬件的显示一致。
7：settingPage.wxss的23行增加 font-weight: bold;。
8: 修改了about.wxss的35行为3%。
