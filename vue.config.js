const WriteFileWebpackPlugin = require("write-file-webpack-plugin");

const isDev = process.env.NODE_ENV !== "production";

module.exports = {
  outputDir: "stock-widget",
  publicPath: "/",
  pages: {
    index: {
      // page 的入口
      entry: "src/main-index.js",
      // 模板来源
      template: "public/index.html",
      // 在 dist/index.html 的输出
      filename: "index.html",
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: "我的自选",
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ["chunk-vendors", "chunk-common", "index"]
    },
    popup: {
      entry: "src/main-popup.js",
      template: "public/index.html",
      filename: "popup.html",
      title: "我的自选",
      chunks: ["chunk-vendors", "chunk-common", "popup"]
    }
  },
  lintOnSave: isDev,
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    }
    // proxy: {
    //   "/api": {
    //     target: "<url>",
    //     ws: true,
    //     changeOrigin: true
    //   }
    // }
  },
  configureWebpack: {
    plugins: isDev ? [new WriteFileWebpackPlugin()] : []
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            "primary-color": "#1890ff", // 全局主色
            "link-color": "#1890ff", // 链接色
            "success-color": "#52c41a", // 成功色
            "warning-color": "#faad14", // 警告色
            "error-color": "#f5222d", // 错误色
            "font-size-base": "14px", // 主字号
            "heading-color": "rgba(0, 0, 0, 0.85)", // 标题色
            "text-color": "rgba(0, 0, 0, 0.65)", // 主文本色
            "text-color-secondary": "rgba(0, 0, 0, 0.45)", // 次文本色
            "disabled-color": "rgba(0, 0, 0, 0.25)", // 失效色
            "border-radius-base": "4px", // 组件/浮层圆角
            "border-color-base": "#d9d9d9", // 边框色
            "box-shadow-base": "0 2px 8px rgba(0, 0, 0, 0.15)" // 浮层阴影
          },
          javascriptEnabled: true
        }
      }
    }
  },
  productionSourceMap: false
};
