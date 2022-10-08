export const themeData = JSON.parse("{\"locales\":{\"/\":{\"navbar\":[{\"text\":\"Date\",\"link\":\"/date/\"},{\"text\":\"Scroll\",\"link\":\"/scroll/\"},{\"text\":\"Utils\",\"link\":\"/utils/\"}],\"sidebar\":{\"/date/\":[{\"text\":\"指南\",\"children\":[\"/date/index.md\",\"/date/function.md\"]}]},\"editLinkText\":\"Edit this page on GitHub\",\"selectLanguageName\":\"English\"}},\"navbar\":[{\"text\":\"首页\",\"link\":\"/\"}],\"colorMode\":\"auto\",\"colorModeSwitch\":true,\"logo\":null,\"repo\":null,\"selectLanguageText\":\"Languages\",\"selectLanguageAriaLabel\":\"Select language\",\"sidebar\":\"auto\",\"sidebarDepth\":2,\"editLink\":true,\"editLinkText\":\"Edit this page\",\"lastUpdated\":true,\"lastUpdatedText\":\"Last Updated\",\"contributors\":true,\"contributorsText\":\"Contributors\",\"notFound\":[\"There's nothing here.\",\"How did we get here?\",\"That's a Four-Oh-Four.\",\"Looks like we've got some broken links.\"],\"backToHome\":\"Take me home\",\"openInNewWindow\":\"open in new window\",\"toggleColorMode\":\"toggle color mode\",\"toggleSidebar\":\"toggle sidebar\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateThemeData) {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ themeData }) => {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  })
}
