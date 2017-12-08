//获取数据
var json_data;
var obj = function(url, opt) {
	$.ajax({
		type: "post",
		url: url,
		async: true,
		success: function(data) {
			console.log(data);
			json_data = data;
		}
	});
}
//冒泡排序
function maopao(arr) {
	var shuzu = arr;
	for(var i = 0; i < shuzu.length - 1; i++) {
		for(var j = 0; j < shuzu.length - i - 1; j++) {
			var mao1 = shuzu[j].value;
			var mao2 = shuzu[j + 1].value;
			if(mao1 < mao2) {
				var mao = shuzu[j];
				shuzu[j] = shuzu[j + 1];
				shuzu[j + 1] = mao;
			}
		}

	}
	//console.log(shuzu);
	return shuzu;
}
//数组删除
function removeByValue(arr, val) {
 
  for(var i=0; i<arr.length; i++) {
    if(arr[i] == val) {
      console.log("ddddd")
      arr.splice(i, 1);
      break;
    }
  }
}



function changeColorArray(arr,color){
	
	if(arr.length == 0 ||color ==undefined){
		return
	}else{
		removeByValue(arr,color);
		arr[arr.length] = color
	}
	
}
/*
 
 * 处理函数，type为类型，分为radar、bar、line，theme为主题，人口和房屋
 * arr_area_name为区域名，比如XX镇
 * item为雷达图中的条目
 * 
 * */
function doHandleDataByNameAndYear(json_data, type, theme, arr_area_name, year, item) {

	dict_year_data = json_data.data[theme].data[year]
	dict_time_line_data = json_data.data[theme].data
	if(type == "radar") {
		return DoHandleRadarData(dict_year_data, arr_area_name, type)
	} else if(type == "line" || type == "bar") {
		return DoHandlelineOrBarData(dict_year_data, arr_area_name, type, item)
	} else if(type == "pie" || type == "sort_bar") {
		return DoHandlePieData(dict_year_data, item);
	} else if(type == "timeline") {

		return DoHandleTimeLineData(dict_time_line_data);
	} else if(type == "colormap") {

		return DoGetMapColor(dict_year_data);
	}else if(type == "get_per_area_data") {

		return DoGetPerAreaData(dict_year_data, arr_area_name)
	}
}

/*
 * 处理雷达数据，返回格式为
 *  [{
			value: [4300, 10000, 28000, 35000],
				name: '预算分配'
			},
			{
				value: [5000, 14000, 28000, 31000],
				name: '实际开销'
			}
		]

 */
function DoHandleRadarData(dict_year_data, arr_area_name, type) {
	arr_radar_return_data = []
	for(var i = 0; i < arr_area_name.length; i++) {
		dict_radar_data = {}
		dict_radar_data["value"] = dict_year_data[arr_area_name[i]]["radar_data"]
		dict_radar_data["name"] = arr_area_name[i]

		arr_radar_return_data.push(dict_radar_data)

	}
	//console.log(arr_radar_return_data)
	return arr_radar_return_data

}
/*
 * 处理line和bar数据，返回格式为
 */
function DoHandlelineOrBarData(dict_year_data, arr_area_name, type, item) {
	arr_return_data = []
	for(var i = 0; i < arr_area_name.length; i++) {
		dict_line_data = {}
		arr_temp_data = []
		dict_bar_data = {}
		month_data = dict_year_data[arr_area_name[i]]["month_data"]
		for(var k in month_data) {
			arr_temp_data.push(month_data[k][item])
		}

		dict_line_data["data"] = arr_temp_data
		dict_line_data["name"] = arr_area_name[i]
		dict_line_data["type"] = type

		arr_return_data.push(dict_line_data)

	}
	//console.log(arr_return_data)
	return arr_return_data
}

/*
 处理占比图的数据
 * */
function DoHandlePieData(dict_year_data, item) {

	arr_temp_data = []
	obj_temp_data = {}
	for(var i in dict_year_data) {

		obj_temp_data["name"] = i
		obj_temp_data["value"] = dict_year_data[i][item]
		arr_temp_data.push(obj_temp_data)
		obj_temp_data = {}
	}
	//console.log(arr_temp_data)
	return maopao(arr_temp_data)
}

function DoHandleTimeLineData(dict_time_line_data) {
	arr_temp_data = []
	for(var i in dict_time_line_data) {
		arr_temp_data.push(i)

	}
	//	console.log(arr_temp_data)
	return arr_temp_data
}
function DoGetPerAreaData(dict_year_data, arr_area_name) {
	str_return = dict_year_data[arr_area_name]["total_population"]
//	console.log(str_return)
	return str_return
}
function DoCalculateCorlor(data) {

	str_return_data = ""
	if(data > 0 && data <= 10) {
		str_return_data = "#4f6eed"
	} else if(data > 10 && data <= 20) {
		str_return_data = "#5596ff"
	} else if(data > 20 && data <= 30) {
		str_return_data = "#99cdff"
	} else if(data > 30 && data <= 50) {
		str_return_data = "#c1cfff"
	} else if(data > 50) {
		str_return_data = "#eaebff"
	}
	return str_return_data
}

function DoGetMapColor(dict_year_data) {

	obj_rid_data = filterId();
	//	obj_rid_data = $.mapSvgRid
	arr_temp_return = []
	obj_temp_return = {}
	for(var i in dict_year_data) {
		obj_temp_return["rid"] = obj_rid_data[i];
		obj_temp_return["name"] = i;
		obj_temp_return["fill"] = DoCalculateCorlor(dict_year_data[i]["total_population"]);
		//console.log(DoCalculateCorlor(dict_year_data[i]["total_population"]))
		//console.log(dict_year_data[i]["total_population"])
		arr_temp_return.push(obj_temp_return)
		obj_temp_return = {}
	}
//	console.log(arr_temp_return);
	return arr_temp_return
}
//获取2016年中关村和上地的人口主题下的雷达图，type = radar
//doHandleDataByNameAndYear(json_data,"radar","人口", ["中关村","上地","上庄镇"],"2016");
//获取2015年中关村和上地的人口主题下的性别，折线图
//doHandleDataByNameAndYear(json_data,"line","人口", ["中关村","上地"],"2015","sex_rate");
//获取2015年中关村和上地的人口房屋下的就业情况，条形图
//doHandleDataByNameAndYear(json_data,"bar","房屋", ["中关村","上地"],"2015","employee");
//获取2015年人口的占比，饼图
//doHandleDataByNameAndYear(json_data, "pie", "人口", [], "2015", "total_population")
//获取2015年人口的排名图，柱形图（排名）
//doHandleDataByNameAndYear(json_data, "sort_bar", "人口", [], "2015", "total_population")
//获取2015年人口的时间轴的数据
//doHandleDataByNameAndYear(json_data, "timeline", "人口", )
//色温图颜色数据
//doHandleDataByNameAndYear(json_data, "colormap", "人口", [], "2016");
//获取某个城镇的总人口数据
//doHandleDataByNameAndYear(json_data, "get_per_area_data", "人口", "中关村", "2015");