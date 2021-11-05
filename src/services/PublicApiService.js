class PublicApiService {
  constructor({ axios, url }) {
    this.baseURL = url || process.env.VUE_APP_PUBLIC_API_URL;
    this.service = axios.create({});
  }
  async getDetail(table, id) {
    const url = `${this.baseURL}/${table}/${id}`;
    try {
      const res = await this.service.get(url);
      return res.data;
    } catch (err) {
      return err?.response?.data ?? `URL: '${url}' MESSAGE: ${err.message}`;
    }
  }
}

export default PublicApiService;
