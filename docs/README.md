---
home: true
heroText: null
tagline: null
actionText: null
actionLink: null
footer: 沪ICP备20008105号
---

{{ $currentTags }}

<div class="home">
  <img class="home__img" src="./.vuepress/public/brand.png" />
  <div class="home--content">
    <h3 class="home__title">关于我</h3>
    <p>牛油果租房前端开发<strong>攻城狮</strong></p>
    <p>专注于 <strong>React Native</strong> 和 <strong>Nestjs</strong></p>
  </div>
</div>

<style scoped>
.home {
  display: flex;
  max-width: 350px;
  margin: auto;
  min-height: 100vh;
}
.home__img {
  width: 80px;
  height: 80px;
}
.home--content {
  margin-left: 20px;
}
.home--content > * {
  margin: 0;
}
.home__title {
  
  font-size: 28px;
}

</style>
