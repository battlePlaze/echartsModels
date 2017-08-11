if (typeof jQuery === 'undefined') {
    throw new Error('sxcolormap\'s JavaScript requires jQuery');
    alert('请先加载jquery');
}





(function(window,$){

    $.fn.colorMap = function(){

        var arg = arguments;
        var _this = $(this);
        var returnData = [];
        var r;
        var view = {};


        //清空地图





        _this.empty();
        //画
        function drawMap(){
            var pathArr = [];
            if(typeof arg[0] === "string" || $.isArray(arg[0])){
                pathArr = getPath(arg[0]);
            }

            if(pathArr.length > 0){
                //绘制对象
                r = Raphael(_this.attr('id'),parseInt(_this.width()),parseInt(_this.height()));
                r.setViewBox(0,0,255,262);

                //开始绘制
                for(var i = 0 ; i < pathArr.length; i++){
                    r.path(pathArr[i].path).attr({
                        "cursor":"pointer",
                        "stroke-width":"1.1",
                        "stroke":"#6e6f6d"
                    });
                }


            }else{
                throw new Error('该区域没有svg数据请联系软件设计部');
            }

        };

        //获取路径
        function getPath(obj){
            if(typeof obj === 'string') {
                recursionPath($.mapSvg, obj);
            }

            if($.isArray(obj)){
                recursionPathByArr($.mapSvg,obj);
            }
            return returnData;
        }



        //迭代 此处有优化 行政区划规律不清楚 可减少迭代
        function recursionPath(arr,obj){
            for(var i = 0 ; i < arr.length;i++){
                if(arr[i].regionId == obj){
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
        function recursionPathByArr(arr,obj){
            for(var i = 0 ; i < arr.length; i++){
                for(var j = 0; j < obj.length;j++){
                    if(arr[i]["regionId"] == obj[j]["regionId"]){
                        returnData.push(arr[i]);
                        obj.splice(j,1);

                    }
                }

                if($.isArray(arr[i]['children'])){
                    arguments.callee(arr[i]['children'],obj);
                }
            }
        }

        //地图悬浮
        function mapMouseover(){

        };

        //地图点击
        function mapClick(){

        };


        drawMap();


        $(window).resize(function(){

        });









    }
})(window,$);