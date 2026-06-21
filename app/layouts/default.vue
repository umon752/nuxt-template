<template>
  <div class="flex min-h-screen flex-col">
    <div class="shrink-0">
      <Header />
      <main>
        <slot />
      </main>
    </div>
    <div class="mt-auto">
      <Footer />
    </div>
  </div>
</template>
