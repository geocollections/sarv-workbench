import { mapActions, mapState } from "vuex";
import toastMixin from "@/mixins/toastMixin";

const activeListMixin = {
  mixins: [toastMixin],

  computed: {
    ...mapState("search", [
      "activeSelectionSeries",
      "activeLibrary",
      "activeList",
      "selectedList",
    ]),
  },

  methods: {
    ...mapActions("search", ["getActiveList"]),

    async itemSelected(payload) {
      if (payload?.item?.id) {
        const table =
          payload.module === "reference" ? "library_reference" : "selection";
        const connectionField =
          payload.module === "reference" ? "library" : "selection";
        const activeObject =
          payload.module === "reference"
            ? this.activeLibrary
            : this.activeSelectionSeries;

        if (payload.value) {
          // CREATE
          let formData = new FormData();
          formData.set([payload.module], payload.item.id);
          formData.set(connectionField, activeObject.id);

          await this.$api.rw.post(table, formData);
        } else {
          // DELETE
          const itemFromActiveList = this.activeList.find(
            (item) => item?.[payload.module]?.id === payload.item.id
          );
          if (itemFromActiveList?.id)
            await this.$api.rw.delete(table, itemFromActiveList.id);
        }

        await this.getActiveList({
          table,
          connectionField,
          id: activeObject.id,
          module: payload.module,
        });
      }
    },

    async toggleSelectAll(payload) {
      const table =
        payload.module === "reference" ? "library_reference" : "selection";
      const connectionField =
        payload.module === "reference" ? "library" : "selection";
      const activeObject =
        payload.module === "reference"
          ? this.activeLibrary
          : this.activeSelectionSeries;

      if (payload.value) {
        // CREATE
        const activeIds = this.activeList.map(
          (item) => item[payload.module].id
        );

        const uploadableObjectList = payload.items.reduce((prev, curr) => {
          if (!activeIds.includes(curr.id)) {
            prev.push({
              [connectionField]: activeObject.id,
              [payload.module]: curr.id,
            });
          }
          return prev;
        }, []);

        if (uploadableObjectList?.length > 0)
          await this.$api.rw.post(table, uploadableObjectList);
      } else {
        // DELETE
        let deletableObjectList = [];

        payload.items.forEach((deletableItem) => {
          const id = this.activeList.find(
            (item) => item[payload.module].id === deletableItem.id
          )?.id;
          if (id) deletableObjectList.push({ id });
        });

        if (deletableObjectList.length > 0) {
          await this.$api.rw.deleteMulti(table, deletableObjectList);
        }
      }

      await this.getActiveList({
        table,
        connectionField,
        id: activeObject.id,
        module: payload.module,
      });
    },
  },
};

export default activeListMixin;
