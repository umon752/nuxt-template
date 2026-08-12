import type { CSSProperties, Ref, TemplateRef } from 'vue'

type TSubmenuPositionOptions = {
  panelRef: TemplateRef<HTMLElement>
  nested: Ref<boolean>
}

type TSubmenuPositionReturn = {
  panelStyle: Ref<CSSProperties>
  refreshPosition: () => Promise<void>
}

export function useDropdownMenuPosition(options: TSubmenuPositionOptions): TSubmenuPositionReturn {
  const panelStyle = ref<CSSProperties>({})

  function getBaseStyle(nested: boolean): CSSProperties {
    if (nested) {
      return {
        top: '0',
        left: '100%',
        right: 'auto',
        transform: 'none',
      }
    }

    return {
      top: '100%',
      left: '50%',
      right: 'auto',
      transform: 'translateX(-50%)',
    }
  }

  async function refreshPosition(): Promise<void> {
    if (!import.meta.client) return

    panelStyle.value = getBaseStyle(options.nested.value)
    await nextTick()

    const panel = options.panelRef.value
    if (!panel) return

    const rect = panel.getBoundingClientRect()
    const padding = 8

    if (options.nested.value) {
      if (rect.right > window.innerWidth - padding) {
        panelStyle.value = {
          top: '0',
          left: 'auto',
          right: '100%',
          transform: 'none',
        }
        return
      }

      panelStyle.value = getBaseStyle(true)
      return
    }

    if (rect.right > window.innerWidth - padding) {
      panelStyle.value = {
        top: '100%',
        left: 'auto',
        right: '0',
        transform: 'none',
      }
      return
    }

    if (rect.left < padding) {
      panelStyle.value = {
        top: '100%',
        left: '0',
        right: 'auto',
        transform: 'none',
      }
      return
    }

    panelStyle.value = getBaseStyle(false)
  }

  const handleResize = (): void => {
    void refreshPosition()
  }

  onMounted(() => {
    void refreshPosition()
    window.addEventListener('resize', handleResize)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    panelStyle,
    refreshPosition,
  }
}
