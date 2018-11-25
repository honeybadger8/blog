

# 在图书馆学习红宝书的一天（四）· 闭包真的是一个让人费解的名词～

![本文由@IT·平头哥联盟-团宠闪光少女∙粉刷酱分享](../_banner/banner25.jpg)

> 作者：[团宠闪光少女∙粉刷酱](https://github.com/cchah/ "团宠闪光少女∙粉刷酱")<br/>
> 来源：[@IT·平头哥联盟](https://honeybadger8.github.io/blog/ "@IT·平头哥联盟")<br/>
> 交流群：[912594095](https://shang.qq.com/wpa/qunwpa?idkey=265166274bca82709718a0ae1fa9c55d65dd3608ebc780f9e6ea41e2761f5ec2 "@IT·平头哥联盟QQ交流群")，本文原创，著作权归作者所有，转载请注明原链接及出处。

## 前言

　　大家好，这里是[@IT·平头哥联盟](https://honeybadger8.github.io/blog/ "@IT·平头哥联盟")，我是`团宠闪光少女`——[粉刷酱](https://github.com/cchah "团宠闪光少女")。

   当我第一次见到闭包这个词的时候，真的是不想理的词。这个名字起的真的太晦涩。 
   

## 正式开讲
   
   继承是面向对象的三大特征之一。继承就是让一个对象可以直接使用另一对象的属性和方法。js不是面向对象语言，但也有自己实现继承的方式。

#### 1.1 作用域和作用域链

   js中没有块级作用域的概念。

```js
function outputNumbers(count){
    for (var i=0; i < count; i++){
        alert(i); 
    }
    alert(i); //计数 
}
```
   在 Java、C++等语言中，变量 i 只会在 for 循环的语句块中有定义，循环一旦结束，变量 i 就会被销毁。可是JavaScrip 中，变量i是定义在ouputNumbers()的活动对象中的，因此从它有定义开始，就可以在函数内部随处访问它。


   以上～
   
   一起学习哟～～ 比心～～

   peace&love

![宝剑锋从磨砺出，梅花香自苦寒来，做有温度的攻城狮!](../_banner/card.png)


> 作者：粉刷酱 - [团宠闪光少女](https://github.com/cchah "团宠闪光少女")
>
> 来源：[@IT·平头哥联盟](https://honeybadger8.github.io/blog/ "@IT·平头哥联盟")
> 
> 链接：https://honeybadger8.github.io/blog/
> 
> 交流群：912594095[`资源获取/交流群`]、386485473(前端) 、260282062(测试)
>
> 本文原创，著作权归作者所有。商业转载请联系`@IT·平头哥联盟`获得授权，非商业转载请注明链接及出处。 
   