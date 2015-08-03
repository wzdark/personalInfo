---
layout: post
title: Invert Binary Tree(二叉树反转) 
description : Invert Binary Tree(二叉树反转)
category: [算法]
tags: [困难]
---


-----------------------


<div class="toc">
			
</div>

##前言
最近在逛微博，看到一篇这样的[文章](https://twitter.com/mxcl/status/608682016205344768)

>  Google: 90% of our engineers use the software you wrote (Homebrew), but you can’t invert a binary tree on a whiteboard so fuck off.

说的是 [Homebrew](http://brew.sh/) 作者因为不会在白板上翻转二叉树而被谷歌面试拒绝， 看到这个消息，瞬间笑喷了，原来大神也有被拒的时候~~  
[知乎](http://www.zhihu.com/question/31187043/answer/50948110?utm_source=weibo&utm_medium=weibo_share&utm_content=share_answer&utm_campaign=share_button)上和[quora](http://www.quora.com/Is-invert-a-binary-tree-a-good-question-for-Google-to-ask-in-a-technical-interview/answer/Gayle-Laakmann-McDowell)上都与关于此问题的探讨。
言归正传，让我们看看怎么来反转一个二叉树：

##什么是invert Binary Tree(二叉树反转)
输入：  
<pre>     4
   /   \
  2     7
 / \   / \
1   3 6   9</pre>
输出：  
<pre>     4
   /   \
  7     2
 / \   / \
9   6 3   1</pre>
[LeetCode地址](https://leetcode.com/problems/invert-binary-tree/)

##递归方法
javascript实现： 

	/**
	 * Definition for a binary tree node.
	 * function TreeNode(val) {
	 *     this.val = val;
	 *     this.left = this.right = null;
	 * }
	 */
	/**
	 * @param {TreeNode} root
	 * @return {TreeNode}
	 */
	var invertTree = function(root) {
		if (root === null){
			return root;
		}
		var tmp = root.left;
		root.left = root.right;
		root.right = tmp;
		if (root.left !== null){
			arguments.callee(root.left);
		}
		if (root.right !== null){
			arguments.callee(root.right);
		}
		return root;
	};

##非递归方法
javascript实现：

	/**
	 * Definition for a binary tree node.
	 * function TreeNode(val) {
	 *     this.val = val;
	 *     this.left = this.right = null;
	 * }
	 */
	/**
	 * @param {TreeNode} root
	 * @return {TreeNode}
	 */
	var invertTree = function(root) {
		var queue = [];
		queue.push(root);
		var curNode = null;
		while((curNode = queue.shift()) != null){
			//switch curNode left and right
			var tmp = curNode.left;
			curNode.left = curNode.right;
			curNode.right = tmp;
			if (curNode.left !== null){
				queue.push(curNode.left);
			}
			if (curNode.right !== null){
				queue.push(curNode.right);
			}
		}
		return root;
	};
	
注意，如果把`while((curNode = queue.shift()) != null)` 改为 `while((curNode = queue.shift()) !== null){`
在LeetCode上提交是不能通过的。这里说一下js里`!=`和`!==`的差异：  

1. 在数组无元素的情况下，调用shift函数返回undifined变量，这是由于Array对象能容纳任何类型的对象（number，object，string，boolean），它不是强类型数组。参考[这里](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)
2. 非等号`!=`在判断相等之前需要做类型转换，非全等号`!==`在判断相等之前不做类型转换，如果是不同类型的对象相比 比如`"123" !== 123` 或者 `undifined !== null` 都会返回 `true`。参考[这里](http://www.w3school.com.cn/js/pro_js_operators_equality.asp)

所以，当`queue`为空时，调用`curNode = queue.shift()`会得到`undifined`,如果这里使用非全等号`!==`,则`undifined !== null`判断为真，会再次进入while循环，故会报错。
 

