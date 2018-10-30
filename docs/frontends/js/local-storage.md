

# 如何给localStorage设置一个有效期？

![本文由@IT·平头哥联盟-首席填坑官∙苏南 分享，公众号：honeyBadger8](../_banner/banner17.png)

> 作者：[首席填坑官∙苏南](https://github.com/meibin08/ "首席填坑官∙苏南")<br/>
> 公众号：`honeyBadger8`，群：912594095，本文原创，著作权归作者所有，转载请注明原链接及出处。

## 引言

​　　这个话题其实在上次分享[<小程序填坑记里讲过了>](https://blog.csdn.net/weixin_43254766/article/details/82811714 "做完小程序项目、老板给我加了5k薪资～")已经讲过（`大佬可绕过哦～`），但后来群里/评论都有些同学，提到了一些疑问，问能否单独整理一篇更为详细的分享，讲解一下细节和完善提到的不足，如是有了下文👇。 —— 「 **用心分享 做有温度的攻城狮**，我是`首席填坑官`——[苏南](https://honeybadger8.github.io/blog/ "首席填坑官∙苏南") 」

## 思考点
　　从我们接触前端起，第一个熟悉的存储相关的Cookie或者来分析我们生活中密切相关的淘宝、物流、闹钟等事物来说起吧，
+ Cookie从你设置的时候，就会给个时间，不设置默认会话结束就过期；
+ 淘宝购物 从你下单付款起，就会给这件货物设置一个收货期限时间，过了这个时间自动认为你收货（即`订单结束`）；
+ 闹钟 你设置的提醒时间，其实也就是它的过期时间；
+ 再比如与您每天切身相关的产品需求，过完需求，你给出的上线时间，也就是这个需求的过期时间；
+ 再通俗点讲，您今年的生日过完到明年生日之间也是相当于设置了有效期时间；

!> 以上种种，我们能得出一个结论任何一件事、一个行为动作，都有一个时间、一个节点，甚至我们可以黑`localStorage`，就是一个完善的API，为什么不能给一个设置过期的机制，因为`sessionStorage`、`Cookie`并不能满足我们实际的需求。

## 实现思路

　　抱歉，黑`localStorage`不完善，有点夸张了，综合上述的总结，问题就简单了，给`localStorage`一个过期时间，一切就都so easy ？到底是不是，来看看具体的实现吧：

#### 简单回顾

```javascript
//示例一：
localStorage.setItem('test',1234567);
let test = localStorage.getItem('test');
console.log(typeof test, test); 

//示例二：
localStorage['name'] = '苏南';
console.log(localStorage['name']);
/*
输出:
"1234567" ,'苏南',
这里要注意，1234567 存进去时是number 取出来就成string了
*/

```


#### 重写 set(存入) 方法：
+ 首先有三个参数 key、value、expired ，分别对应 键、值、过期时间，
+ 过期时间的单位可以自由发挥，小时、分钟、天都可以，
+ **注意**点：存储的值可能是数组/对象，不能直接存储，需要转换 `JSON.stringify`，
+ 这个时间如何设置呢？在这个值存入的时候在键(key)的基础上扩展一个字段，如：key+'_expires_'，而它的值为当前 时间戳 + expired过期时间
+ **具体来看一下代码** ：

```javascript

set(key, value, expired) {
	/*
	* set 存储方法
	* @ param {String} 	key 键
	* @ param {String} 	value 值，
	* @ param {String} 	expired 过期时间，以分钟为单位，非必须
	* @ 由@IT·平头哥联盟-首席填坑官∙苏南 分享
	*/
	let source = this.source;
	source[key] = JSON.stringify(value);
	if (expired){
		source[`${key}__expires__`] = Date.now() + 1000*60*expired
	};
	return value;
}

```
#### 重写 get(获取) 方法：
+ 获取数据时，先判断之前存储的时间有效期，与当前的时间进行对比；
+ 但存储时`expired`为非必须参数，所以默认为当前时间+1，即长期有效；
+ 如果存储时有设置过期时间，且在获取的时候发现已经小于当前时间戳，则执行删除操作，并返回空值；
+ **注意**点：存储的值可能是数组/对象，取出后不能直接返回，需要转换 `JSON.parse`，
+ **具体来看一下代码** ：

```javascript
get(key) {
	/*
	* get 获取方法
	* @ param {String} 	key 键
	* @ param {String} 	expired 存储时为非必须字段，所以有可能取不到，默认为 Date.now+1
	* @ 由@IT·平头哥联盟-首席填坑官∙苏南 分享
	*/
	const source = this.source,
	expired = source[`${key}__expires__`]||Date.now+1;
	const now = Date.now();

	if ( now >= expired ) {
		this.remove(key);
		return;
	}
	const value = source[key] ? JSON.parse(source[key]) : source[key];
	return value;
}

```
#### 重写 remove(删除) 方法：
+ 删除操作就简单了，；

```javascript

remove(key) {
	const data = this.source,
		value = data[key];
	delete data[key];
	delete data[`${key}__expires__`];
	return value;
}
```

#### 优化点：

+ 记得上次有个`同学`，是这么**评论**的：「 删除缓存能放到constructor里面执行么，放到get里面 不取就一直在那是不是不太好？」；
+ 为什么不用`for in`而是 for ? `for in`循环遍历对象的属性时，原型链上的所有属性都将被访问，解决方案：使用`hasOwnProperty`方法过滤或Object.keys会返回自身可枚举属性组成的数组；


```javascript

class storage {

	constructor(props) {
		this.props = props || {}
		this.source = this.props.source || window.localStorage
		this.initRun();
	}
	initRun(){
		/*
		* set 存储方法
		* @ param {String} 	key 键
		* @ param {String} 	value 值，存储的值可能是数组/对象，不能直接存储，需要转换 JSON.stringify
		* @ param {String} 	expired 过期时间，以分钟为单位
		* @ 由@IT·平头哥联盟-首席填坑官∙苏南 分享
		*/
		const reg = new RegExp("__expires__");
		let data = this.source;
		let list = Object.keys(data);
		if(list.length > 0){
			list.map((key,v)=>{
				if( !reg.test(key )){
					let now = Date.now();
					let expires = data[`${key}__expires__`]||Date.now+1;
					if (now >= expires ) {
						this.remove(key);
					};
				};
				return key;
			});
		};
	}
}

```


#### 总结：

　　以上就是今天为大家总结的分享，您GET到了吗？小程序、sessionStorage、localStorage，都适用，做些许调整即可哦，希望今天的分享能给您带来些许成长，如果觉得不错，记得关注下方**公众号**哦，每周第一时间为您推最新分享👇👇。

![宝剑锋从磨砺出，梅花香自苦寒来，做有温度的攻城狮!，公众号：honeyBadger8](../_banner/card.gif)

> 作者：苏南 - [首席填坑官](https://github.com/meibin08/ "@IT·平头哥联盟-首席填坑官")
>
> 链接：https://blog.csdn.net/weixin_43254766
> 
> 交流群：912594095[`资源获取/交流群`]、公众号：`honeyBadger8`
>
> 本文原创，著作权归作者所有。商业转载请联系`@IT·平头哥联盟`获得授权，非商业转载请注明原链接及出处。 





