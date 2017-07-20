/**
 * @Name	: TrainTickects
 * @Module	: App Module
 * @Author	: Linxiaozhou
 * @Date	: 2017.07.20
 * @Brief	: Query train tickects
 */


var https = require('https');
var fs = require('fs');


/* -------------------------------------------------- 公共函数 ------------------------------------------------ */
var CA_Cert = fs.readFileSync('./cert/srca_der.cer');

var _padding_str = function(str, len) {
	if("有"==str || "无"==str) {
		len = len - 1;
	}
	if(!str) {
		str = "- "
	}
	else {
		str = str+" "
	}
	while(str.length < len) {
		str = " "+str
	}
	return str;
}
var _padding_str1 = function(str, len) {
	if("----"==str) {
		str = '-----';
	}
	if(!str) {
		str = "- "
	}
	else {
		str = str+" "
	}
	while(str.length < len) {
		str = " "+str
	}
	return str;
}
var _padding_str2 = function(str, len) {
	if(-1 != str.indexOf("分钟")) {
		len = len - 2;
	}
	if("----"==str) {
		str = '-----';
	}
	if(!str) {
		str = "- "
	}
	else {
		str = str+" "
	}
	while(str.length < len) {
		str = " "+str
	}
	return str;
}


/*
 * 根据车站code转换为中文名称
 */
function TMapStations(code, map) {
	if(map) {
		var name = map[code];
		if(name) {
			return name
		}
	}
	return code;
}


/*
 * 打印有效车次
 */
function PrintTickects(config, tickects) {
	if(!tickects) {
		return;
	}
	if(0 >= tickects.length) {
		return;
	}
	var stations = tickects[0].fSation+"-"+tickects[0].tSation+" ";
	while(stations.length < 10) {
		stations = "  "+stations
	}
	console.log("|------------------------------------------------------------------------------------|")
	console.log("| ["+config.date+"] "+stations+" 车票情况                                             |")
	console.log("|------------------------------------------------------------------------------------|")
	console.log("| 车次 |      起止站    |  发车 |  到达 |商务|一等|二等|动卧|软卧|硬卧|软座|硬座|无座|")
	console.log("|------------------------------------------------------------------------------------|")
	for(var i=0; i<tickects.length; i++) {

		var tId = tickects[i].tId+" ";
		while(tId.length < 6) {
			tId = " "+tId
		}

		var stations = tickects[i].fSation+"-"+tickects[i].tSation+" ";
		while(stations.length < 10) {
			stations = "  "+stations
		}

		var sTime = " "+tickects[i].sTime+" ";
		var eTime = " "+tickects[i].eTime+" ";

		var info = "|"+tId

				  +"|"+stations
				  +"|"+sTime
				  +"|"+eTime

				  +"|"+_padding_str(tickects[i].bcSeat, 4)
				  +"|"+_padding_str(tickects[i].fcSeat, 4)
				  +"|"+_padding_str(tickects[i].scSeat, 4)

				  +"|"+_padding_str(tickects[i].dongwo, 4)

				  +"|"+_padding_str(tickects[i].ruanwo, 4)
				  +"|"+_padding_str(tickects[i].yingwo, 4)
				  +"|"+_padding_str(tickects[i].ruanzuo, 4)
				  +"|"+_padding_str(tickects[i].yingwo, 4)
				  +"|"+_padding_str(tickects[i].wuzuo, 4)
				  +"|"

		console.log(info)
	}
	console.log("|------------------------------------------------------------------------------------|")
}




/*
 * 打印中途停靠站及时刻列表
 */
