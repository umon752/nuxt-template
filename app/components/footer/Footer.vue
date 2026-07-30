<script setup lang="ts">
const START_YEAR = 2026
const currentYear = new Date().getFullYear()
const copyrightYear = currentYear === START_YEAR ? `${currentYear}` : `${START_YEAR}–${currentYear}`
</script>

<template>
  <footer id="Z">
    <A11yAccessKeyLink id="AZ" target="#Z" accesskey="Z" label-key="a11y.footer" />
    <div class="container">
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
