

# webpack4配置细细道来

![本文由@IT·平头哥联盟-首席填坑官∙苏南 分享，公众号：honeyBadger8](../_banner/banner17.png)

## 前言

	近两年，前端一直在以一个高速持续的过程发展，常常会有网友在调侃老了、学不动了，

	虽是在调侃却又间接阐述着无奈，迫于生活的压力，不得不提速前行，

	因为没有谁为你而停留，公司不会、社会不会、同伴不会……，停下可能将意味着淘汰 —— `理想很丰满，现实很骨感`。

	～～吐槽过了，接着聊正事吧～～。

	经常会有群友问起`webpack`、`react`、`redux`等等方面的问题，有些是我也不懂的，慢慢从大家的相互交流中，也学到了不少。

​　　今天就尝试着一起来聊聊`Webpack4.+`吧，苏南会详细讲解`webpack4`中的每一个配置字段的作用。
	
+ 人生若只如初见，何事秋风悲画扇； 
+ 等闲变却故人心，却道故人心易变； 
+ 骊山语罢清宵半，夜雨霖铃终不怨。

!> 各位大佬早安，这里是[@IT·平头哥联盟](https://honeybadger8.github.io/blog/ "@IT·平头哥联盟")，我是[首席填坑官∙苏南](https://github.com/meibin08 "首席填坑官∙苏南的专栏")，用心分享 做有温度的攻城狮。<br/>
公众号：`honeyBadger8`，群：912594095

## entry
+ 这个不用解释了，看名字就是知道，它就是通往天堂/地狱的`入口`，一切的苦难从这里开始，也从这里结束。
+ 简单介绍几种写法：
```js
//方式一：单文件写法
entry: {
	index: './src/pages/route.js'
}

//方式二：多文件写法
entry: {
	/*index:[
		'webpack-hot-middleware/client',
		'./src/root.js'
	],*/
  index: ['./src/root.js'],
  vendors : ['react','react-dom','redux','react-router','classnames'],
}

```
## output - 输出
+ 它位于对象最顶级键(非常重要)，如果说`entry`是一扇门，`output`就是审判官，决定着你是上天堂还是入地狱；
+ 指示 webpack 如何去输出、以及在哪里输出你；
+ path: 文件输出的目录，
+ filename:输出的文件名，它一般跟你`entry`配置相对应，如：`js/[name].js` name在这里表示的是[`index`、`vendors`]，
+ chunkFilename：块，配置了它，非入口`entry`的模块，会帮自动拆分文件，也就是大家常说的按需加载，与路由中的 `require.ensure`相互应
+ publicPath：文件输出的公共路径，
+ pathinfo：即保留相互依赖的包中的注释信息，这个基本不用主动设置它，它默认 `development` 模式时的默认值是 true，而在 `production` 模式时的默认值是 false，
+ 主要的就是这些，还有一些其他的`library`、`libraryTarget`、`auxiliaryComment`等,感兴趣的可自行了解，
```js
output: {
	path: path.resolve(__dirname, '../assets'),
	filename: 'js/[name].js',
	chunkFilename: 'js/[name].[chunkhash:8].js',
	publicPath: '/_static_/', //最终访问的路径就是：localhost:3000/_static_/js/*.js
	//pathinfo:true,
}
```
## mode 
+ 这个属于webpack4才新增的，4之前大家一般用`DefinePlugin`插件设置
+ mode：`development``，production`，`none`，
+ development : 开发模式，打包的代码不会被压缩，开启代码调试，
+ production : 生产模式，则正好反之。

```js 

//方法一
webpack --mode development/production

//方法二
……
mode:'development/production'
……

```

## 尾声：
话说从写博客到现在，也有一段时间了，非常感谢各位大佬的支持和指点，让我们一起成长。

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





