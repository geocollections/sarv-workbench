import axios from "axios";
const attachmentUrl = {
  install(Vue, options) {
    Vue.prototype.$urlClicked = function (
      url,
      target = "",
      windowFeatures = ""
    ) {
      this.$getAttachmentUrl(url).then((url) => {
        window.open(url, target, windowFeatures);
      });
    };
    Vue.prototype.$getAttachmentUrl = async function getAttachmentUrl(
      attachment
    ) {
      const token = await axios.get(
        `https://files-new.geocollections.info/token/${attachment}`,
        {
          headers: {
            Authorization: `Token ${this.$store.state.user.authUser.token}`,
          },
        }
      );
      return `https://files-new.geocollections.info/download/${token.data}`;
    };
  },
};

export default attachmentUrl;
