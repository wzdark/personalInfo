---
layout: post
title: jquery源码分析，$('xx').width()与$('xx').css('width')的区别
description : jquery源码分析，$('xx').width()与$('xx').css('width')的区别
category: [jQuery]
tags: [jQuery, 源码分析, cssHooks, 盒子模型]
---


-----------------------


<div class="toc">
			
</div>

##前言
在项目中用到了百度的富文本编辑器（1.2.2版本） [umeditor](http://ueditor.baidu.com/), 碰到了一个隐藏很深的bug，见：  
造成bug的主要原因是 在源码`umeditor.js`中有这样一段代码：

	if (rect[dir][2] != 0) {
		tmp = $dom.width() + rect[dir][2] * offset.x;
		$dom.css('width', me._validScaledProp('width', tmp));
	}
	if (rect[dir][3] != 0) {
		tmp = $dom.height() + rect[dir][3] * offset.y;
		$dom.css('height', me._validScaledProp('height', tmp));
	}

其功能大概是 在鼠标拖动目标图片的时候 实时的改变其宽高，这个功能在富文本编辑器里很常见。 

取出上一次该元素的宽度(或者高度)`$dom.width()` 加上一个偏移量 `rect[dir][2] * offset.x`, 再更新该元素的宽度(或者高度) `$dom.css('height', me._validScaledProp('height', tmp));`。
但是问题是， 这段代码用到的读取宽度(或者高度)和设置宽度(或者高度)的api不一致。分别是：

	$dom.width();           //读
	$dom.css('width',xxx);  //写

本文主要通过现象和源码分析这两个api的异同。

先给出结论：

`$dom.width()`  操作的是元素的content width。    
`$dom.css('width')` 操作的是元素的style上的 width。 根据box-size属性的不同， 这个width可能是 content width 也可能是 border width。

这里涉及到了盒子模型，不懂的请看这里[css盒子模型](http://baike.baidu.com/link?url=Ut7Hcml0Z1Ei367z8XM6AfGdjOuNVSY45tY-iC3IT5LB-ga8O8P6-igW3NXw1XaLgL8KEDkA8Y4IEVwsE-Uiqa).


##现象
先看现象：两个div，分别设置其box-size属性为 `content-box` , `boader-box` , 看看使用两个api 拿出来的宽度有什么不同。
<div id="d-content" style="box-sizing: content-box; float: left; width: 200px; height: 200px; background: gray; border: 2px solid black;">
	width: 200px ; <br/>
	box-sizing: content-box; <br/>
	.css('width') : 200px <br/>
	.width() : 200
</div>
<div id="d-border" style="margin-left: 10px;box-sizing: border-box; float: left;width: 200px; height: 200px; background: gray; border: 2px solid black;">
	width: 200px ; <br/>
	box-sizing: border-box; <br/>
	.css('width') : 200px <br/>
	.width() : 196
</div>
<div style="    clear: both;"></div>
注意 .css('width') 始终拿到的是css设置的宽度，也就是样式。 而.width()  拿到的始终是content box的宽度。    
说明：以下分析是通过chrome的开发者模式，调试分析得出。 jquery版本为1.11.3  

##.css('width')源码分析
 
首先jquery实例对象的函数都是注册到`jquery.fn`这个对象上。找到`jquery.fn.css` :

	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},

其中关键代码在这里：    
 `jQuery.style( elem, name, value )`是写操作；     
 `jQuery.css( elem, name )`是读操作。     
进到`jQuery.css( elem, name )`函数体内,关键代码如下：    

	// gets hook for the prefixed version
	// followed by the unprefixed version
	hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

	// If a hook was provided get the computed value from there
	if ( hooks && "get" in hooks ) {
		val = hooks.get( elem, true, extra );
	}

其中`hooks`是jquery对属性读写操作的一个钩子，这个钩子中包括了get和set方法，就像c#中的属性访问器一样。可以做一些自定义规则。或者新增自定义属性。
对于hooks的更多知识，请参考这篇文章：[css hooks](http://www.css88.com/jqapi-1.9/jQuery.cssHooks/)    
	
	val = hooks.get( elem, true, extra );
这一句是调用hooks的读操作，返回指定的`elem`元素的指定属性(属性信息包含在hooks对象里面)的值， **而且这个返回值会受到参数`extra`的影响，这个很重要,下文会说到.**

进入到` hooks.get( elem, true, extra )`函数中，找到关键代码：

	get: function( elem, computed, extra ) {
		if ( computed ) {
			// certain elements can have dimension info if we invisibly show them
			// however, it must have a current display style that would benefit from this
			return rdisplayswap.test( jQuery.css( elem, "display" ) ) && elem.offsetWidth === 0 ?
				jQuery.swap( elem, cssShow, function() {
					return getWidthOrHeight( elem, name, extra );
				}) :
				getWidthOrHeight( elem, name, extra );
		}
	},

不难发现，宽度和高度的信息就藏在`getWidthOrHeight( elem, name, extra )`函数中, 再跟进去,这里有两处关键代码：    
    
1.获取border-box的宽度（或者高度）

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
	val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
	styles = getStyles( elem ),
	isBorderBox = support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

其中，`var valueIsBorderBox = true,`表示下面要获取的`val`是盒子模型中 border-box的宽度。
`elem`是一个jquery对象，`elem.offsetWidth` 分别存储了 `elem.offsetHeight` 其border-box的宽和高。
`isBorderBox`是表示当前元素的盒模型是不是 "border-box"

2.计算最终的宽度（或者高度）


	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
	
其注释已经说得很明显： 根据本元素的盒子模型属性，去加上或者减去一个相对值。 
在这里参数`extra`起作用了，它与上面求得的`isBorderBox`一起决定要取的属性是基于‘border‘还是’content‘. 

最后再回顾一下 使用.css('width')取宽度时，我们的调用过程：

	css('width')  ->   jquery.fn.css   - >  jQuery.css( elem, name )     ->    hooks.get( elem, true, extra )  -> getWidthOrHeight( elem, name, extra )

注意：在`jQuery.css( elem, name )` 到 ` hooks.get( elem, true, extra ) `之间没传`extra`参数。 
所以最后取得的值是多少，取决于当前元素处于哪个盒子模型。所以得到结论：    

**`$dom.css('width')` 操作的是元素的style上的 width。 根据box-size属性的不同， 这个width可能是 content width 也可能是 border width。**


##.width()源码分析
首先找到jquery.fn.width的函数定义：

	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
		jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
			// margin is only for outerHeight, outerWidth
			jQuery.fn[ funcName ] = function( margin, value ) {
				var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
					extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

				return access( this, function( elem, type, value ) {
					var doc;

					if ( jQuery.isWindow( elem ) ) {
						// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
						// isn't a whole lot we can do. See pull request at this URL for discussion:
						// https://github.com/jquery/jquery/pull/764
						return elem.document.documentElement[ "client" + name ];
					}

					// Get document width or height
					if ( elem.nodeType === 9 ) {
						doc = elem.documentElement;

						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
						// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
						return Math.max(
							elem.body[ "scroll" + name ], doc[ "scroll" + name ],
							elem.body[ "offset" + name ], doc[ "offset" + name ],
							doc[ "client" + name ]
						);
					}

					return value === undefined ?
						// Get width or height on the element, requesting but not forcing parseFloat
						jQuery.css( elem, type, extra ) :

						// Set width or height on the element
						jQuery.style( elem, type, value, extra );
				}, type, chainable ? margin : undefined, chainable, null );
			};
		});
	});

