<template>
  <v-card
    :color="bodyColor.split('n-')[0] + 'n-5'"
    elevation="4"
    class="messages"
  >
    <v-card-title class="py-2">
      <div>
        <span> {{ $t("sarv_issue.activeIssues") }}: </span>
        <span class="font-weight-bold">{{ sarvIssues.count }}</span>
      </div>
      <v-spacer />
      <v-btn
        icon
        to="/sarv_issue"
        :title="$t('header.sarv_issues')"
        :color="bodyActiveColor"
      >
        <v-icon>far fa-envelope-open</v-icon>
      </v-btn>
    </v-card-title>

    <div class="mx-4 pb-4">
      <v-alert
        class="alert-box pa-2"
        v-for="entity in sarvIssues.results"
        :key="entity.id"
        border="left"
        type="error"
        text
        dense
      >
        <div
          class="d-flex flex-column small-custom"
          style="word-break: break-word;"
        >
          <div>
            <span class="font-weight-bold text-uppercase">{{
              entity.from_user__username
            }}</span
            >:
            <span>
              <router-link
                class="sarv-link font-weight-bold"
                :class="`${bodyActiveColor}--text`"
                :to="{ path: '/sarv_issue/' + entity.id }"
                :title="$t('editSarvIssue.editMessage')"
              >
                {{ entity.title }}
              </router-link>
            </span>
          </div>

          <div>
            <span class="font-weight-bold"
              >{{ $t("sarv_issue.description") }}:
            </span>
            <span>{{ entity.description }}</span>
          </div>

          <div v-if="entity.url">
            <span class="font-weight-bold">{{ $t("sarv_issue.url") }}: </span>
            <span>
              <a
                :href="entity.url"
                class="sarv-link font-weight-bold"
                :class="`${bodyActiveColor}--text`"
                :title="entity.url"
                target="ProblematicUrl"
                >{{ entity.url }}</a
              >
            </span>
          </div>

          <div class="text-right">
            {{ entity.date_added | moment("MMMM Do YYYY HH:mm") }}
          </div>

          <v-btn
            :to="{ path: '/sarv_issue/' + entity.id }"
            :title="$t('editSarvIssue.editMessage')"
            class="text-right"
            elevation="2"
            absolute
            x-small
            :color="bodyActiveColor"
            style="right: 8px;"
          >
            {{ $t("sarv_issue.answer") }}
            <v-icon x-small class="ml-1">fas fa-reply</v-icon>
          </v-btn>
        </div>
      </v-alert>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "Messages",
  props: {
    sarvIssues: {
      type: Object,
      required: true
    },
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4"
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange"
    }
  }
};
</script>

<style scoped>
.alert-box:last-child {
  margin-bottom: 0;
}

.sarv-link:hover {
  text-decoration: underline;
}

.small-custom {
  font-size: 12px;
}

.alert-box >>> .v-icon {
  font-size: 16px;
  margin-right: 4px;
}
</style>
