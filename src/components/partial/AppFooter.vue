<template>
  <div class="footer">

    <footer>
      {{ $t('footer.info') }},
      <a href="https://ttu.ee/geoloogia-instituut" target="_blank" rel="noopener">{{ $t('footer.ttuLink') }}</a>,
      <a href="mailto:olle.hints@ttu.ee">olle.hints@ttu.ee</a>
    </footer>

  </div>
</template>

<script>
  export default {
    name: "app-footer"
  }
</script>

<style scoped>
  footer {
    background-color: #f8f9fa !important;
    padding: 8px 16px;
    font-size: 0.75rem;
    text-align: center;
  }
</style>
