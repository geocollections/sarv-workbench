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
  watch: {
    shouldRender(newVal) {
      console.log("shouldRender: ", newVal);
    },
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

<style scoped>
.lazy-component--loaded {
  /* The element itself does not generate any boxes, but its children and pseudo-elements still generate boxes and text sequences as normal. */
  /* https://www.w3.org/TR/css-display-3/#valdef-display-contents */
  display: contents;
}
</style>
