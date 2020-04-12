<template>
  <ParentLayout>
    <ul slot="page-top" class="post theme-default-content content__default">
      <!--<li>
        {{ $pagination }}
      </li>-->
      <li class="post--item" v-for="page in $pagination.pages">
        <router-link class="post__title" :to="page.path">{{ page.title }}</router-link>
        <p class="post__summary">{{ page.summary }}</p>
        <footer>
          <svg t="1586677518394" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8076" width="200" height="200"><path d="M511.474 884.11c-205.692 0-373.042-167.083-373.042-372.46 0-205.371 167.35-372.46 373.042-372.46 205.698 0 373.042 167.089 373.042 372.46 0 205.376-167.344 372.46-373.042 372.46m0-819.412c-246.84 0-447.649 200.496-447.649 446.951 0 246.457 200.809 446.951 447.649 446.951 246.842 0 447.649-200.494 447.649-446.951 0-246.455-200.808-446.951-447.649-446.951M548.781 504.5V288.177c0-20.574-16.701-37.249-37.307-37.249-20.6 0-37.3 16.675-37.3 37.249v231.742c0 9.872 3.916 19.368 10.929 26.33l125.08 124.891a37.235 37.235 0 0 0 52.749 0c14.56-14.543 14.56-38.123 0-52.667L548.781 504.5z m0 0" p-id="8077"></path></svg>
          <time>{{ page.lastUpdated }}</time>
        </footer>
      </li>
    </ul>
    <div slot="page-top" style="text-align: center">
      <Pagination />
    </div>
  </ParentLayout>
</template>

<script>
  import ParentLayout from '@parent-theme/layouts/Layout.vue'
  import { Pagination } from '@vuepress/plugin-blog/lib/client/components'
  export default {
    components: {
      ParentLayout,
      Pagination
    },
  }
</script>

<style lang="stylus">
  .simple-pagination
    a
      color $textColor
      border 1px solid $textColor
</style>

<style lang="stylus" scoped>
  $post-bg-color = rgba(239, 247, 239 0.5)

  .post
    /*padding $navbarHeight * 2 $navbar-horizontal-padding
    width 100%
    max-width $contentWidth + $navbar-horizontal-padding
    margin auto
    box-sizing border-box*/
    border-left 1px solid
    list-style none
    @media (max-width: $contentWidth)
      border-left none

    &--item
      font-size 12px
      font-weight 200
      margin-top 16px
      padding-bottom 20px
      border-radius 8px
      border-bottom 1px solid $post-bg-color
      color rgba(0,0,0,.54)

      p
        margin 5px 0
      footer
        display flex
        align-items center
      svg
        width 12px
        height 12px
        margin-right 5px

    &__title
      color $textColor
      font-size 24px
      font-weight 600
      white-space nowrap
      text-overflow ellipsis
      width 100%
      display block
      overflow hidden

    &__summary
      font-size 14px

</style>
