#插件安装
`npm install sxcolormap --save`
或
`git clone git@130.10.8.210:bksxfed/fedInterface/sxcolormap.git`

此插件依赖jquery，插件加载之前请加载jquery,jquery版本高于1.7以上

```html
<link href="~/styles/colormap.min.css" type="text/css" rel="stylesheet"/>
<script type="text/javascript" src="~/javascript/svg.min.js"></script>
<script type="text/javascript" src="~/jquery.min.js"></script>
<script type="text/javascript" src="~/sxcolormap.min.js"></script>
```

# 插件目录结构说明
```
│  gulpfile.js  //gulp文件,主要对插件中的src文件夹中的源代码进行压缩输出和搭建服务
│  LICENSE //版权声明
│  package.json //插件描述和开发过程中依赖包
│  README.md //说明文档
│  
│      
├─dist
│      colormap.css  //sxcolormap.js依赖的css文件
│      colormap.min.css  //sxcolormap.js依赖的压缩css文件
│      svg.js   //sxcolormap.js依赖的js文件
│      svg.min.js  //sxcolormap.js依赖的压缩js文件
│      sxcolormap.js  //src文件夹中的raphael.min.js和sxcolormap.js合并文件
│      sxcolormap.min.js  //src文件夹中的raphael.min.js和sxcolormap.js合并之后压缩文件
│      
├─node_modules  //项目依赖
│  
│          
└─src
    │  index.html  //方法示例
    │  
    ├─images
    ├─javascript //插件源码
    │      raphael.min.js
    │      svg.js
    │      sxcolormap.js
    │      
    └─styles
            colormap.css  //插件源码
```

# 插件方法

## `colorMap()方法`

### `说明`
该方法功能是对各地区的一系列数据通过地图模块的样式进行展示。

#### `语法`
```javascript
$('#map').colorMap(arg1,arg2);
```

### `参数`
<table>
    <thead>
        <tr>
            <td>参数</td>
            <td>类型</td>
            <td>描述</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>arg1</td>
            <td>string或array</td>
            <td>
                必选。当参数为`string`类型时，可传入某地区的行政区划代码,则展示的数据为该行政区划所有子节点的数据<br/>当参数为`array`类型时，数组元素必须为`对象`，每个对象中至少包含`rid`属性,属性值为行政区划代码，当数据为`array`时，地区数据不完整时控制台会输出相应区域缺少数据。比如昌平区有22个区域模块，arr的长度为10个，控制台会输出缺少数据的区域
            </td>
        </tr>
        <tr>
            <td>arg2</td>
            <td>object</td>
            <td>可选。对展示的数据块进行设置和操作<br/></td>
        </tr>
    </tbody>
</table>

### `地图展示模块设置的属性有`
+ offsetX:地图水平偏移（当地图显示位置不理想时，可进行设置）
+ offsetY:地图垂直偏移（当地图显示位置不理想时，可进行设置）
+ viewX:地图的视图(默认值为`255`,当感觉数据快不是特别合理时可进行设置，正常情况下不建议修改)
+ viewY:地图的视图(默认值为`262`,当感觉数据快不是特别合理时可进行设置，正常情况下不建议修改)
+ sample:地图图例，数据为数组，数组中的对象至少包含`name`和`color`属性
+ popWin:弹窗，类型为`function`,有两个参数，第一个参数为选中（鼠标悬浮）的数据块，不建议对其进行操作，第二个参数为选中数据块后台传入的数据，`popWin`方法需返回弹窗的`html`代码字符串，如果自定义了弹窗的样式，请在弹窗的元素中定义一个`id`为`mapTip`的元素，如果没有自定义样式则可不用定义`id`为`mapTip`的元素
+ click:数据快点击事件，类型为`function`，有三个参数，第一个参数为`event`对象，第二个参数为当前被点击的`数据块`，不建议对其进行操作，第三个参数为后台传入的`相关数据`
+ textStyle:设置地图上文字的样式
+ setText：设置每一个地图上的位子，在每次文字被创建时都会被调用,类型为`function`，类型有两个参数，一个为当前初始化的`对象`，一个为后台传入的`数据`，在使用后台传入的数据时请进行判断是否为`空`或者`未定义`

### `返回值`
没有返回值

#### `示例`
```html
<div id="map">

</div>

<script>
//第一种调用
//第二个参数可无，表示显示昌平地区的地图数据块，没有后台数据
$('#map').colorMap("110114000000",{
    "offsetX":-10,
    "offsetY":0,
    "sample":[{"name":"10-20人","color":"#f0f"},{"name":"20-40人","color":"#ff0"},{"name":"40-60人","color":"#0ff"},{"name":"60-80人","color":"#f00"}],
    "popWin":function(t,data){
        return "<div><span>"+data.name+"</span><br/><span>"+data.rid+"</span></div>"
    },
    "click":function(event,t,data){

    },
    "textStyle":{
        "fill":"#000"
    },
    "setText":function(t,data){
        if(data && data.name == "南邵镇"){
            return {
                "x":0,
                "y":-3,
                "direction":"y"
            }
        }
    }
});


//第二种调用
//data数据为昌平部分区域数据。
var data = [
    {
        "rid":"110114104000",
        "name":"阳坊镇",
        "fill":"#ff0"
    },
    {
        "rid":"110114111000",
        "name":"南邵镇",
        "fill":"#f00"
    },
    {
        "rid":"110114002000",
        "name":"南口镇",
        "fill":"#00f"
    },
    {
        "rid":"110114118000",
        "name":"流村镇",
        "fill":"#f0f"
    },
    {
        "rid":"110114901000",
        "name":"北企",
        "fill":"#fdf"
    }
];

$('#map').colorMap(data,{
    "offsetX":-10,
    "offsetY":0,
    "sample":[{"name":"10-20人","color":"#f0f"},{"name":"20-40人","color":"#ff0"},{"name":"40-60人","color":"#0ff"},{"name":"60-80人","color":"#f00"}],
    "popWin":function(t,data){
        return "<div><span>"+data.name+"</span><br/><span>"+data.rid+"</span></div>"
    },
    "click":function(event,t,data){

    },
    "textStyle":{
        "fill":"#000"
    },
    "setText":function(t,data){
        if(data && data.name == "南邵镇"){
            return {
                "x":0,
                "y":-3,
                "direction":"y"
            }
        }
    }
});

</script>

```
