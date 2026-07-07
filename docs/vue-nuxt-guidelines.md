## Vue 3 與 Nuxt

- Vue 元件使用 Composition API 與 TypeScript。
- `defineProps`、`defineEmits` 與複雜 reactive state 應提供明確型別。
- Props 型別預設使用 `type`；只有確實符合 interface 例外條件時才使用 interface。
- Props 預設值使用 `withDefaults`；陣列或物件預設值使用 factory。
- `computed` 回傳型別清楚時使用推斷，公開或複雜計算可明確標註。
- `ref` 在初始值無法完整表達狀態時標註泛型。

```ts
type TProps = {
  title: string
  count?: number
  items: string[]
}

const props = withDefaults(defineProps<TProps>(), {
  count: 0,
  items: () => [],
})

const emit = defineEmits<{
  update: [value: string]
  delete: [id: number]
}>()
```
