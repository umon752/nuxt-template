<script setup lang="ts">
import { siteConfig } from '~/config/site'
const route = useRoute()
const { menuItems } = useMenu()
type TBreakpoint = 'sm' | 'md' | 'lg' | 'xl'

const breakpointShowClasses: Record<TBreakpoint, string> = {
  sm: 'sm:flex',
  md: 'md:flex',
  lg: 'lg:flex',
  xl: 'xl:flex',
}
const breakpointHideClasses: Record<TBreakpoint, string> = {
  sm: 'sm:hidden',
  md: 'md:hidden',
  lg: 'lg:hidden',
  xl: 'xl:hidden',
}

const changeBreakpoint = ref<TBreakpoint>('md')
const isMobileMenuOpen = ref(false)
const openDesktopMenuId = ref<string>()
const breakpointShowClass = computed(() => breakpointShowClasses[changeBreakpoint.value])
const breakpointHideClass = computed(() => breakpointHideClasses[changeBreakpoint.value])

const homeData = computed(() => menuItems.value.find((item) => item.id === 'home'))
const pageData = computed(() => menuItems.value.filter((item) => item.id !== 'home'))

watch(
  () => route.fullPath,
  () => {
    isMobileMenuOpen.value = false
    openDesktopMenuId.value = undefined
  }
)

const openDesktopMenu = (itemId: string, hasChildren: boolean): void => {
  openDesktopMenuId.value = hasChildren ? itemId : undefined
}

const closeDesktopMenu = (): void => {
  openDesktopMenuId.value = undefined
}

const handleDesktopMenuFocusout = (event: FocusEvent): void => {
  const currentTarget = event.currentTarget
  const relatedTarget = event.relatedTarget

  if (
    currentTarget instanceof HTMLElement &&
    relatedTarget instanceof Node &&
    currentTarget.contains(relatedTarget)
  ) {
    return
  }

  closeDesktopMenu()
}
</script>

<template>
  <header
    id="U"
    role="banner"
    class="group sticky top-0 z-40 bg-white py-2 shadow-lg"
    :class="{ 'is-open': isMobileMenuOpen }"
  >
    <A11yAccessKeyLink id="AU" target="#U" accesskey="U" label-key="a11y.header" />
    <div class="container">
      <div class="flex items-center justify-between gap-2">
        <NuxtLink
          :to="homeData?.href || '/'"
          :aria-label="homeData?.title || $t('site.name')"
          class="shrink-0"
        >
          <img
            :src="siteConfig.logo || '/images/logo.png'"
            :alt="`${$t('site.name')} logo`"
            class="h-12 w-auto rounded-md"
          />
        </NuxtLink>

        <nav
          class="hidden items-center md:flex"
          :class="breakpointShowClass"
          :aria-label="$t('header.menu.ariaLabel')"
        >
          <ul class="flex items-center">
            <li
              v-for="item in pageData"
              :key="item.id"
              class="group/menu relative"
              @mouseenter="openDesktopMenu(item.id, Boolean(item.children?.length))"
              @mouseleave="closeDesktopMenu"
              @focusin="openDesktopMenu(item.id, Boolean(item.children?.length))"
              @focusout="handleDesktopMenuFocusout"
            >
              <button
                v-if="item.children?.length"
                :id="`menu-trigger-${item.id}`"
                type="button"
                class="inline-flex items-center gap-2 px-4 py-2 hover:bg-slate-100"
                aria-haspopup="true"
                :aria-expanded="openDesktopMenuId === item.id"
                :aria-controls="`submenu-${item.id}`"
              >
                {{ item.title }}
                <span
                  aria-hidden="true"
                  class="transition-transform duration-200"
                  :class="{ 'rotate-180': openDesktopMenuId === item.id }"
                >
                  <IconArrowDown />
                </span>
              </button>
              <NuxtLink v-else-if="item.href" :to="item.href" class="px-4 py-2 hover:bg-slate-100">
                {{ item.title }}
              </NuxtLink>
              <span v-else class="px-4 py-2 text-gray-600">{{ item.title }}</span>
              <HeaderDesktopSingleDropdownMenu
                v-if="item.children?.length"
                :item="item"
                :panel-id="`submenu-${item.id}`"
                :open="openDesktopMenuId === item.id"
                @close="closeDesktopMenu"
              />
            </li>
          </ul>
        </nav>

        <div class="flex items-center gap-2">
          <div class="flex items-center gap-2">
            <NuxtLink to="/account" :aria-label="$t('header.account.ariaLabel')">
              <IconUser />
            </NuxtLink>

            <NuxtLink to="/cart" :aria-label="$t('header.cart.ariaLabel')" class="relative">
              <IconCart />
              <span
                class="bg-main-500 absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-xs text-white"
              >
                {{ 0 }}
              </span>
            </NuxtLink>

            <NuxtLink to="/search" :aria-label="$t('header.search.ariaLabel')" class="relative">
              <IconSearch />
            </NuxtLink>
          </div>

          <button
            type="button"
            aria-controls="mobile-menu"
            :aria-expanded="isMobileMenuOpen"
            :aria-label="$t('header.hamburger.ariaLabel')"
            class="rounded-1 relative flex h-9.5 w-11 items-center justify-center"
            :class="breakpointHideClass"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <span
              aria-hidden="true"
              class="left-50% absolute top-2.5 h-0.5 w-6 bg-black duration-300 group-[.is-open]:top-4.5 group-[.is-open]:rotate-45"
            />
            <span
              aria-hidden="true"
              class="h-0.5 w-6 bg-black duration-300 group-[.is-open]:hidden"
            />
            <span
              aria-hidden="true"
              class="left-50% absolute bottom-2.5 h-0.5 w-6 bg-black duration-300 group-[.is-open]:bottom-4.5 group-[.is-open]:-rotate-45"
            />
          </button>
        </div>
      </div>
    </div>

    <nav
      v-show="isMobileMenuOpen"
      id="mobile-menu"
      :class="breakpointHideClass"
      :aria-label="$t('header.menu.ariaLabel')"
      class="pointer-events-none absolute top-full left-0 h-[calc(100vh-100%)] w-full bg-white opacity-0 duration-300 group-[.is-open]:pointer-events-auto group-[.is-open]:opacity-100"
    >
      <ul class="container flex h-full flex-col justify-start overflow-auto py-5">
        <li v-for="item in pageData" :key="item.id">
          <HeaderMobileMenuList :items="[item]" />
        </li>
      </ul>
    </nav>
  </header>
</template>
