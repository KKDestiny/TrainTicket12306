

var express = require('express');
var router = express.Router();


var fs = require('fs');

var OL_TrainTickects = require('./../TrainTickects');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



// 更新火车站数据文件
router.post('/rebase', function(req, res, next) {
	OL_TrainTickects.CollectStations(function(err, data) {
		var fs = require('fs');
		// 写入js文件
		var dir = "./public/js/"
		if(!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}
		fs.writeFile(dir+'stations_py.js', "var StationData = "+JSON.stringify(data));
		
		if(!err) {
			res.json({success:"SUCCESS"})
		}
		else {
			res.json({error:err})
		}
		
	})
});





module.exports = router;
