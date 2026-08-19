<script setup lang="ts">
import type { TLanguageSwitcherInstance } from '~/components/header/LanguageSwitcher.vue'
import { nextTick } from 'vue'

import { a11yConfig, featureConfig } from '~/config/features'
import { searchSuggestions } from '~/config/search'
import { siteConfig } from '~/config/site'
import GlobalSearchPanel from '~/components/search/GlobalSearchPanel.vue'
//----------------------------
// navigation state
//----------------------------
const route = useRoute()
const { menuItems } = useMenu()
type TBreakpoint = 'sm' | 'md' | 'lg' | 'xl'

//----------------------------
// responsive navigation
//----------------------------
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
const isSearchOpen = ref(false)
const openDesktopMenuId = ref<string>()
const headerElement = useTemplateRef<HTMLElement>('headerElement')
const languageSwitcher = useTemplateRef<TLanguageSwitcherInstance>('languageSwitcher')
const searchTrigger = useTemplateRef<HTMLButtonElement>('searchTrigger')
const navHeightCssVariable = '--nav-h'
let resizeObserver: ResizeObserver | undefined
let appliedNavHeight: string | undefined
const breakpointShowClass = computed(() => breakpointShowClasses[changeBreakpoint.value])
const breakpointHideClass = computed(() => breakpointHideClasses[changeBreakpoint.value])

const homeData = computed(() => menuItems.value.find((item) => item.id === 'home'))
const pageData = computed(() => menuItems.value.filter((item) => item.id !== 'home'))
const searchQuery = computed(() => {
  const value = route.query.q

  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '')
})

//----------------------------
// menu interactions
//----------------------------
const closeSearch = (restoreFocus = true): void => {
  if (!isSearchOpen.value) {
    return
  }

  isSearchOpen.value = false

  if (restoreFocus) {
    void nextTick(() => searchTrigger.value?.focus())
  }
}

const closeLanguageSwitcher = (restoreFocus = false): void => {
  languageSwitcher.value?.close(restoreFocus)
}

const handleLanguageSwitcherOpen = (): void => {
  closeSearch(false)
  isMobileMenuOpen.value = false
  openDesktopMenuId.value = undefined
}

const toggleSearch = (): void => {
  if (isSearchOpen.value) {
    closeSearch()
    return
  }

  closeLanguageSwitcher()
  isMobileMenuOpen.value = false
  openDesktopMenuId.value = undefined
  isSearchOpen.value = true
}

const toggleMobileMenu = (): void => {
  if (isMobileMenuOpen.value) {
    isMobileMenuOpen.value = false
    return
  }

  closeLanguageSwitcher()
  closeSearch(false)
  openDesktopMenuId.value = undefined
  isMobileMenuOpen.value = true
}

const submitSearch = async (query: string): Promise<void> => {
  closeSearch(false)
  await navigateTo({
    path: '/search',
    query: { q: query },
  })
}