看到注释，聪明的人可能就明白了，该段代码定义了jquery对象的6个方法 ：innerHeight, innerWidth, height, width, outerHeight and outerWidth 。针对css盒子模型，我们可以很容易的猜到：

innerHeight, innerWidth,   获取的是padding-box的宽和高。    
height, width,             获取的是content-box的宽和高。
outerHeight and outerWidth 获取的是border-box的宽和高。

继续往下，在`access`函数的参数` function( elem, type, value )`里找到关键代码：

	return value === undefined ?
		// Get width or height on the element, requesting but not forcing parseFloat
		jQuery.css( elem, type, extra ) :

		// Set width or height on the element
		jQuery.style( elem, type, value, extra );

这里

	`jQuery.css( elem, type, extra )`是读操作；     
	`jQuery.style( elem, type, value, extra )`是写操作。

继续往下就跟之前的一样了，就不走了。

最后再回顾一下 使用.css('width')取宽度时，我们的调用过程：

	.width() -> jquery.fn.width() - >  jQuery.css( elem, type, extra )  -> hooks.get( elem, true, extra ) -> getWidthOrHeight( elem, name, extra )

其中extra在初始化的时候为设置为'content' , 所以得出结论：

**`$dom.width()`  操作的是元素的content width。**

##结论
再重复一遍：


`$dom.width()`  操作的是元素的content width。    
`$dom.css('width')` 操作的是元素的style上的 width。 根据box-size属性的不同， 这个width可能是 content width 也可能是 border width。




