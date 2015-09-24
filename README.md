#Dujo
###Dujo简介

####侧重解决移动端单页面应用页面管理的问题，并提供一批以用好用的UI组件帮助大家方便的应用html5 进行移动开发

###联系方式和技术支持

+ 作者联系方式:qq289880020

##层次结构
###dujo.core.js  换掉了jquery的动画引擎
###dujo.page.js  页面管理
###dujo.ui.js、dujo.css UI层
##页面配置
dujo.config({
        delay:300,//页面跳转滑动时间毫秒
        index: {
            page:"one",//初始化的页面
            url: "page/#page#",//url替换掉#page#组成的url  为页面的地址
            data: {}//初始化页面要传递的参数
        },
        version: 1002,
        //版本号 通过改变版本号
        //可以清除缓存
        //当系统有html css js文件
        //变更的时候 修改version
        debug:true
        //调试模式打开则页面不缓存，
        //否则页面会缓存
    })
##URL
/index.html?page=two&name=张三
+ page要访问的页面
+ name 要传递的参数，这个可以传递多个参数
##系统API
###1.加载页面：dujo.loadPage(url，programs,isHistory)
+ url：加载页面地址
+ programs:压面传递的参数ru：{name:"张三"}
+ isHistory当前的页面是否加入历史，默认计入历史，如果不记录历史，择加载新的页面后，按返回按钮 不能返回的刚才的页面，回返回的上一页
###2.锁定屏幕：dujo.lockScreen()                                                                          
###3.解除锁定屏幕：dujo.unlockScreen()                                                               
###4.获取历史页面：dujo.getHistory(num)
+ num 从-1 开始 如果为-1 则为倒数第一页                                                          
###5. 显示页面：dujo.pageShow(callback)
+ callback 新的页面移除后执行回调，可以为空
###6.返回上一页：dujo.pageBack(callback)
+callback旧的页面移除屏幕执行回调，可以为空                                                                     
###7.页面预加载：dujo.preLoad(arr)
+ arr 为数组如：["two","one"]                                                                      
###8.是否有历史页面：dujo.hasHistory()                                                                    
###9.样式：dujo-back
+ 加入次样式的元素，有历史页面会自动显示，无历史页面会自动隐藏，并且点击该元素会返回上一页                                                                                              
###10.清除历史页面：dujo.clearHistory()  
