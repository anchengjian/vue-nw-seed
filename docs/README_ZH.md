# vue-nw-seed

> 一个 Vue.js 和 Nw.js 的种子项目

[english](/README.md) | [中文](/docs/README_ZH.md)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# 有了 `dist` 的情况下，仅仅打包 NW
npm run build --onlyNW

# windows 下不打包 setup 文件
npm run build --noSetup
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Demo
### `npm run dev`
![dev](/docs/assets/dev.gif)

### `npm run build`
![build](/docs/assets/build.gif)

### 升级更新
![update](/docs/assets/upgrade.gif)

### 制作一个更漂亮的 windows 安装程序
这个功能目前在 [vue-nw-seed/origin/win-beautiful-setup](https://github.com/anchengjian/vue-nw-seed/tree/win-beautiful-setup) 分支上。
![win-setup](/docs/assets/win-setup.gif)
 
## 常见问答
### 为啥要固定 nw 版本为 0.14.7 ？
NW.js 不是全版本都支持 XP，由于 Chromium50 开始就不支持XP了，所以如果你的客户端要支持 XP，目前最佳的版本选择是 `0.14.7` 。参见 NW.js 的博客 [NW.js v0.14.7 (LTS) Released](https://nwjs.io/blog/v0.14.7/)
### 国内用 NPM 安装 NW 很慢很卡！
可以先想办法把包体下下来到本地，再进行安装。在我之前的一篇文章中介绍过: [用 vue2 和 webpack 快速建构 NW.js 项目](https://github.com/anchengjian/anchengjian.github.io/blob/master/posts/2017/vuejs-webpack-nwjs.md)

### 安装包默认是英文?
如果您不做任何更改，则默认是英文的。   
汉化的话，我提供了一个中文语言包。请手动打开 `./config/setup.iss` 中关于 `Languages` 的注释。