watch(
  () => route.fullPath,
  () => {
    isMobileMenuOpen.value = false
    openDesktopMenuId.value = undefined
    closeSearch(false)
    closeLanguageSwitcher()
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

//----------------------------
// nav height observer
//----------------------------
const updateNavHeight = (): void => {
  if (!import.meta.client || !headerElement.value) {
    return
  }

  const navHeight = `${headerElement.value.getBoundingClientRect().height}px`

  document.documentElement.style.setProperty(navHeightCssVariable, navHeight)
  appliedNavHeight = navHeight
}

//----------------------------
// lifecycle and cleanup
//----------------------------
onMounted(() => {
  updateNavHeight()

  if (typeof ResizeObserver !== 'undefined' && headerElement.value) {
    resizeObserver = new ResizeObserver(updateNavHeight)
    resizeObserver.observe(headerElement.value)
    return
  }

  window.addEventListener('resize', updateNavHeight, { passive: true })
})

onBeforeUnmount(() => {
  if (!import.meta.client) {
    return
  }

  resizeObserver?.disconnect()
  window.removeEventListener('resize', updateNavHeight)

  if (
    appliedNavHeight &&
    document.documentElement.style.getPropertyValue(navHeightCssVariable) === appliedNavHeight
  ) {
    document.documentElement.style.removeProperty(navHeightCssVariable)
  }
})
</script>

<template>
  <header
    id="U"
    ref="headerElement"
    role="banner"
    class="group sticky top-0 z-40 bg-white py-2 shadow-lg"
    :class="{ 'is-open': isMobileMenuOpen }"
  >
    <A11yAccessKeyLink
      v-if="a11yConfig.accessKeyLinks"
      id="AU"
      target="#U"
      accesskey="U"
      label-key="a11y.header"
    />
    <div class="container">
      <div class="flex items-center justify-between gap-2">
        <NuxtLink
          :to="homeData?.href || '/'"
          :aria-label="homeData?.title || $t('site.name')"
          class="shrink-0"
        >
          <img
            :src="siteConfig.logo || '/images/logo.png'"
            :alt="$t('header.home.logoAlt', { name: $t('site.name') })"
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
              <template v-if="item.children?.length">
                <div class="flex items-center hover:bg-slate-100">
                  <NuxtLink
                    v-if="item.href"
                    :to="item.href"
                    class="inline-flex items-center gap-2 px-4 py-2"
                  >
                    {{ item.title }}
                    <span
                      aria-hidden="true"
                      class="transition-transform duration-200"
                      :class="{ 'rotate-180': openDesktopMenuId === item.id }"
                    >
                      <IconChevronDown />
                    </span>
                  </NuxtLink>
                  <button
                    v-else
                    :id="`menu-trigger-${item.id}`"
                    type="button"
                    aria-haspopup="true"
                    :aria-expanded="openDesktopMenuId === item.id"
                    :aria-controls="`submenu-${item.id}`"
                    :aria-label="
                      item.href ? $t('header.menu.toggleSubmenu', { title: item.title }) : undefined
                    "
                    class="inline-flex items-center gap-2 py-2"
                    @click="openDesktopMenu(item.id, true)"
                  >
                    <span>{{ item.title }}</span>
                    <span
                      aria-hidden="true"
                      class="transition-transform duration-200"
                      :class="{ 'rotate-180': openDesktopMenuId === item.id }"
                    >
                      <IconChevronDown />
                    </span>
                  </button>
                </div>
              </template>
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
            <HeaderLanguageSwitcher
              v-if="featureConfig.languageSwitcher"
              ref="languageSwitcher"
              @open="handleLanguageSwitcherOpen"
            />

            <button
              v-if="featureConfig.search"
              ref="searchTrigger"
              type="button"
              aria-controls="global-search-panel"
              :aria-expanded="isSearchOpen"
              :aria-label="$t('header.search.ariaLabel')"
              class="relative rounded-sm hover:text-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
              @pointerdown.stop
              @click="toggleSearch"
            >
              <IconSearch />
            </button>

            <NuxtLink
              v-if="featureConfig.account"
              to="/account"
              :aria-label="$t('header.account.ariaLabel')"
              class="hover:text-slate-500"
            >
              <IconUser />
            </NuxtLink>

            <NuxtLink
              v-if="featureConfig.cart"
              to="/cart"
              :aria-label="$t('header.cart.ariaLabel')"
              class="relative hover:text-slate-500"
            >
              <IconCart />
              <span
                class="bg-primary-500 absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-xs text-white"
              >
                {{ 0 }}
              </span>
            </NuxtLink>
          </div>

          <button
            type="button"
            aria-controls="mobile-menu"
            :aria-expanded="isMobileMenuOpen"
            :aria-label="$t('header.hamburger.ariaLabel')"
            class="rounded-1 relative flex h-9.5 w-11 items-center justify-center"
            :class="breakpointHideClass"
            @click="toggleMobileMenu"
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

    <GlobalSearchPanel
      v-if="featureConfig.search"
      panel-id="global-search-panel"
      :open="isSearchOpen"
      :initial-query="searchQuery"
      :suggestions="searchSuggestions"
      @close="closeSearch"
      @submit="submitSearch"
    />
  </header>
</template>
