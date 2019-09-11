<template>
  <div class="file-information" v-if="data">

    <!-- LINK -->
    <div class="row">
      <div class="col-sm-12 mb-2">

        <!-- REFERENCE -->
        <a v-if="reference && !data.is_private" class="no-underline" :href="'http://geocollections.info/reference/' + this.data.id" target="_blank">
          <b>{{ $t('edit.referenceLink') }}</b> &nbsp;<i class="fas fa-file"></i>
        </a>

        <!-- FILE -->
        <a v-else-if="!data.is_private" class="no-underline" :href="'http://geocollections.info/file/' + this.data.id" target="_blank">
          <b>{{ $t('edit.link') }}</b>
        </a>
      </div>
    </div>

    <!-- IMAGE NUMBER -->
    <div class="row" v-if="data.image_number && data.image_number !== null">
      <div class="col mb-2">
        {{ $t('edit.imageNumber') }}: <b>{{ data.image_number }}</b>
      </div>
    </div>

    <!-- FILENAME -->
    <div class="row" v-if="data.filename && data.filename !== null">
      <div class="col mb-2">
        {{ $t('edit.filename') }}: <b>{{ data.filename }}</b>
      </div>
    </div>

    <!-- ORIGINAL FILENAME -->
    <div class="row" v-if="data.original_filename && data.original_filename !== null">
      <div class="col mb-2">
        {{ $t('edit.original_filename') }}: <b>{{ data.original_filename }}</b>
      </div>
    </div>

    <!-- ATTACHMENT FORMAT VALUE -->
    <div class="row" v-if="data.attachment_format__value && data.attachment_format__value !== null">
      <div class="col mb-2">
        {{ $t('edit.attachment_format_value') }}: <b>{{ data.attachment_format__value }}</b>
      </div>
    </div>

    <!-- IMAGE WIDTH -->
    <div class="row" v-if="data.image_width && data.image_width !== null">
      <div class="col mb-2">
        {{ $t('edit.image_width') }}: <b>{{ data.image_width }}</b>
      </div>
    </div>

    <!-- IMAGE HEIGHT -->
    <div class="row" v-if="data.image_height && data.image_height !== null">
      <div class="col mb-2">
        {{ $t('edit.image_height') }}: <b>{{ data.image_height }}</b>
      </div>
    </div>

    <!-- DATE ADDED -->
    <div class="row" v-if="data.date_added && data.date_added !== null">
      <div class="col mb-2">
        {{ $t('edit.date_added') }}: <b>{{ new Date(data.date_added).toLocaleDateString() }}</b>
      </div>
    </div>

    <!-- USER ADDED -->
    <div class="row" v-if="data.user_added && data.user_added !== null">
      <div class="col mb-2">
        {{ $t('edit.user_added') }}: <b>{{ data.user_added }}</b>
      </div>
    </div>

    <!-- DATE CHANGED -->
    <div class="row" v-if="data.date_changed && data.date_changed !== null">
      <div class="col mb-2">
        {{ $t('edit.date_changed') }}: <b>{{ new Date(data.date_changed).toLocaleDateString() }}</b>
      </div>
    </div>

    <!-- USER CHANGED -->
    <div class="row" v-if="data.user_changed && data.user_changed !== null && data.user_changed">
      <div class="col mb-2">
        {{ $t('edit.user_changed') }}: <b>{{ data.user_changed }}</b>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    props: ['data', 'reference'],
    name: "FileInformation",
  }
</script>

<style scoped>
  .no-underline {
    text-decoration: none;
  }
</style>
