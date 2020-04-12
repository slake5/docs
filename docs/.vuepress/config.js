const path = require('path')

// console.log('require.resolve', require.resolve)

module.exports = {
    title: '助手网',
    description: '帮助开发者的网站',
    head:[
        ['link', { rel:'shortcut icon', href:'/favicon.ico' }]
    ],
    chainWebpack(config) {
        config.resolve.alias
            .set('@public', path.join(__dirname, 'public'))
    },
    markdown: {
        lineNumbers: true,
        // toc: { includeLevel: [2, 3] },
    },
    // plugins: [
    //     ['@vuepress/blog', {
    //         permalink: '/:regular',
    //         frontmatters: [
    //             {
    //                 id: 'post',
    //                 keys: ['post'],
    //                 path: '/_posts/',
    //             }
    //         ],
    //         sitemap: {
    //             hostname: 'https://blog.slake5.com'
    //         },
    //     }]
    // ],
    plugins: [
        [
            '@vuepress/blog',
            {
                directories: [
                    {
                        id: 'post',
                        dirname: '_posts',
                        path: '/post/',
                        // layout: '../../node_modules/@vuepress/theme-blog/layouts/Post',
                        // layout: path.join(__dirname, '../../node_modules/@vuepress/theme-blog/layouts/Layout'),
                        // itemPermalink: '/post/:year/:month/:day/:slug',
                        // pagination: {
                        //     lengthPerPage: 2,
                        // },
                    }
                ],
                sitemap: {
                    hostname: 'https://blog.slake5.com'
                },
                summary: true,
                smoothScroll: true,
                globalPagination: {
                    prevText:'上一页', // Text for previous links.
                    nextText:'下一页', // Text for next links.
                    lengthPerPage:'1', // Maximum number of posts per page.
                    // layout:'Pagination', // Layout for pagination page
                },
            }
        ]
    ],
    themeConfig: {
        sidebar: {
            '/_posts/': [
                '',
                '2018-04-04-demo',
                '2020-01-01-dating',
                '2020-01-01-travel',
            ]
        },
        // sidebarDepth: 2, // 侧边栏显示2级
        // lastUpdated: '最后更新',
        // logo: '/favicon.ico',
        nav: [
            {
                text: '前端',
                ariaLabel: '前端下拉菜单',
                items: [
                    { text: 'React', link: '/react/' },
                    { text: 'Vue', link: '/vue/' },
                ]
            },
            { text: '后端', link: '/back/' },
            { text: '博客', link: '/post/' },
            { text: 'RESUME', link: '/resume/' },
        ],
    },
}
