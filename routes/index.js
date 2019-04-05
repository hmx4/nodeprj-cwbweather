// javascript和C一樣使用//表示單行註解，使用/* */表示多行註解
// 載入express模組 
var express = require('express');
/* 使用express.Router類別來建立可裝載的模組路由的物件
   路由是指應用程式端點 (URI) 的定義，以及應用程式如何回應用戶端的要求。*/
var router = express.Router();

// 載入request模組
var request = require('request');

// 取得Server端的ip，請記得在專案中安裝underscore模組: npm install underscore
var sip = require('underscore')
    .chain(require('os').networkInterfaces())
    .values()
    .flatten()
    .find({family: 'IPv4', internal: false})
    .value()
    .address;
console.log('Server IP='+sip);

//**************************************************************************
//************ 根據Client端送來之請求命令顯示相對應網頁之方法 ************
//**************************************************************************
// 建立(附加)一個客戶端對應用程式提出 GET / 方法時的路由處理方法(匿名式函數)
// 比照此方式，你可以建立其他GET不同路徑的路由處理方法
// 顯示首頁
router.get('/', function(req, res) {
	res.render('index');
});

// 顯示天氣查詢服務操作介面
router.get('/cwbweather', function(req, res) {
	res.render('cwbweather');
});

//*****************************************************************************************
//*********************** 使用中央氣象局開放天氣Web API查詢天氣狀況之服務方法******************
//*****************************************************************************************
// 建立(附加)一個客戶端對應用程式提出 POST /cwbweather/:selectedcity 方法時的路由處理方法(匿名式函數)
// 比照此方式，你可以建立其他POST不同路徑的路由處理方法
router.post('/cwbweather/:selectedcity', function(req, res){
	res.setHeader('Access-Control-Allow-Origin', '*'); //  允許其他網站的網頁存取此服務
	var selectedcity=req.params.selectedcity;  // 從路由參數中取出城市名稱

	// 引用相同目錄(routes)下的cwbwq-json.js
	var cwbwq = require('./cwbwq-json.js');
	cwbwq.cwbwq_json(selectedcity, handle_citydata);
	
	// define the callback function the for the function ywq_json(woeid, cb)
	function handle_citydata(city_data){
		console.log(city_data.city);
		res.send(city_data);	
	}
});

module.exports = router;