# vue视频播放组件使用

![banner](./_images/timg.jpeg)

> 作者：[首席跳坑官∙皮得](https://blog.peterzhu.club/ "首席跳坑官∙皮得")<br/>
> 来源：[@IT·平头哥联盟](https://honeybadger8.github.io/blog/ "@IT·平头哥联盟")<br/>
> 交流群：[912594095](https://shang.qq.com/wpa/qunwpa?idkey=265166274bca82709718a0ae1fa9c55d65dd3608ebc780f9e6ea41e2761f5ec2 "@IT·平头哥联盟QQ交流群")，本文原创，著作权归作者所有，转载请注明原链接及出处。

## 前言

    开发遇到视频音频播放的需求,首先想到的是常用的videojs、audiojs这俩插件,但是在做vue开发肯定得换个思路，
    于是在github上找到了star较多的`vue-video-player`。下面直接切入正题，教你如何使用

## 安装
npm方式
```bash
npm install vue-video-player --save
```

## 引入和挂载
```javascript
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'

export default {
  components: {
    videoPlayer
  }
}
```
## 编写使用
编写vue组件

```vue
<template>
  <div class="container">
    <div class="player">
      <video-player  class="video-player"
                     ref="videoPlayer"
                     :playsinline="true"
                     :options="playerOptions"

                     @play="onPlayerPlay($event)"
                     @pause="onPlayerPause($event)"
      >
      </video-player>
    </div>
  </div>
</template>
 
<script>
import { videoPlayer } from 'vue-video-player';
import '@/assets/vue-video/custom-video.css'
export default {
  data () {
    return {
      
      /*组件的基本配置*/

      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0],    //播放速度选择
        autoplay: false,                         //自动播放。
        muted: false,                           // 默认消除音频。
        fluid: true,                             // 当true时，将按比例缩放以适应其容器。
        loop: false,                            // 循环。
        preload: 'auto',                       // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9',                     // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        sources: [{
          type: "video/mp4",                    //格式
          src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"   //视频地址（必填）
        }],
        poster: "poster.jpg",              //你的封面地址
        notSupportedMessage: '此视频暂无法播放，请稍后再试',  //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: { 
          timeDivider: true,                                                            
          durationDisplay: true,             //已过进度展示
          remainingTimeDisplay: false,       //剩余时间展示
          fullscreenToggle: true             //全屏按钮
        }
      }
    }
  },
  components: {
    videoPlayer
  },
  methods: {
  	
    onPlayerPlay(player) {
      console.log("play");              //播放回调
    },
    
    onPlayerPause(player){
      console.log("pause");              //暂停回调
    },
  },
  computed: {
    
    player() {                            //player对象 
      return this.$refs.videoPlayer.player
    }
  }
}
</script>

<style type="text/css" scoped>
  .container {
    background-color: #efefef;
    min-height: 100%;
  }
</style>

```
#### 提示
如果想自定义样式,不论style标签有没有增加scoped属性，写入style中都是无用的,这取决于vue加载样式的顺序,所以必须单独写样式文件,写在`import 'video.js/dist/video-js.css'`之后export default之前, 或者require样式在main.js中

## 音频播放（偷懒法）
这只是一个偷懒的方法, 如下

```
	sources: [{
      type: "audio/mp3", //格式
      src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp3" // 音频地址（必填）
    }],
```

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