function PrintStationList(sList) {
	if(!sList) {
		return;
	}
	if(0 >= sList.length) {
		return;
	}
	console.log("|---------------------------------------------|")
	console.log("| "+sList[0].station_train_code+" 停靠站信息                            |")
	console.log("|---------------------------------------------|")
	console.log("| 车序 |    站名   |  到站  |  出发  |  停靠  |")
	console.log("|---------------------------------------------|")
	for(var i=0; i<sList.length; i++) {

		var tId = sList[i].station_train_code+" ";
		while(tId.length < 6) {
			tId = " "+tId
		}

		var stations = sList[i].station_name+" ";
		while(stations.length < 8) {
			stations = "  "+stations
		}

		var arrive_time = " "+sList[i].arrive_time+" ";
		var start_time = " "+sList[i].start_time+" ";

		var info = "|"+_padding_str1(sList[i].station_no, 6)

				  +"|"+stations
				  +"|"+_padding_str1(sList[i].arrive_time, 8)
				  +"|"+_padding_str1(sList[i].arrive_time, 8)
				  +"|"+_padding_str2(sList[i].stopover_time, 8)

				  +"|"

		console.log(info)
	}
	console.log("|---------------------------------------------|")
}






/* -------------------------------------------------- 功能 ------------------------------------------------ */
// Declare
var OL_TrainTickects = function() {};


/**
 *@Func  : 根据日期、始发站和终到站查询车票
 *@Input1 : config - 配置参数: {
					date         : String, 日期, 格式"yyyy-mm-dd"
					from_station : String, 始发站车站代码，如"SZQ"
					end_station  : String, 终到站车站代码，如"XMS"
					print  		 : boolean, 是否后台打印
				}
 *@Input2: callback - 回调函数，返回的第一个参数为err
 */
OL_TrainTickects.prototype.QueryTickects = function(config, callback) {

	/* config Demo
	var Config = {
		date         : '2017-07-24',	// 日期, 格式"yyyy-mm-dd"
		from_station : 'SZQ',			// 始发站车站代码
		end_station  : 'XMS',			// 终到站车站代码
	};
	*/

	// Config
	var query_lefttickets = 'leftTicket/query?'
								+'leftTicketDTO.train_date='+config.date
								+'&leftTicketDTO.from_station='+config.from_station
								+'&leftTicketDTO.to_station='+config.end_station
								+'&purpose_codes=ADULT';
	var options = {
		rejectUnauthorized: false,  	 // 如果报错"SELF_SIGNED_CERT_IN_CHAIN"，则必须加上这个设置
		hostname: 'kyfw.12306.cn',		 //12306官网
		path: '/otn/'+query_lefttickets,
		ca : [CA_Cert]
	}

	// Cache
	var DataBuf = "";
	var Tickects = new Array();

	// Request
	var req = https.get(options, function(res){ 
		res.on('data',function(buf){
			DataBuf += buf;
		}); 

		res.on('end',function(){
			var resdata = JSON.parse(DataBuf);
			if(!resdata.status) {
				if(callback) {
					callback(err, null);
				}
				console.log(resdata.status)
				return
			}
			var data = resdata.data;
			var result = data.result
			var flag = data.flag
			var map = data.map
			var trainnum = result.length;

			// console.log(result[0])
			// console.log(result[0])
			console.log(result[0].split("|"))

			for(var i=0; i<trainnum; i++) 
			{
				var tickect = {};
				var temp = result[i].split("|");

				tickect.train_no = temp[2];	// 火车编号
				tickect.tId = temp[3];	    // Train ID

				tickect.fSation = TMapStations(temp[6], map);	// From Station Name
				tickect.tSation = TMapStations(temp[7], map);	// To Station Name

				tickect.sTime = temp[8];	// Start Time
				tickect.eTime = temp[9];	// End Time
				tickect.tTime = temp[10];	// Total Time
				tickect.date = temp[13];

				tickect.ruanwo = temp[23];	// 软卧
				tickect.ruanzuo = temp[24]; // 软座
				tickect.wuzuo = temp[26];	// 无座
				tickect.yingwo = temp[28];  // 硬卧
				tickect.yingzuo = temp[29]; // 硬座

				tickect.scSeat = temp[30];	// 二等座
				tickect.fcSeat = temp[31];	// 一等座
				tickect.bcSeat = temp[32];	// 商务座 / 特等座

				tickect.dongwo = temp[33];	// 动卧
				
				Tickects.push(tickect)
			}

			// Print Tickect List
			if(config.print) {
				PrintTickects(config, Tickects)
			}

			if(callback) {
				callback(null, Tickects);
			}
		});
	});

	req.on('error', function(err){
		if(callback) {
			callback(err, null);
		}
		console.error(err.code);
	})
}




