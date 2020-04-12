const removeMd = require('remove-markdown')

module.exports = themeConfig => ({
  extend: '@vuepress/theme-default',
  /**
   * Generate summary.
   */
  extendPageData(pageCtx) {
    const strippedContent = pageCtx._strippedContent
    if (!strippedContent) {
      return
    }
    if (themeConfig.summary) {
      pageCtx.summary = typeof pageCtx.frontmatter.summary !== 'undefined'
        ? pageCtx.frontmatter.summary
        : removeMd(
        strippedContent
          .trim()
          .replace(/^#+\s+(.*)/, '')
          .slice(0, themeConfig.summaryLength)
      ) + ' ...'
      pageCtx.frontmatter.description = pageCtx.summary
    }
    if (pageCtx.frontmatter.summary) {
      pageCtx.frontmatter.description = pageCtx.frontmatter.summary
    }
  },
})
