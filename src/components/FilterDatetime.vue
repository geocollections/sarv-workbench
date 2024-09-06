<template>
  <v-menu bottom offset-y :close-on-content-click="false">
    <template #activator="{ on, attrs }">
      <div
        v-bind="attrs"
        v-on="on"
        style="
          min-height: 40px;
          max-width: 16em;
          min-width: 10em;
          border: 1px solid grey;
        "
        class="pa-1 rounded d-flex align-center"
      >
        <div>
          {{ selectedDateTime }}
        </div>
      </div>
    </template>
    <v-card>
      <v-tabs fixed-tabs v-model="activeTab">
        <v-tab key="date">
          <v-icon>fas fa-calendar</v-icon>
        </v-tab>
        <v-tab key="time">
          <v-icon>fas fa-clock</v-icon>
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="activeTab">
        <v-tab-item key="date">
          <v-date-picker
            class="rounded-0"
            :value="date"
            @input="handleDateInput"
          >
          </v-date-picker>
        </v-tab-item>
        <v-tab-item key="time">
          <v-time-picker
            class="rounded-0"
            format="24hr"
            :value="time"
            @input="handleTimeInput"
          >
          </v-time-picker>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-menu>
</template>
<script>
const DATE_FORMAT = "yyyy-MM-dd";
const TIME_FORMAT = "HH:mm:ss";

export default {
  name: "FilterDatetime",
  data() {
    return {
      date: null,
      time: "00:00",
      activeTab: "date",
    };
  },
  computed: {
    selectedDateTime() {
      if (!this.date) {
        return "-";
      }
      return `${this.date} ${this.time}`;
    },
  },
  watch: {
    datetime: {
      handler(value) {
        if (!new Date(value).toISOString() === value) return;

        const date = value.split("T")[0];
        const time = value.split("T")[1];
        time.shift();

        this.date = date;
        this.time = time.slice(0, 5);
      },
    },
  },
  methods: {
    handleDateInput(newDate) {
      this.date = newDate;
      this.emitValue();
    },
    handleTimeInput(newTime) {
      this.time = newTime;
      this.emitValue();
    },
    emitValue() {
      const datetime = new Date(`${this.date} ${this.time}`);
      this.$emit("input", datetime.toISOString());
    },
  },
};
</script>
