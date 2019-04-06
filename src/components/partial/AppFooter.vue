<template>
  <!-- TODO: If edit or add then add margin bottom (54px) so buttons wouldn't cover the footer -->
  <div class="footer">

    <footer>
      <img src="https://geocollections.info/img/logos/sarv_logo_valge1.png" style="height: 60px; padding-bottom: 10px;" /><br />
      <a href="https://natarc.ut.ee" target="_blank" rel="noopener">NATARC</a> 2018-2019.
      {{ $t('footer.info') }},
      <a href="mailto:olle.hints@taltech.ee">olle.hints@taltech.ee</a>

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
