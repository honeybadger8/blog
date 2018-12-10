

# 在图书馆学习红宝书的一天（四）· 闭包真的是一个让人费解的名词～

![本文由@IT·平头哥联盟-团宠闪光少女∙粉刷酱分享](../_banner/banner25.jpg)

> 作者：[团宠闪光少女∙粉刷酱](https://github.com/cchah/ "团宠闪光少女∙粉刷酱")<br/>
> 来源：[@IT·平头哥联盟](https://honeybadger8.github.io/blog/ "@IT·平头哥联盟")<br/>
> 交流群：[912594095](https://shang.qq.com/wpa/qunwpa?idkey=265166274bca82709718a0ae1fa9c55d65dd3608ebc780f9e6ea41e2761f5ec2 "@IT·平头哥联盟QQ交流群")，本文原创，著作权归作者所有，转载请注明原链接及出处。

## 前言

   有一种难过叫我都懂，但就是不会做。更有一种难过，叫做我都会做，但是我说不出来。前者会让我们在装逼之后提心吊胆，而后者却让我们不仅体会不到装逼的乐趣，还在面试时候吃各种亏。

   所以让我们一起理清楚一下那些名字晦涩的概念们～

## 正式开讲
   
   闭包是指有权访问另一个 函数作用域中的变量的函数。
   
   创建闭包的常见方式，就是在一个函数内部创建另一个函数。

```js
function createComparisonFunction(propertyName) {
   return function(object1, object2){
      var value1 = object1[propertyName];
      var value2 = object2[propertyName];
      if (value1 < value2){
         return -1;
      } else if (value1 > value2){
         return 1;
      } else {
         return 0;
      }
   };
}
```

#### 1.1  作用域链

   先说说作用域链的概念。
   
   js中没有块级作用域的概念。每个函数都有自己的执行环境。每个执行环境都有一个与之关联的变量对象(variable object)。当代码在一个环境中执行时，会创建变量对象的一个作用域链(scope chain)。作用域链的用途是保证对执行环境有权访问的所有变量和函数的有序访问。在作用域链中，外部函数的活动对象始终处于第二位，外部函数的外部函数的活动对象处于第三位，......直至作为作用域链终点的全局执行环境。

   所以上述代码中内部函数仍然可以访问变量propertyName。


#### 1.2  闭包与变量

   闭包只能取得包含函数中任何变量的最后一个值。

```js
function createFunctions(){
   var result = new Array();
   for (var i=0; i < 10; i++){
         result[i] = function(){
         return i; 
         };
      }
   return result;
}
```
   因为每个函数的作用域链中 都保存着createFunctions()函数的活动对象，所以它们引用的都是同一个变量i。当 createFunctions()函数返回后，变量 i 的值是10，此时每个函数都引用着保存变量 i 的同一个变量对象，所以在每个函数内部 i 的值都是10。

   可以通过创建另一个匿名函数强制让闭包的行为符合预期。

```js
function createFunctions(){
   var result = new Array();
   for (var i=0; i < 10; i++){
      result[i] = function(num){
         return function(){
            return num;
         }; 
      }(i);
   }
   return result;
}
```

#### 1.3  内存泄漏

   闭包会引用包含函数的整个活动对象，而其中包含着 element。即使闭包不直接引用 element，包含函数的活动对象中也 仍然会保存一个引用。因此，有必要把 element 变量设置为 null。这样就能够解除对 DOM 对象的引 用，顺利地减少其引用数，确保正常回收其占用的内存。

```js
function assignHandler(){
   var element = document.getElementById("someElement"); 
   var id = element.id;
   element.onclick = function(){
      alert(id);
   };
   element = null;
}
```

#### 1.4  模仿块级作用域

```js
function outputNumbers(count){
   (function () {
   for (var i=0; i < count; i++){
         alert(i);
      }
   })();
   alert(i); //导致一个错误! 
}
```

   在匿名函数中定义的任何变量，都会在执行结束时被销毁。因此，变量 i 只能在循环中使用，使用后即被销毁。

   这种技术经常在全局作用域中被用在函数外部，从而限制向全局作用域中添加过多的变量和函数。   

```js
(function(){
   var now = new Date();
   if (now.getMonth() == 0 && now.getDate() == 1){
      alert("Happy new year!");
   }
})();
```

#### 1.5  私有变量

   任何在函数中定义的变量，都可以认为是私有变量，因为不能在函数的外部访问这些变量。

   我们把有权访问私有变量和私有函数的公有方法称为特权方法(privileged method)。

```js
function MyObject(){
   var privateVariable = 10;
   function privateFunction(){
      return false;
   }
   //特权方法
   this.publicMethod = function (){
      privateVariable++;
      return privateFunction();
   };
}
```

#### 1.6  静态私有变量
 
   通过在私有作用域中定义私有变量或函数，同样也可以创建特权方法

```js
(function(){
   //私有变量和私有函数
   var privateVariable = 10;
   function privateFunction(){
      return false;
   }
   //构造函数
   MyObject = function(){ };
   //公有/特权方法
   MyObject.prototype.publicMethod = function(){
      privateVariable++;
      return privateFunction();
   };
})();
```

   以这种方式创建静态私有变量会因为使用原型而增进代码复用，但每个实例都没有自己的私有变量。


   tips:多查找作用域链中的一个层次，就会在一定程度上影响查找速度。而这正是使用 闭包和私有变量的一个显明的不足之处。

#### 1.7  模块模式
 
   模块模式通过为单例添加私有变量和特权方法能够使其得到增强

```js
var singleton = function(){
   //私有变量和私有函数
   var privateVariable = 10;
   function privateFunction(){
      return false;
   }
   //特权/公有方法和属性
   return {
      publicProperty: true,
      publicMethod : function(){
         privateVariable++;
         return privateFunction();
      }
   };       
}();
```

   模块模式增强：改进了模块模式，即在返回对象之前加入对其增强的代码。
```js
var singleton = function(){
   //私有变量和私有函数
   var privateVariable = 10;
   function privateFunction(){
      return false;
   }
   //创建对象
   var object = new CustomType();
   //添加特权/公有属性和方法 object.publicProperty = true;
   object.publicMethod = function(){
      privateVariable++;
      return privateFunction();
   };
   //返回这个对象
    return object;
}();
```

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
   