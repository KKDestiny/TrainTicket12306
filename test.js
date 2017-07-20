/**
 * @Name	: debug
 * @Module	: App Module
 * @Author	: Linxiaozhou
 * @Date	: 2017.07.20
 * @Brief	: Debug
 */


var OL_TrainTickects = require('./TrainTickects');



// 测试查询火车票
var Config = {
		date         : '2017-07-24',	// 日期, 格式"yyyy-mm-dd"
		from_station : 'SZQ',			// 始发站车站代码
		end_station  : 'XMS',			// 终到站车站代码
		print        : true,			// 是否打印
	};
OL_TrainTickects.QueryTickects(Config, function(err, tickects) {
	// console.log(tickects)
});
return



// 测试查询中途停靠站列表
var Config = {
		train_no     : '6i000D40920A',	// 列车编号
		from_station : 'SZQ',			// 始发站车站代码
		end_station  : 'XMS',			// 终到站车站代码
		date         : '2017-07-24',	// 日期, 格式"yyyy-mm-dd"
		print        : true,			// 是否打印
	};
OL_TrainTickects.QueryStations(Config, function(err, sList) {
	// console.log(sList)
});
return



// 测试收集所有火车站数据
OL_TrainTickects.CollectStations(function(err, data) {
	var fs = require('fs');
	// 写入js文件
	var dir = "./js/"
	if(!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
	fs.writeFile(dir+'stations_py.js', "var StationData = "+JSON.stringify(data));
})
return




