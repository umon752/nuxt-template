<script setup lang="ts">
const START_YEAR = 2026
const currentYear = new Date().getFullYear()
const copyrightYear = currentYear === START_YEAR ? `${currentYear}` : `${START_YEAR}–${currentYear}`
</script>

<template>
  <footer id="Z">
    <A11yAccessKeyLink id="AZ" target="#Z" accesskey="Z" label-key="a11y.footer" />
    <div class="container">
      <nav :aria-label="$t('footer.navigationAriaLabel')" class="mb-2">
        <ul class="flex flex-wrap gap-x-4 gap-y-2">
          <li>
            <NuxtLink to="/sitemap" class="hover:text-main-500">
              {{ $t('footer.sitemap') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/privacy" class="hover:text-main-500">
              {{ $t('footer.privacy') }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
      <p>
        <span>{{
          $t('footer.copyright', {
            year: copyrightYear,
            name: $t('site.name'),
          })
        }}</span>
      </p>
    </div>
  </footer>
</template>
