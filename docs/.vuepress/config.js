const path = require('path')

module.exports = {
    title: '干货网站',
    description: '帮助开发者的网站',
    chainWebpack(config) {
        config.resolve.alias
            .set('@public', path.join(__dirname, 'public'))
    },
    markdown: {
        lineNumbers: true,
        toc: { includeLevel: [1, 2] },
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
                        // itemPermalink: '/post/:year/:month/:day/:slug',
                        // pagination: {
                        //     lengthPerPage: 2,
                        // },
                    }
                ],
                sitemap: {
                    hostname: 'https://blog.slake5.com'
                },
            }
        ]
    ],
    // theme: '@vuepress/theme-blog',
    themeConfig: {
        sidebar: 'auto', // 侧边栏配置
        sidebarDepth: 2, // 侧边栏显示2级
        logo: '/favicon.ico',
        nav: [
            { text: 'RESUME', link: '/resume/' }
        ],
    }
}