/**
 *@Func  : 根据日期、始发站和终到站查询中途停靠站详情
 *@Input1 : config - 配置参数: {
					train_no     : String, 列车编号, 如"6i000D40920A"
					date         : String, 日期, 格式"yyyy-mm-dd"
					from_station : String, 始发站车站代码，如"SZQ"
					end_station  : String, 终到站车站代码，如"XMS"
					print  		 : boolean, 是否后台打印
				}
 *@Input2: callback - 回调函数，返回的第一个参数为err
 */
OL_TrainTickects.prototype.QueryStations = function(config, callback) {

	/* config Demo
	var Config = {
		train_no     : '6i000D40920A',	// 列车编号
		from_station : 'SZQ',			// 始发站车站代码
		end_station  : 'XMS',			// 终到站车站代码
		date         : '2017-07-24',	// 日期, 格式"yyyy-mm-dd"
	};
	*/
//var query_stations = 'https://kyfw.12306.cn/otn/czxx/queryByTrainNo?train_no=65000T837009&from_station_telecode='+Config.from_station+'&to_station_telecode='+Config.end_station+'&depart_date='+Config.date

	// Config
	var query_lefttickets = 'czxx/queryByTrainNo?'
								+'train_no='+config.train_no
								+'&from_station_telecode='+config.from_station
								+'&to_station_telecode='+config.end_station
								+'&depart_date='+config.date;
	var options = {
		rejectUnauthorized: false,  	 // 如果报错"SELF_SIGNED_CERT_IN_CHAIN"，则必须加上这个设置
		hostname: 'kyfw.12306.cn',		 //12306官网
		path: '/otn/'+query_lefttickets,
		ca : [CA_Cert]
	}

	// Cache
	var DataBuf = "";

	// Request
	var req = https.get(options, function(res){ 
		res.on('data',function(buf){
			DataBuf += buf;
		}); 

		res.on('end',function(){
			var resdata = JSON.parse(DataBuf);
			if(!resdata.status) {
				if(callback) {
					callback(err, null);
				}
				console.log(resdata.status)
				return
			}
			var data = resdata.data.data;
			var trainnum = data.length;

			// Print Tickect List
			if(config.print) {
				PrintStationList(data)
			}

			if(callback) {
				callback(null, data);
			}
		});
	});

	req.on('error', function(err){
		if(callback) {
			callback(err, null);
		}
		console.error(err.code);
	})
}





/*
 * 爬取全国车站信息
 */
OL_TrainTickects.prototype.CollectStations = function(callback){
	var option = {
		rejectUnauthorized: false,  // 如果报错"SELF_SIGNED_CERT_IN_CHAIN"，则必须加上这个设置
		hostname	: 'kyfw.12306.cn',
		path 		: '/otn/resources/js/framework/station_name.js?station_version=1.8964',
		ca 			: [CA_Cert]
	};
	var Raw = '';
	var req = https.get(option, function(res){
		res.on('data',function(buf){
			Raw += buf;
		});
		res.on('end', function(){
			try{
				var re = /\|[\u4e00-\u9fa5]+\|[A-Z]{3}\|\w+\|\w+\|\w+@\w+/g;
				var pinyinArray = [];
				var pystationData = {};
				var temp = Raw.match(re);
				[].forEach.call(temp, function(item,i) {
					var t = item.split("|");
					pinyinArray.push(t[3]);
					pystationData[t[3]]={
						name   : t[1],
						code   : t[2],
						pinyin : t[3],
						short  : t[4],
						other  : t[5]
					}
				});

				var data = {name:pinyinArray, data:pystationData};
				if(callback) {
					callback(null, data);
				}
			}catch(err){
				console.log(err);
			}
		});
	});
	req.on('error', function(err){
		if(callback) {
			callback(err, null);
		}
    	console.error(err.code);
	});
}



module.exports = new OL_TrainTickects();

