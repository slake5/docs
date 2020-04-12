const path = require('path')

module.exports = {
  title: '助手网',
  description: '帮助开发者的网站',
  head: [
    ['link', {rel: 'shortcut icon', href: '/favicon.ico'}]
  ],
  chainWebpack(config) {
    config.resolve.alias
      .set('@public', path.join(__dirname, 'public'))
  },
  markdown: {
    lineNumbers: true,
    // toc: { includeLevel: [2, 3] },
  },
  plugins: [
    [
      '@vuepress/blog',
      {
        directories: [
          {
            id: 'post',
            dirname: '_posts',
            path: '/post/',
            // pagination: {
            //     lengthPerPage: 10,
            // },
          }
        ],
        sitemap: {
          hostname: 'https://blog.slake5.com'
        },
        smoothScroll: true,
        globalPagination: {
          prevText: '上一页', // Text for previous links.
          nextText: '下一页', // Text for next links.
          lengthPerPage: 10, // Maximum number of posts per page.
        },
      }
    ]
  ],
  themeConfig: {
    sidebar: {
      '/group/': [
        '',
        'one',
      ]
    },
    summary: true,
    summaryLength: 100,
    // sidebarDepth: 2, // 侧边栏显示2级
    lastUpdated: '最后更新',
    // logo: '/favicon.ico',
    nav: [
      {
        text: '前端',
        ariaLabel: '前端下拉菜单',
        items: [
          {text: 'React', link: '/react/'},
          {text: 'Vue', link: '/vue/'},
        ]
      },
      {text: '后端', link: '/group/'},
      {text: '博客', link: '/post/'},
      {text: 'RESUME', link: '/cv/'},
    ],
  },
}
