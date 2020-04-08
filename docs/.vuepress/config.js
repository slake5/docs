const path = require('path')

module.exports = {
    title: 'Slake 5 的博客',
    description: '帮助开发者的网站',
    chainWebpack(config) {
        config.resolve.alias
            .set('@public', path.join(__dirname, 'public'))
    },
    markdown: {
        lineNumbers: true
    },
    plugins: [
        [
            '@vuepress/blog',
            {
                directories: [
                    {
                        id: 'post',
                        dirname: '_posts',
                        path: '/',
                        pagination: {
                            lengthPerPage: 2,
                        },
                    }
                ]
            }
        ]
    ],
    themeConfig: {
        sidebar: 'auto', // 侧边栏配置
        sidebarDepth: 2, // 侧边栏显示2级
    }
}
