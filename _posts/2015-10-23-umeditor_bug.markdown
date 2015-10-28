---
layout: post
title: umeditor中图片拖拽bug
description : 在某些情况下的umeditor中 通过拖拽改变图片大小会出现 图片一直变小的情况
category: [前端]
tags: [jQuery, umeditor, 图片拖拽, bug]
---


-----------------------


<div class="toc">
			
</div>

##现象
在项目中用到了百度的富文本编辑器（1.2.2版本） [umeditor](http://ueditor.baidu.com/website/umeditor.html), 碰到了一个隐藏很深的bug，如下：  

请尝选中图片，拖拽改变图片大小，会发现怎么动，图片都是越来越小。
<div>
	<script id="course" name="content" class="editor required resetli" data-msg="不能少于10个字" type="text/plain" style="width:636px;height:300px"></script>
</div>
<link rel="stylesheet" type="text/css" href="{{site.baseurl}}/js/umeditor/themes/default/css/umeditor.min.css" />
<style>
*, *:before, *:after {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}
</style>
<script type="text/javascript" src="{{site.baseurl}}/js/umeditor/umeditor.config-opa.js"></script>
<script type="text/javascript" src="{{site.baseurl}}/js/umeditor/umeditor.js"></script>

<script>
	$(function(){
		um = UM.getEditor("course", {
			toolbar:[" undo redo | image emotion  | bold italic underline | forecolor backcolor |",
					 " justifyleft justifycenter justifyright | insertorderedlist insertunorderedlist | selectall"],
			autoHeightEnabled: true,
			autoFloatEnabled: false
		});
		um.ready(function(){
			var imgHtml = "<img src=http://ueditor.baidu.com/server/umeditor/upload/demo.jpg _src=http://ueditor.baidu.com/server/umeditor/upload/demo.jpg>";
			um.setContent(imgHtml);
        });
		
	});
	
</script>

##环境原因
造成这个bug的表明原因或者说先决条件有三个：   

1. 使用了BootStrap的样式
2. 使用了jquery做为基础的js脚本
3. 使用了百度的umeditor富文本插件（这不是废话吗！？，bug就是在这里发现的）

##分析
换位思考，如我作为umeditor的作者，怎么样去实现一个通过拖拽改变图片大学的功能呢？ 有三步：

1. 监听元素（图片）的mousedown事件， 这个事件一旦触发表示元素处于拖拽状态（draging）,并将该元素存储在一个dragingItem指针中。
2. 监听document（全局）的mouseup事件， 这个事件一旦触发 表示dragingItem脱离拖拽状态。
3. 监听元素的mousemove事件，如果元素处于拖拽状态，则通过以下公式更新元素的大小。


		//伪代码，ele表示拖拽的目标图片，offset表示鼠标移动的距离，是一个二元数。
		ele.width = ele.width + offset.x;
		ele.height = ele.height + offset.y;
		
那么问题的关键就是在这个`mousemove`事件中，于是通过关键字`mousemove`,去找umeditor的源码（1.2.2版本）：

	_eventHandler: function (e) {
        var me = this,
            $doc = me.defaultOpt.$doc;
        switch (e.type) {
            case 'mousedown':
                var hand = e.target || e.srcElement, hand;
                if (hand.className.indexOf('edui-scale-hand') != -1) {
                    me.dragId = hand.className.slice(-1);
                    me.startPos.x = me.prePos.x = e.clientX;
                    me.startPos.y = me.prePos.y = e.clientY;
                    $doc.bind('mousemove', $.proxy(me._eventHandler, me));
                }
                break;
            case 'mousemove':
                if (me.dragId != -1) {
                    me.updateContainerStyle(me.dragId, {x: e.clientX - me.prePos.x, y: e.clientY - me.prePos.y});
                    me.prePos.x = e.clientX;
                    me.prePos.y = e.clientY;
                    me.updateTargetElement();
                }
                break;
            case 'mouseup':
                if (me.dragId != -1) {
                    me.dragId = -1;
                    me.updateTargetElement();
                    var $target = me.data('$scaleTarget');
                    if ($target.parent()) me.attachTo(me.data('$scaleTarget'));
                }
                $doc.unbind('mousemove', $.proxy(me._eventHandler, me));
                break;
            default:
                break;
        }
    },
	
这里，函数`_eventHandler`中分别处理的鼠标点击`mousedown`,鼠标移动`mousemove`,鼠标抬起`mouseup`三个事件。 在`mousemove`中：

	me.updateContainerStyle(me.dragId, {x: e.clientX - me.prePos.x, y: e.clientY - me.prePos.y});
是更新图片外的选择框的大小，传入的第一个参数是一个dragId，第二个参数是鼠标的移动距离offset。

	me.updateTargetElement();
是更新图片本身的大小

进入`updateContainerStyle`里，找到关键代码：

	if (rect[dir][2] != 0) {
		tmp = $dom.width() + rect[dir][2] * offset.x;
		$dom.css('width', me._validScaledProp('width', tmp));
	}
	if (rect[dir][3] != 0) {
		tmp = $dom.height() + rect[dir][3] * offset.y;
		$dom.css('height', me._validScaledProp('height', tmp));
	}
细心的同学会发现， 这里的对元素宽/高 读写分别使用了不同的api：

	$dom.width();           //读
	$dom.css('width',xxx);  //写
	
这里就是造成bug的元凶。见我另一篇文章分析这两个api的不同, [jquery源码分析，$('xx').width()与$('xx').css('width')的区别]({{site.baseurl}}/2015/10/22/jQuery_css_width.html)   
结论是：       
`$dom.width()`  操作的是元素的content width。    
`$dom.css('width')` 操作的是元素的style上的 width。 根据box-size属性的不同， 这个width可能是 content width 也可能是 border width。


##结论
在使用bootstrap或者某些其他框架的样式的时候，如果将元素的盒子模型全设置为了border-box,比如bootstrap里是这样写的：

	*, *:before, *:after {
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
	}

在这个时候

	`$dom.width()`  操作的是元素的content width。    
	`$dom.css('width')` 操作的是元素的border width。
	
如果元素的border width 大于0 就会出现，元素越来越小的情况。


##解决办法
1.将元素的盒子模型设置为content-box

2.修改umeditor源码将读写的api统一改为`$dom.width()` ,这里提供一个修改过的源码：[umeditor.js]({{site.baseurl}}/js/umeditor/umeditor_fixed.js) (右键另存为下载)。
	

