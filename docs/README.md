---
home: true
title: Hacker
actionText: 快速上手
actionLink: /2018/04/04/demo/
---

# 首页

::: details 点击查看代码
```js {2}
var a = 'aaa'
console.log('a', 'a')
```
:::

<script>
  export default {
    mounted() {
      const keys = []
      for(const key in this) {
        keys.push(key)
      }
      console.log(keys)
    }
  }
</script>

## 这是我做到图片 <Badge text="默认主题"/> <Badge type="warn" text="默认主题"/> <Badge text="默认主题"/>

![这是图片](./.vuepress/public/WechatIMG214.png)

[foo header](./second/#this)


