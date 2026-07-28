<template>
  <div>
    <div class="flex min-h-screen flex-col">
      <div class="shrink-0">
        <A11ySkipLink />
        <Header />
        <main id="main-content" tabindex="-1">
          <A11yAccessKeyLink id="AC" target="#main-content" accesskey="C" label-key="a11y.main" />
          <slot />
        </main>
      </div>
      <div class="mt-auto">
        <Footer />
      </div>
    </div>
    <BtnGoTop />
  </div>
</template>
