---
home: true
heroText: null
tagline: null
actionText: null
actionLink: null
footer: 沪ICP备20008105号
---

<div class="container">
  <div class="index">
    <img class="index__img" src="./.vuepress/public/brand.png" />
    <div class="index--content">
      <h3 class="index__title">关于我</h3>
      <p>牛油果租房前端开发<strong>攻城狮</strong></p>
      <p>专注于 <strong>React Native</strong> 和 <strong>NestJs</strong></p>
      <p>最后还是把零散的笔记搬到这里来了，花些时间整理成章，分享给朋友们</p>
    </div>
  </div>
  
  <div class="more">
    <span>前端</span>
    <span>后端</span>
    <span>更多 →</span>
  </div>
</div>

<style scoped>
.container {
  min-height: 100vh;
}

.index {
  display: flex;
  max-width: 450px;
  margin: auto;
  padding-top: 50px;
  padding-left: 88px;
}
.index__img {
  width: 88px;
  height: 88px;
}
.index--content {
  margin-left: 20px;
}
.index--content > * {
  margin: 0;
}
.home__title {
  font-size: 28px;
}
.more {
  text-align: center;
  margin-top: 120px;
}
.more > * {
  display: inline-block;
  padding: 5px 20px;
  border-radius: 30px;
  border: 1px solid;
  margin: 0 10px;
  cursor: pointer;
  color: #445e78;
  user-select: none;
}
.more > *:first-child {
  color: #ffffff;
  background-color: #000000;
}
.more > *:last-child {
  color: #fff;
  background-color: silver;
}
.more > *:hover {
}

</style>
