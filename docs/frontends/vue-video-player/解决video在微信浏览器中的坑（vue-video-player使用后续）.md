# 解决video在微信浏览器中点击自动全屏的问题(vue-video-player使用后续)

![banner](./images/timg.png)

> 作者：[首席跳坑官∙皮得](https://blog.peterzhu.club/ "首席跳坑官∙皮得")<br/>
> 来源：[@IT·平头哥联盟](https://honeybadger8.github.io/blog/ "@IT·平头哥联盟")<br/>
> 交流群：[912594095](https://shang.qq.com/wpa/qunwpa?idkey=265166274bca82709718a0ae1fa9c55d65dd3608ebc780f9e6ea41e2761f5ec2 "@IT·平头哥联盟QQ交流群")，本文原创，著作权归作者所有，转载请注明原链接及出处。

## 前言

接着之前的[《vue-video-player 插件使用》](frontends/vue-video-player/vue-video-player使用.md),
此文主要讲的是video标签播放在微信浏览器中自动全屏的解决办法,笔主google了很多解决方案都是用不了的(哔了狗了)

## 属性熟悉
下面是video中几个特殊Attribute的作用

- `poster="loadbg.jpg"` : 视频封面
- `x-webkit-airplay="allow"` : 允许iOS的airplay
- `x5-video-player-type="h5"` : 启用x5内核的播放器,是微信安卓版特性,另外在X5内核里，video是单独的一个view，会覆盖在任何元素之上,据说是为了统一用户体验，加上这个属性之后，也可以让其他元素浮在video上面了
- `x5-playsinline="true"`: 在x5内核的播放器中小屏播放    
- `x5-video-player-fullscreen="true"`: 全屏设置，设置为 true 是防止横屏
- `x5-video-orientation="portraint"`: 播放方向，landscape横屏，portraint竖屏，默认值为竖屏
- `webkit-playsinline="true"`: 这个属性是iOS中设置可以让视频在小窗内播放，也就是不是全屏播放
- `playsinline="true"`: IOS微信浏览器支持小窗内播放

## 思路与初尝试

上面属性熟悉后,有了些思路, 不就是把上面要的属性都写一遍吗,这样iOS端和android端微信都能起作用,
 然鹅, 实际情况并非如此。 经过我无数次尝试, 总结出就是得分开写！！ 

## 代码修改

1. 之前`:playsinline="playsinline" `这里是true写死的,现在改为计算属性playsinline(),代码如下
```template
<video-player  class="video-player-box"
	                 ref="videoPlayer"
	                 :options="playerOptions"
	                 :playsinline="playsinline" 
	                 customEventName="customstatechangedeventname"
					 
	                 @play="onPlayerPlay($event)"
	                 @pause="onPlayerPause($event)"
	                 @ended="onPlayerEnded($event)"
	                 @waiting="onPlayerWaiting($event)"
	                 @playing="onPlayerPlaying($event)"
	                 @loadeddata="onPlayerLoadeddata($event)"
	                 @timeupdate="onPlayerTimeupdate($event)"
	                 @canplay="onPlayerCanplay($event)"
	                 @canplaythrough="onPlayerCanplaythrough($event)"
	                 @statechanged="playerStateChanged($event)"
	                 @ready="playerReadied">
	    </video-player>
```
	 
2. 添加playsinline()这个计算属性,原因是在安卓和iOS端微信使用的内核不同,所需要的attribute也不同,尝试后,安卓x5内核情况返回false,反之为true
```javascript
  computed: {
      playsinline(){
      		var ua = navigator.userAgent.toLocaleLowerCase();
	        //x5内核
		    if (ua.match(/tencenttraveler/) != null || ua.match(/qqbrowse/) != null) {
		    	return false
		    }else{
		    	//ios端
				return true				
		    }
      }
    },
```

3. 配合jq,在vue-video-player的onPlayerCanplay(视频可播放)这个方法中，添加两个端所需的属性
```javascript
onPlayerCanplay(player) {
		var ua = navigator.userAgent.toLocaleLowerCase();
		if (ua.match(/tencenttraveler/) != null || ua.match(/qqbrowse/) != null) {	
			//x5内核	
		    $('body').find('video').attr('x-webkit-airplay',true).attr('x5-playsinline',true).attr('webkit-playsinline',true).attr('playsinline',true)
		}else{
		    $('body').find('video').attr('webkit-playsinline',"true").attr('playsinline',"true") 
		}
},
```

## 总结
1. 以区分两个端内核的不同,按需添加所需的Attribute
2. ":playsinline"组件中自定义属性,按内核不同按需传值, x5内核为false,反之为true然后来渲染组件(具体原理有待挖掘)

欢迎大家一起探讨 ～～

> 作者：皮得 - [首席跳坑官](https://blog.peterzhu.club/)
>
> 来源：[@IT·平头哥联盟](https://honeybadger8.github.io/blog/ "@IT·平头哥联盟")
> 
> 链接：https://honeybadger8.github.io/blog/
> 
> 交流群：912594095[`资源获取/交流群`]、386485473(前端) 、260282062(测试)
>
> 本文原创，著作权归作者所有。商业转载请联系`@IT·平头哥联盟`获得授权，非商业转载请注明链接及出处。 
