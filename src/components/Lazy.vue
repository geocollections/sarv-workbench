<template>
  <div
    ref="lazy"
    class="lazy-component"
    :class="{ 'lazy-component--loaded': shouldRender }"
  >
    <slot v-if="shouldRender"></slot>
  </div>
</template>

<script>
export default {
  name: "Lazy",
  data() {
    return {
      shouldRender: false,
      observer: null,
    };
  },
  mounted() {
    // const defaultLazyThreshold =
    //   Math.floor(Math.max(window.innerHeight, 700)) || 1000;
    const defaultLazyThreshold = 0;

    const observerOptions = {
      rootMargin: `${defaultLazyThreshold}px`,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          this.shouldRender = true;
          this.observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    if (this.$refs.lazy) {
      this.observer.observe(this.$refs.lazy);
    }
  },
};
</script>

<style scoped></style>
