<!-- # biu-function
## 第一次认真的写分享，求小星星，欢迎fork

## [手把手教你发布npm函数库](http://km.alanwen.online/guide/javascript/npm.html)
## Project setup
```sh
$ npm install
```

### Compiles and hot-reloads for development
```sh
$ npm run build
```

### npm publish
```
# login your own account
npm login
# you have to modify the library name in package.json if the package exits on npmjs.com
npm publish
```

### build your own libs

write your code in folder src, and build by wepback


### docs

Use jsdoc for this libaray docs, and theme is docdash. How you can config docdash, please visit [docdash Git Repo](https://github.com/clenemt/docdash). [Here](https://cancerberosgx.github.io/jsdoc-templates-demo/demo/) is more template for docjs.


```
// to update docs
npm run docs

```

### test

Use Jest to do test. [Jest document](https://jestjs.io/docs/zh-Hans/getting-started)

```
npm run test
```


### How to create this repo step by step, please visit [step by step publish npm](http://km.alanwen.online/guide/javascript/npm.html)
 -->

 ## 切换主题插件使用

需要安装`element-ui`

**安装依赖**

```sh
npm i @ansevenlet/change-theme-color -S
```

**如何使用**

```javascript
import { updateThemeColor } from '@ansevenlet/change-theme-color';
/**
 * 更新主题色 
 * @param targetColor 需要修改的色值
 * @param newColor 修改后的色值
 * @param ORIGINAL_THEME elementUI主题色
 */
updateThemeColor(targetColor, newColor, ORIGINAL_THEME);
```

>  由于切换主题色时需要全局修改颜色变量，所以项目中需要创建颜色变量，所有使用颜色的地方必须通过变量来设置，如果使用咱们自己的组件库组件，则需要传入色值。

>  组件中要有背景色和文字颜色的设置，或者其他设置只要需要变化颜色的属性都需要添加

**创建变量文件 .scss文件 **

定义颜色变量

*variable.scss*

```css
:root{
  --font-size: 16px; // 定义基础字号
  --theme-color: #3398ff; // 主题色
}
```
**设置颜色使用变量**

```css
background: var(--theme-color);
```
**控制颜色 修改色值**

```javascript
document.body.style.setProperty('--theme-color', '#ddd' || '');
```
* 示例 *

```html
<section class="theme-color">
  <!-- …… -->
  <el-color-picker v-model="color" @change="changeThemeColor"></el-color-picker>
  <!-- …… -->
</section>
```

```javascript
<script lang="ts">
import {
  defineComponent, reactive, toRefs,
} from '@vue/composition-api';
import { updateThemeColor } from '@ansevenlet/change-theme-color';

export default defineComponent({
  name: 'theme-color',

  setup() {

    const state = reactive({
      color: '#fff',
    });

    /**
     * 修改主题色
     */
    function changeThemeColor(color: string) {
      updateThemeColor(color, color, ORIGINAL_THEME);
      localStorage.setItem('theme_color', color);
      document.body.style.setProperty('--theme-color', color);
    }

    return {
      ...toRefs(state),
      changeThemeColor,
    };
  },
});
</script>
```
