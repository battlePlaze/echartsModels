if (typeof jQuery === 'undefined') {
    alert('请先加载jquery');
    throw new Error('sxcolormap\'s JavaScript requires jQuery');
}

window.console = window.console || (function () {
    var c ={};
    c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile= c.clear = c.exception = c.trace = c.assert = function(){};
    return c;
})();

(function(window,$){

    $.fn.colorMap = function(){

        var arg = arguments;//参数
        var _this = $(this);//当前调用对象
        var returnData = [];//数据
        var r;//绘制对象
        var mapSet = {};


        if(!arg[1]){
            arg[1] = {};
        }

        //地图设置
        $.extend(true,mapSet,arg[1]);
        mapSet.viewX = mapSet.viewX || 255;
        mapSet.viewY = mapSet.viewY || 262;
        mapSet.offsetX = mapSet.offsetX || 0;
        mapSet.offsetY = mapSet.offsetY || 0;

        mapSet.blockStyle = mapSet.blockStyle || {"cursor":"pointer", "stroke-width":"1.1", "stroke":"#6e6f6d","fill":"#6e6f6d"};



        //画
        function drawMap(){

            var pathArr = [];
            //图例
            mapSample();
            if(typeof arg[0] === "string" || $.isArray(arg[0])){
                pathArr = getPath(arg[0]);
            }


            if(pathArr.length > 0){

                //清空地图
                _this.empty();

                //添加元素，不破坏原有元素的属性
                var ranId = randomId();
                _this.append("<div id='"+ ranId +"' class='svgDiv'></div>");

                //绘制对象
                r = Raphael(ranId,parseInt(_this.width()),parseInt(_this.height()));
                r.setViewBox(mapSet.offsetX,mapSet.offsetY,mapSet.viewX,mapSet.viewY);


                //开始绘制
                for(var i = 0 ; i < pathArr.length; i++){
                    var tempStyle = {};
                    $.extend(true,tempStyle,mapSet.blockStyle);
                    if(pathArr[i].data){
                        if(pathArr[i].data.fill){
                            tempStyle.fill = pathArr[i].data.fill;
                        }else{
                            console.log(pathArr[i].data.name +'没有颜色值,rid为' + pathArr[i].data.rid);
                        }
                    }else{
                        tempStyle.fill = randomColor();
                    }
                    var elem = r.path(pathArr[i].path[0]['path']).attr(tempStyle).click(function(event){
                        if(arg[1].click){
                            arg[1].click(event,this,$(this).data('data'));
                        }
                    }).mouseover(function(event){
                        setPop(event,this,$(this).data("data"));
                        setPopPosition(event);
                    }).mousemove(function(event){
                        setPopPosition(event);
                    }).mouseout(function (event) {
                        $('#mapTip').remove();
                    });
                    $(elem).data("data",pathArr[i]);


                    //文字
                    var bbox = elem.getBBox(false);
                    var text_x = bbox.x + (bbox.width / 2);
                    var text_y = bbox.y + (bbox.height / 2);
                    var fontsize = "6px";
                    if(pathArr[i]['fontsize']){
                        fontsize = pathArr[i]['fontsize'];
                    }


                    var textStyle = {
                        "font-family":"微软雅黑",
                        "font-size": fontsize,
                        "cursor":"pointer",
                        "fill":"#000"
                    };
                    $.extend(true,textStyle,arg[1].textStyle ? arg[1].textStyle : {});
                    var showName = pathArr[i]['showname'] || pathArr[i]['name'];
                    var textElem = r.text(text_x,text_y,showName).attr(textStyle).click(function(){

                    }).mouseover(function(event){
                        setPop(event,this,$(this).data("data"));
                        setPopPosition(event);
                    }).mousemove(function(event){
                        setPopPosition(event);
                    }).mouseout(function(event){
                        $('#mapTip').remove();
                    });
                    $(textElem).data("data",pathArr[i]);



                    textElem.translate(pathArr[i].x,pathArr[i].y);
                    if(pathArr[i].d === 'y'){
                        $(textElem[0]).attr("writing-mode","tb");
                    }

                    if(typeof arg[1].setText === 'function'){

                        var setText = arg[1].setText(_this,pathArr[i].data);

                        if(setText){
                            textElem.translate(setText.x,setText.y);
                            if(setText.direction === 'y'){
                                $(textElem[0]).attr("writing-mode","tb");
                            }
                        }

                    }

                }

            }else{
                //throw new Error('该区域没有svg数据请联系软件设计部');
                console.log('该区域没有svg数据请联系软件设计部');
                return ;
            }

        }

        //获取路径
        function getPath(obj){
            if(typeof obj === 'string') {
                recursionPath($.mapSvg, obj);
            }

            if($.isArray(obj)){
                var res = recursionPathByArr($.mapSvg,obj);
                if(res && res.children && $.isArray(res.children)){
                    for(var i = 0 ; i < res.children.length; i++){
                        for(var j = 0; j < obj.length;j++){
                            if(res.children[i]["rid"] === obj[j]["rid"]){
                                res.children[i].data = obj[j];
                            }
                        }
                        if(res.children[i].data === undefined){
                            console.log(res.children[i]["name"] + ":"+ res.children[i]["rid"] + '没有数据');
                        }

                    }
                }

                returnData = res.children;
            }
            return returnData;
        }



        //迭代 此处有优化 行政区划规律不清楚 可减少迭代
        function recursionPath(arr,obj){
            for(var i = 0 ; i < arr.length;i++){
                if(arr[i].rid === obj){
                    returnData = arr[i]['children'];
                    return;
                }else{
                    if(arr[i].children && $.isArray(arr[i].children)){
                        arguments.callee(arr[i].children,obj);
                    }
                }
            }

        }


        //迭代 此处有优化 行政区划规律不清楚 可减少迭代
        function recursionPathByArr(arr,obj,par){
            //根据后台传入的数据找path
            /*
            for(var i = 0 ; i < arr.length; i++){
                for(var j = 0; j < obj.length;j++){
                    if(arr[i]["rid"] === obj[j]["rid"]){
                        arr[i].data = obj[j];
                        returnData.push(arr[i]);
                        obj.splice(j,1);
                    }
                }

                if($.isArray(arr[i]['children'])){
                    arguments.callee(arr[i]['children'],obj);
                }
            }
            */


            //根据原有path找
            if(!par){
                par = [];
            }
            for(var i = 0; i < arr.length;i++){

                var rid = arr[i].rid;
                var cprid = arr[i].prid;
                if(arr[i].rid === obj[0].rid){
                    return par.pop();
                }

                //returnData = arr[i];

                if($.isArray(arr[i]['children'])){
                    par.push(arr[i]);
                    var res = arguments.callee(arr[i]['children'],obj,par);
                    if(res){
                        return res;
                    }else {
                        par.pop();
                    }
                }
            }



        }

        //地图悬浮
        function mapMouseover(){

        }

        //地图点击
        function mapClick(){

        }


        //气泡设置 可以优化 操作隐藏显示比操作dom好
        function setPop(event,t,data){
            var htmlStr = '';
            if(arg[1]){
                if(typeof arg[1].popWin === "function"){
                   htmlStr =  arg[1].popWin(t,data);
                    $('#mapTip').remove();
                   if(/id=['"]mapTip['"]/igm.test(htmlStr)){
                       $(htmlStr).appendTo('body');
                   }else{
                       $(htmlStr).appendTo('body').attr('id','mapTip').attr('class','mapTip');
                       $('<span class="pot"></span><span class="bot"></span>').appendTo($('.mapTip'));
                   }
                }
            }

        }

        function setPopPosition(event){
            var pageX = event.pageX || event.clientX + $(document).scrollLeft() + document.body.clientLeft
            var pageY = event.pageY || event.clientY + $(document).scrollTop() + document.body.clientTop;

            var mapTip_width = $('#mapTip').outerWidth();
            var mapTip_height = $('#mapTip').outerHeight();

            $('#mapTip').css({
                "left":(pageX - mapTip_width/2) + 'px',
                "top":(pageY - mapTip_height - 25) + 'px'
            });
        }


        //随机id
        function randomId(){
            var arr = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
            var returnStr = '';
            for(var i = 0 ; i < 4; i++){
                var ran = Math.floor(Math.random()*26);
                returnStr = returnStr + arr[ran];
            }
            if($('#' + returnStr).length > 0){
                arguments.callee();
            }else {
                return returnStr;
            }
        }

        //随机颜色
        function randomColor(){
            var arr = ['a','b','c','d','e','f','0','1','2','3','4','5','6','7','8','9'];
            var returnStr = '#';
            for(var i = 0 ; i < 6; i++){
                var ran = Math.floor(Math.random()*16);
                returnStr = returnStr + arr[ran];
            }
            if(returnStr === '#ffffff' || returnStr === '#000000'){
                arguments.callee();
            }else{
                return returnStr;
            }

        }


        //图例
        function mapSample(){
            var htmlStr = '';
            if(arg[1]){
                if($.isArray(arg[1].sample)){
                    htmlStr = '<ul class="mapSample">';
                    for(var i = 0; i < arg[1].sample.length;i++){
                        if(arg[1].sample[i].color && arg[1].sample[i].name){
                            htmlStr = htmlStr + '<li><span style="background: '+ arg[1].sample[i].color +'"></span>'+arg[1].sample[i].name+'</li>';
                        }else{
                            htmlStr = '';
                            break;
                        }

                        if(i === (arg[1].sample.length - 1)){
                            htmlStr =  htmlStr + '</ul>'
                        }
                    }
                    $('#' + ranId).append(htmlStr);
                    return;
                }

                if(typeof arg[1].sample === 'function'){
                    htmlStr = arg[1].sample();
                    $('#' + ranId).append(htmlStr);
                    return;
                }

                if(typeof arg[1].sample === 'string'){
                    htmlStr = arg[1].sample;
                    $('#' + ranId).append(htmlStr);
                    return null;
                }


            }
        }

        drawMap();


        //地图 自适应
        $(window).resize(function(){
            r.setSize(parseInt(_this.width()),parseInt(_this.height()));
        });


    }
})(window,$);