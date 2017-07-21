
# TrainTicket12306

这是一款用于在铁道部12306官网爬取车票等信息的node.js应用。

An app to query Tickects and other information from 12306 website by node.js

![img](https://raw.githubusercontent.com/KKDestiny/TrainTicket12306/master/doc/8.jpg)
![img](https://raw.githubusercontent.com/KKDestiny/TrainTicket12306/master/doc/9.jpg)

---

## master branch

master分支为最新功能，所有功能都会最终同步到这里。

---

## element branch

element分支为所有功能的原型

---

# 1.安装 Installation

+ 如果直接使用模块`TrainTickects`，则不需要任何依赖，直接引用此模块即可。建议切换到 `element` 分支，这个是核心部分。

Require `TrainTickects` directly if you just want to use `TrainTickects` module. It's recommended to use branch `element`, which is core part of all.


+ 如果你要查看网页Demo，则需要安装，直接执行 `npm install` 即可。

Execute `npm install` to install modules needed automaticly if you want to check website demo.

---

# 2.文件结构 FileStructure

`element`分支的主要文件结构如下：

Main Structure of branch `element`:

```
root
  |---TrainTickects.js   // TrainTickects Module
  |---test.js            // Debug file, you can use this file to test 
                         // each function in TrainTickects module
  |---package.json       // Dependences
  |---cert     
        |---srca_der.cer  // Certification
```

---

# 3.更新 Updates

## V0.0.1
首次提交于 2017/07/20，制作了 `TrainTickects` 模块，实现了三个简单功能：
+ 查询火车票
+ 查询中途停靠站列表
+ 收集所有火车站数据

## V1.0.0
2017/07/20 18:38 实现网页版小工具
+ 可以输入中文站名、日期，从而查询火车
+ 点击结果列表还可以查看本次列车的途经站点信息

## V1.1.0
2017/07/21 14:00 完善网页版功能
+ 输入出发地、目的地时，出现下来选项，不必输入完整的名称；拼音(大小写均可)和中文均支持
+ 到达时间与出发时间不在同一天时，会给出提示，“+1”、“+2”或更多
+ 新增过滤功能：过滤车次、站名

![效果](https://raw.githubusercontent.com/KKDestiny/TrainTicket12306/master/doc/10.jpg)


---

# 4.文档 Documents

## 4.1 12306接口 Interface

请求方式为：
Request:

`https`


Host：

`kyfw.12306.cn/`


查询前缀为：
Query Prefix:

`/otn/`


已知的几个接口有：

Known interfaces as follows:

|Interface | name  | rule | Demo |
|:---:|:---:|:---|:---|
| leftTicket/query | 查询符合条件的车票<br>Query tickets that satisfy query conditions  | leftTicketDTO.train_date=`<date>`<br>&leftTicketDTO.from_station=`<from_station>`<br>&leftTicketDTO.to_station=`<to_station>`<br>&purpose_codes=ADULT | leftTicketDTO.train_date=`2017-07-21`<br>&leftTicketDTO.from_station=`SZQ`<br>&leftTicketDTO.to_station=`XMS`<br>&purpose_codes=ADULT |
| czxx/queryByTrainNo | 查询某车次的途经站及时间<br>Query the stations&time of a train passing by  | train_no=`<train_no>`<br>&from_station_telecode=`<from_station_telecode>`<br>&to_station_telecode=`<to_station_telecode>`<br>&depart_date=`<depart_date>` | train_no=`6i000D40920A`<br>&from_station_telecode=`SZQ`<br>&to_station_telecode=`XMS`<br>&depart_date=`2017-07-21` |
| resources/js/framework/station_name.js | 获取所有火车站数据<br>Collection all stations data  | station_version=`<version>` | station_version=`1.8964` |


---

## 4.2 OL_TrainTickects.QueryTickects()

查询符合条件的车次、各类车票的剩余数量。

此接口为 `TrainTickects` 模块提供的接口，需要传入两个参数：`config` 和 `callback`。

其中 `config` 为对象，其属性包括：

+ `date`         : String, 日期, 格式"yyyy-mm-dd"
+ `from_station` : String, 始发站车站代码，如"SZQ"
+ `end_station`  : String, 终到站车站代码，如"XMS"
+ `print`  		 : boolean, 是否后台打印

`callback` 为回调函数，允许为空。


下面为一个简单的测试例子：

```javascript
var OL_TrainTickects = require('./TrainTickects');
// 测试查询火车票
var Config = {
		date         : '2017-07-24',	// 日期, 格式"yyyy-mm-dd"
		from_station : 'SZQ',			// 始发站车站代码，这里是深圳
		end_station  : 'XMS',			// 终到站车站代码，这里是厦门
		print        : true,			// 打印查询结果
	};
OL_TrainTickects.QueryTickects(Config, function(err, tickects) {
	// console.log(tickects)
});
```

执行效果：
![upload.png](https://raw.githubusercontent.com/KKDestiny/TrainTicket12306/master/doc/1.png)


---

## 4.3 OL_TrainTickects.QueryStations()

用于查询某车次的停靠站点及到站、发车和停靠时间。

此接口为 `TrainTickects` 模块提供的接口，需要传入两个参数：`config` 和 `callback`。

其中 `config` 为对象，其属性包括：

+ `train_no`: String, 列车编号, 如"6i000D40920A"
+ `from_station` : String, 始发站车站代码，如"SZQ"
+ `end_station`  : String, 终到站车站代码，如"XMS"
+ `date`         : String, 日期, 格式"yyyy-mm-dd"
+ `print`  		 : boolean, 是否后台打印

`callback` 为回调函数，允许为空。


下面为一个简单的测试例子：

```javascript
var OL_TrainTickects = require('./TrainTickects');

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
```

执行效果：

![upload.png](https://raw.githubusercontent.com/KKDestiny/TrainTicket12306/master/doc/2.png)


---

## 4.3 OL_TrainTickects.CollectStations()

手机全国所有火车站的数据。

此接口为 `TrainTickects` 模块提供的接口，只需要传入回调函数`callback`即可，允许为空。


下面为一个简单的测试例子：

```javascript
var OL_TrainTickects = require('./TrainTickects');

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

```

执行效果：

![upload.png](https://raw.githubusercontent.com/KKDestiny/TrainTicket12306/master/doc/3.png)


---

# 4.4 余票查询的返回数据

从12306获取到的原始数据结构如下：

```
{ 
  validateMessagesShowId: '_validatorMessage',
  status: true,
  httpstatus: 200,
  data:
  { 
     result: [ '3ec5X9fRSYq5hiOeUulIj%2F6TbXHRQBiBhbLIFmE0GQj8rPSTYtSYZl6KDzSfChayvwsPRbgom0Fc%0Afi61kzfkhRhOqB6nkxQCUwijG2opA6FpNXyvejLtqlVrbqTiTVZMukqyucS5ldEcSsttYhaiTEdq%0ADS3WuQw4FUd8LazFoDT5eVXtAfyaNuuMtD9VR5dJKNAyMMBDI8T%2FeCJu0pPMIpxF%2FY%2FkWAK%2FANmK%0AqEKHximPszTr|预订|6i000D40920A|D4092|IOQ|XKS|IOQ|XKS|06:40|10:16|03:36|Y|yx1mCzhcHlabqde2UZwX9Y8XCtPt2nDYQaY%2BBGBmT33wpoaD|20170724|3|Q6|01|07|1|0|||||||有||||有|有|||O0M0O0|OMO', 
   ...
   
    ],
  flag: '1',
  map: { XMS: '厦门', IOQ: '深圳北', XKS: '厦门北' },
  messages: [],
  validateMessages: {} 
}
```

对我们来说，有意义的数据只要两个：`data.result` 和 `map`。

其中，`data.result` 是一个数组，数组的每一个元素都代表一个符合条件的车次，包含了车次、起止站、各坐席票数等信息。

`map`是一个对象，属性名为火车站的代码，属性值为该代码对应的中文站名。

`map`的作用在于，当我们查询 `深圳` 到 `厦门` 的火车票时，可能出现 `深圳北` 、`厦门北` 这样的车站，它们和 `深圳` 到 `厦门`不同，需要做好对应关系。


关于如何使用这个映射关系，在4.6节会做介绍。


---


## 4.5  关于余票信息的数据处理

从12306获取到的每一个车次的余票信息的原始数据如下：

![upload.png](https://raw.githubusercontent.com/KKDestiny/TrainTicket12306/master/doc/4.png)

可以看出，这些数据是以 `|` 为分割的，因此可以通过 `split()` 函数来切分原始数据：

```javascript
arr = raw_data.split("|");

// Result
[ 
/* 0 */ 'uR7MTk54pjLluluefRzSndjJsuDNdhtgJK6caO246PF7XGyVDML5aJ6EgQZRE7yXyONObC8q4E5c%0ASfuGXEljez5PZuzJlFASnSuluBeLTzL06LR18feZ3AtLCG%2FjqeqBks3tpY168pxxeGdkPOr0rakC%0AhJ6gEXT%2Bbo0OSKVXn9fWm3pXsU16O9tZBcbD4LGLtUlynzNxM%2FB%2BN0rRNodacPi3VHx5wMIpgeaH%0AIF%2FkfW2ySCl1',
/* 1 */  '预订',
/* 2 */  '6i000D40920A',
/* 3 */  'D4092',
/* 4 */  'IOQ',
/* 5 */  'XKS',
/* 6 */  'IOQ',
/* 7 */  'XKS',
/* 8 */  '06:40',
/* 9 */  '10:16',
/* 10 */  '03:36',
/* 11 */  'Y',
/* 12 */  'VYa0L6Eo5FxIlzIT86a%2BZ1aAkg1iGV%2FwY8DzVKRX2iKk0iN%2B',
/* 13 */  '20170724',
/* 14 */  '3',
/* 15 */  'Q6',
/* 16 */  '01',
/* 17 */  '07',
/* 18 */  '1',
/* 19 */  '0',
/* 20 */  '',
/* 21 */  '',
/* 22 */  '',
/* 23 */  '',
/* 24 */  '',
/* 25 */  '',
/* 26 */  '有',
/* 27 */  '',
/* 28 */  '',
/* 29 */  '',
/* 30 */  '有',
/* 31 */  '有',
/* 32 */  '',
/* 33 */  '',
/* 34 */  'O0M0O0',
/* 35 */  'OMO' ]
```

可以看出，每个元素都严格对应一个数据；但是由于缺少文档，我不清楚每个位置代表什么意思。

不过，根据我们已知的情况， `arr[3]` 肯定是车次， `arr[8]` 肯定是发车时间， `arr[9]` 肯定是到达时间， `arr[10]` 肯定是总时间， `arr[13]` 肯定是乘车日期。

另外，根据后来做 `OL_TrainTickects.QueryStations()` 的时候分析其接口时可以知道：`arr[2]` 肯定是列车编号， 这个编号可以用在后面查询某车次中途停靠站信息中。

因此源代码中，是这样处理的：

```javascript
...

tickect.train_no = temp[2];	// 火车编号
tickect.tId = temp[3];	    // Train ID

tickect.sTime = temp[8];	// Start Time
tickect.eTime = temp[9];	// End Time
tickect.tTime = temp[10];	// Total Time
tickect.date = temp[13];

...
```

---

那么，剩余的一些字段该如何解读呢？

首先，我们看到了一些位置出现了 `有` 这个数值，但这并不足以让我们知道这些位置代表什么数据；我们看下面图中，一等座、二等座和无座三类席位都是 `有`，我们仅仅能知道第`26` `30` `31`个位置代表一等座、二等座和无座，并且顺序也不清楚。

![upload.png](https://raw.githubusercontent.com/KKDestiny/TrainTicket12306/master/doc/5.png)


---

这里提供一种比较笨的方法：大量查找不同起止站的列车，推理出各类坐席剩余票数在原始数据中的位置。

举个例子，我们在12306官网中查询一下`深圳`-`郑州`的列车：

![upload.png](https://raw.githubusercontent.com/KKDestiny/TrainTicket12306/master/doc/6.png)

可以知道商务座、一二等座的票数分别为 `16` `12` 和 `有`。那么我们同时查看余票的原始数据：

```
[ '9IQVfT3yCLkzmM1ZghLmyzwq%2Fn4vNliAfmnnwzZ01FtloWX5j1WC%2B2eLlKI7MhrbrUUwKKRc9zh7%0APzQNPa6qbZxP0F
9Sm4zin2w4d8sWSsB6ZlL8anu7LciQyVlV6XPMZqEMgcRW5T6tcH2MOmxuLsxH%0AE5L%2BJd8FmD029yCje%2F%2Bwir7yHyLyA
M7oElbTsa2c5C%2BfouxQU1V6lb1bcL%2FueyAUsI1qd0OObjT2%0Afg%3D%3D',
  '预订',
  '6i00000G7210',
  'G72',
  'NZQ',
  'BXP',
  'NZQ',
  'ZAF',
  '07:43',
  '14:56',
  '07:13',
  'Y',
  'UM2Ja13aKKsc6qxZtVDIqImzPYBW8yoFun0JxcFfLjb8BFPl',
  '20170724',
  '3',
  'Q6',
  '01',
  '10',
  '0',
  '0',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  /* 30 */ '有',
  /* 31 */ '12',
  /* 32 */ '16',
  '',
  'O0M090',
  'OM9' ]
```

这样，很明显`arr[30]` 代表的是二等座，`arr[31]` 代表的是一等座，`arr[32]` 商务座。

用同样的方式，再查找其他车次的车票数，只要不全是相同的值，我们就能够通过对比这两个信息得到各个位置代表什么坐席。

根据多次尝试，得到以下结果(2017.07.20)：

```javascript
tickect.ruanwo = temp[23];	// 软卧
tickect.ruanzuo = temp[24]; // 软座
tickect.wuzuo = temp[26];	// 无座
tickect.yingwo = temp[28];  // 硬卧
tickect.yingzuo = temp[29]; // 硬座

tickect.scSeat = temp[30];	// 二等座
tickect.fcSeat = temp[31];	// 一等座
tickect.bcSeat = temp[32];	// 商务座 / 特等座

tickect.dongwo = temp[33];	// 动卧
```


---


## 4.6 始发站/终点站 与 出发站/到达站

4.5中的余票数据中，有四个站点代码：

```
/* 4 */  'IOQ',
/* 5 */  'XKS',
/* 6 */  'IOQ',
/* 7 */  'XKS',
```

发现4和6、5和7是一样的代码。原因很简单，因为我们出发的火车站就是始发站、到达的火车站就是终点站。

那么到底前两个是始发站/终点站，还是后两个是？我们可以在12306官网找一个例子：`深圳`-`梅州`的列车只有一趟，很好分析：

![upload.png](https://raw.githubusercontent.com/KKDestiny/TrainTicket12306/master/doc/7.png)

所以我们可以更改一下查询条件：`惠州`-`兴宁`，结果为：

```
// {HCQ: "惠州", ENQ: "兴宁"}


/* 4 */  'SZQ',
/* 5 */  'MOQ',
/* 6 */  'HCQ',
/* 7 */  'ENQ',
```

因此可以确定，`5`和`6`为此列车的始发站和终点站，`6`和`7`为实际的出发站和到达站。


由此，我们也可以根据`map`信息来得到火车站代码对应的中文名：

```javascript
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

...

// 解析余票信息部分代码
tickect.fSation = TMapStations(temp[6], map);	// From Station Name
tickect.tSation = TMapStations(temp[7], map);	// To Station Name

...
```

---

# 感谢

感谢 **落花落雨不落叶** 的博文提供的帮助！

http://www.cnblogs.com/hongrunhui/p/6284192.html



