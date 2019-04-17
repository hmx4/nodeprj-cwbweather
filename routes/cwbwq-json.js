//*****************************************************************
//  透過呼叫中央氣象局(CWB)氣象開放資料API查詢台灣地區城市天氣資訊
//*****************************************************************
module.exports.cwbwq_json = cwbwq_json;

// 定義cwbwq(cb)函數，cb為其callback函數
function cwbwq_json(city, cb)
{
	var request = require('request');
	var querystring = require('querystring');

	// create the url for querying cwb weather API
	var baseurl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?";
	var AuthCode = "CWB-7B45C9F6-0A6A-48DE-AACF-AEC9D4EDE5E2"; // 請抽換成你的中央氣象局授權碼
	var citystring =  querystring.stringify('locationName=' + city);
	var qstring = citystring + "&elementName=T,RH,WeatherDescription,MaxT,MinT&format=JSON";
	var cwbweatherurl = baseurl + qstring;
	//
	request(
		{
			url: cwbweatherurl,
			headers:{
				Authorization: AuthCode 
			},
			method: 'GET'
		},
		function (err, response, body){
			if (err) 
				console.log(err);
			else 
			{
				try
				{
					// 將回傳的JSON字串轉成javascript的JSON物件
					sdata = JSON.parse(body);
					// 取得最新一筆平均溫度(攝氏度)
					temperature = sdata['records']['locations'][0]['location'][0]['weatherElement'][0]['time'][0]['elementValue'][0]['value'];
					// 取得最新一筆平均相對溼度
					humidity = sdata['records']['locations'][0]['location'][0]['weatherElement'][1]['time'][0]['elementValue'][0]['value'];
					// 取的最新一筆天氣預報綜合描述
					condition = sdata['records']['locations'][0]['location'][0]['weatherElement'][3]['time'][0]['elementValue'][0]['value'];
					// 取得天氣資訊建立時間
					time = sdata['records']['locations'][0]['location'][0]['weatherElement'][0]['time'][0]['startTime'];
					//
					var hightemps=[];
					var lowtemps=[];
					// 取得未來一週最高溫度及最低溫度預報值(攝氏12)
					for(i=0; i<=13; i++)
					{
						hightemp = sdata['records']['locations'][0]['location'][0]['weatherElement'][4]['time'][i]['elementValue'][0]['value'];
						hightemps.push(hightemp);
						lowtemp = sdata['records']['locations'][0]['location'][0]['weatherElement'][2]['time'][i]['elementValue'][0]['value'];
						lowtemps.push(lowtemp);		
					}
					// 建立城市簡單天氣資訊之JSON物件
					city_data = {'city':city, 'temperature':temperature, 'humidity':humidity, 'condition':condition, 'time':time, 'hightemps':hightemps, 'lowtemps':lowtemps};
					cb(city_data);
				}
				catch(ex)
				{
					console.log(ex.toString());
					city_data = {};
					cb(city_data);
				}
			}
				
		}
	); 
}

