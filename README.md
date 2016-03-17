# frontbuild
前端构建工具

  ![version](https://img.shields.io/github/release/qubyte/rubidium.svg)  ![license](https://img.shields.io/cocoapods/l/AFNetworking.svg) 

=========

## frontbuild是干什么用的？
frontbuild是快速搭建前端构建工程的一个命令行工具
* 在初始化时，它会新建项目的目录结构
* 它集成browserify、reactjs、less、ejs，对js、css、html文件的模块进行管理
* 在线下开发时，它使用express对资源进行动态解析，使代码实时生效
* 它能对资源进行打包，生成线上资源，同时给html文件中引用的资源添加md5戳


## frontbuild怎么使用？
先安装frontbuild
```
npm install frontbuild -g
```
接着新建你的项目目录
```
mkdir yourProject
cd yourProject
```
初始化项目
```
frontbuild init
// 这时会生成如下目录结构
-src       // 资源目录 开发的html文件可以放这里  html文件支持ejs
|--js      // js资源目录 开发的js文件可以放这里  js文件支持browserify jsx文件支持reactjs
|--css     // css资源目录 开发的less文件可以放这里 less文件支持less解析
-asset     // 打包的资源目录   当打包代码时，frontbuild会将src下的文件打包到这里来
|--js      
|--css
-widget    // 放置模块的目录

```
开启解析服务，可以访问线上文件或者线下文件，也可以指定服务的端口
```
// 开启服务，这时根目录指向/src，访问线下文件
// 访问js文件夹下的js文件，会使用browserify解析，访问jsx文件时会使用browserify和reactify解析
// 访问css文件夹下的less文件，会使用less解析
frontbuild server offline -p 9000

// 开启服务，这时根目录指向/asset，访问线上文件
// 这里访问到的文件都是已经打包好的
frontbuild server online -p 9000

```

打包src下的文件

```
// 将/src下的文件按相同的路径打包到/asset下
// less文件会被编译称css文件，js、jsx文件都会被编译成js文件，所以/src路径下，在同样路径中的js、jsx文件不允许同名
frontbuild build
```

