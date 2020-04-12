const path = require('path')

module.exports = {
  title: 'HBC_技术笔记',
  description: '帮助开发者的网站',
  head: [
    ['link', {rel: 'shortcut icon', href: '/favicon.ico'}],
  ],
  chainWebpack(config) {
    config.resolve.alias
      .set('@public', path.join(__dirname, 'public'))
  },
  locales: {
    '/': {
      lang: 'zh-CN', // 将会被设置为 <html> 的 lang 属性
    }
  },
  markdown: {
    lineNumbers: true,
  },
  plugins: [
    '@vuepress/medium-zoom',
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
        globalPagination: {
          prevText: '⬅️',
          nextText: '➡️',
          lengthPerPage: 10,
        },
      }
    ]
  ],
  themeConfig: {
    sidebar: {
      '/nest/': [
        '',
        'advanced',
        'jwt',
      ]
    },
    // sidebar: [
    //   {
    //     title: 'Nest',   // 必要的
    //     path: '/nest/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
    //     // collapsable: false, // 可选的, 默认值是 true,
    //     sidebarDepth: 4,    // 可选的, 默认值是 1
    //     children: [
    //       '/nest/',
    //       '/nest/advanced',
    //       '/nest/jwt',
    //     ]
    //   },
    //   {
    //     title: 'React',   // 必要的
    //     path: '/react/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
    //     // collapsable: false, // 可选的, 默认值是 true,
    //     sidebarDepth: 4,    // 可选的, 默认值是 1
    //     children: [
    //       '/nest/advanced',
    //       '/nest/',
    //       '/nest/jwt',
    //     ]
    //   },
    // ],
    summary: true,
    summaryLength: 100,
    smoothScroll: true,
    sidebarDepth: 2, // 侧边栏显示2级
    lastUpdated: '最后更新',
    // logo: '/favicon.ico',
    nav: [
      {
        text: '技术',
        ariaLabel: '技术下拉菜单',
        items: [
          {
            text: '前端',
            items: [
              {text: 'React 系列', link: '/react/'},
              {text: 'Vue 系列', link: '/vue/'},
              {text: 'Typescript', link: '/typescript/'}, // 入门, 深入, 问题
              // {text: 'Egret', link: '/egret/'},
              {text: '移动开发', link: '/mobile/'}, // React Native, umi-app, Weex
              {text: '游戏开发', link: '/game/'}, // egret, threejs
            ],
          },
          {
            text: '后端',
            items: [
              {text: 'Nest', link: '/nest/'},
              {text: 'TypeOrm', link: '/typeorm/'},
              {text: 'Serverless', link: '/serverless/'},
            ],
          },
          {
            text: '其他',
            items: [
              {text: 'Linux', link: '/linux/'}, // 常用命令，环境配置
              {text: 'Docker', link: '/docker/'}, // docker 安装，docker 集群管理
              {text: '树莓派', link: '/raspberrypi/'}, // linux 知识
            ],
          },
        ]
      },
      {text: '博客', link: '/post/'},
      {text: '关于我', link: '/aboutme/'},
      {
        text: '更多',
        ariaLabel: '更多下拉菜单',
        items: [
          {
            text: '干货',
            items: [
              {text: '科学上网(go-proxy)', link: '/science/'},
              {text: 'CI / CD', link: '/ci/'},
            ]
          },
          {
            text: '其他',
            items: [
              {text: 'CV', link: '/cv/'},
            ]
          },
        ],
      },
    ],
  },
}
