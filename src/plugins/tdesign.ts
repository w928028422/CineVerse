import type { App } from 'vue'
import {
  Button,
  Card,
  Tag,
  Input,
  Select,
  Option,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Loading,
  MessagePlugin,
  NotifyPlugin,
  RadioGroup,
  Radio,
  Pagination,
  Alert,
} from 'tdesign-vue-next'

// 按需导入 TDesign 组件
export function setupTDesign(app: App) {
  app.use(Button)
  app.use(Card)
  app.use(Tag)
  app.use(Input)
  app.use(Select)
  app.use(Option)
  app.use(Dropdown)
  app.use(DropdownMenu)
  app.use(DropdownItem)
  app.use(Loading)
  app.use(RadioGroup)
  app.use(Radio)
  app.use(Pagination)
  app.use(Alert)

  // 全局方法
  app.config.globalProperties.$message = MessagePlugin
  app.config.globalProperties.$notify = NotifyPlugin
}
