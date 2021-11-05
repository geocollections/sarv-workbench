class RWApiService {
  constructor({ axios, url }) {
    this.baseURL = url || process.env.VUE_APP_RWAPI_URL;
    this.service = axios.create({
      withCredentials: true,
      xsrfCookieName: "csrftoken",
      xsrfHeaderName: "X-CSRFToken",
    });
  }

  async getDetail(table, id) {
    const url = `${this.baseURL}/${table}/${id}/`;
    try {
      const res = await this.service.get(url);
      return res.data;
    } catch (err) {
      return err?.response?.data ?? `URL: '${url}' MESSAGE: ${err.message}`;
    }
  }

  static async post(table) {
    // Todo
  }

  static async put(table, id) {
    // Todo
  }

  // Works similarly to put + seems our backend (drf) doesn't have any differences between put and patch
  static async patch(table, id) {
    // Todo
  }

  static async delete(table, id) {
    // Todo
  }
}

export default RWApiService;
