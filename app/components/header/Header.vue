<script setup lang="ts">
import { siteConfig } from '~/config/site'

const { t } = useI18n()
const route = useRoute()
const { menuItems } = useMenu()
const changeBreakpoint = ref('md')
const isMobileMenuOpen = ref(false)
const breakpointShowClass = computed(
  () =>
    (({ sm: 'sm:flex', md: 'md:flex', lg: 'lg:flex', xl: 'xl:flex' }) as Record<string, string>)[
      changeBreakpoint.value
    ] ?? 'md:flex'
)
const breakpointHideClass = computed(
  () =>
    (
      ({ sm: 'sm:hidden', md: 'md:hidden', lg: 'lg:hidden', xl: 'xl:hidden' }) as Record<
        string,
        string
      >
    )[changeBreakpoint.value] ?? 'md:hidden'
)

const homeData = computed(() => menuItems.value.find((item) => item.id === 'home'))
const pageData = computed(() => menuItems.value.filter((item) => item.id !== 'home'))

watch(
  () => route.fullPath,
  () => {
    isMobileMenuOpen.value = false
  }
)
</script>

<template>
  <header
    role="banner"
    class="group sticky top-0 z-40 bg-white py-2 shadow-lg"
    :class="{ 'is-open': isMobileMenuOpen }"
  >
    <div class="container">
      <div class="flex items-center justify-between gap-2">
        <NuxtLink
          :to="homeData?.href || '/'"
          :aria-label="`${homeData?.title || t('site.name')}`"
          class="shrink-0"
        >
          <img
            :src="siteConfig.logo || '/images/logo.png'"
            :alt="`${t('site.name')} logo`"
            class="h-12 w-auto"
          />
        </NuxtLink>

        <nav
          class="hidden items-center md:flex"
          :class="breakpointShowClass"
          :aria-label="`${t('header.menu.ariaLabel')}`"
        >
          <ul class="flex items-center">
            <li v-for="item in pageData" :key="item.id" class="group/menu relative">
              <NuxtLink v-if="item.href" :to="item.href" class="px-4 py-2 hover:bg-gray-200">{{
                item.title
              }}</NuxtLink>
              <button v-else type="button" class="cursor-auto px-4 py-2">
                {{ item.title }}
              </button>
              <HeaderDesktopSingleDropdownMenu v-if="item.children?.length" :item="item" />
            </li>
          </ul>
        </nav>

        <div class="flex items-center gap-2">
          <div class="flex items-center gap-2">
            <NuxtLink to="/account" :aria-label="`${t('site.header.account.ariaLabel')}`">
              <IconUser />
            </NuxtLink>

            <NuxtLink
              to="/cart"
              :aria-label="`${t('site.header.cart.ariaLabel')}`"
              class="relative"
            >
              <IconCart />
              <span
                class="bg-main-500 absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-xs text-white"
              >
                {{ 0 }}
              </span>
            </NuxtLink>

            <NuxtLink
              to="/search"
              :aria-label="`${t('site.header.search.ariaLabel')}`"
              class="relative"
            >
              <IconSearch />
            </NuxtLink>
          </div>

          <button
            type="button"
            aria-controls="mobile-menu"
            :aria-expanded="isMobileMenuOpen"
            :aria-label="`${t('site.header.hamburger.ariaLabel')}`"
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
      :class="`${changeBreakpoint}:hidden`"
      :aria-label="`${t('site.header.menu.ariaLabel')}`"
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
