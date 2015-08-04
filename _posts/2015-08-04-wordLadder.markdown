---
layout: post
title: 单词阶梯
description : 单词阶梯
category: [LeetCode]
tags: [算法]
---


-----------------------


<div class="toc">
			
</div>

##前言
单词阶梯，[LeetCode地址](https://leetcode.com/problems/word-ladder/)   
给定单词：  
start ：`"hit"`    
end ： `"cog"`  
以及词典： `["hot","dot","dog","lot","log"]`  
找到最短的路径，并且返回步数（step）:  
`"hit" -> "hot" -> "dot" -> "dog" -> "cog"`  
返回 5

规则：

1. 如果没找到路径则返回0
2. 所有单词都是相同长度
3. 所有单词都是小写书写


##分析
由于要找最短路径，而且每次的选择是可预见的，有单词字典规范。可以使用宽度优先搜索。注意的是不要选择重复的节点。


##代码
javascript: 

	/**
	 * @param {string} beginWord
	 * @param {string} endWord
	 * @param {set<string>} wordDict
	 * @return {number}
	 */
	var ladderLength = function(beginWord, endWord, wordDict) {
	   
		
		var queue = [],curWord = null, level=0, curLevelCount = 1, curLevelIndex =0, nextLevelCount = 0;
		queue.push(beginWord);
		wordDict.add(endWord);
		
		//bfs 宽度优先遍历，由于要找最短的路，所以要进行宽度优先遍历。
		while((curWord = queue.shift()) != null){
			
			//结束条件（找到）
			if (curWord == endWord){
				return level+1;
			}
			
			
			
			//在字典中删除当前word
			wordDict.delete(curWord);
			
			
			for (var lIndex = 0; lIndex < curWord.length; lIndex++){
				for (var i=0; i<26; i++){
					
					//对于当前的word 依次使用小写字母[a...z]替换当前lIndex的字母，得到该单词的邻居单词（由wordLadder定义）
					var tmpWord = curWord.substr(0,lIndex) +  String.fromCharCode(97 + i) + curWord.substr(lIndex + 1); 
					//判断邻居单词在不在字典里
					if (wordDict.has(tmpWord)){
						//选择分支 
						nextLevelCount++;
						queue.push(tmpWord);
						wordDict.delete(tmpWord);
					}
				}
				
			}
			
			//bfs 遍历深度计算
			curLevelIndex++;
			if (curLevelIndex == curLevelCount){
				curLevelIndex = 0;
				curLevelCount = nextLevelCount;
				nextLevelCount = 0;
				level++;
			}
			
		}
		//结束条件 未找到
		return 0;
		
	};
 

