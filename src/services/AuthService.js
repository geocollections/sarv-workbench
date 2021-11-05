class AuthService {
  constructor({ axios, url }) {
    this.baseURL = url || process.env.VUE_APP_AUTH_URL;
    this.service = axios.create({
      withCredentials: true,
      xsrfCookieName: "csrftoken",
      xsrfHeaderName: "X-CSRFToken",
    });
  }

  async login(formData) {
    const url = `${this.baseURL}/login/`;
    try {
      const res = await this.service({
        method: "post",
        url: url,
        data: formData,
      });
      if (
        res.headers["content-type"].includes("text/html") &&
        res.request.responseURL.endsWith("login/") &&
        res.data.startsWith("<!DOCTYPE html>")
      ) {
        let error = new Error();
        error = {
          ...error,
          response: {
            data: {
              detail: "Login failed! Wrong username or password.",
            },
          },
          message: "Login failed! Wrong username or password.",
        };
        // noinspection ExceptionCaughtLocallyJS
        throw error;
      } else return res.data;
    } catch (err) {
      console.error(err);
      return err?.response?.data ?? `URL: '${url}' MESSAGE: ${err.message}`;
    }
  }

  async loginIDCard() {
    const url = `${this.baseURL}/idcard/`;
    try {
      const res = await this.service.get(url);
      return res.data;
    } catch (err) {
      console.error(err);
      return err?.response?.data ?? `URL: '${url}' MESSAGE: ${err.message}`;
    }
  }

  async loginSocial(provider) {
    // Todo: Review how to implement correctly
    const url = `${this.baseURL}/${provider}/login/`;
    window.open(url, `${provider}Window`);
    // try {
    //   const res = await this.service.get(url);
    //   return res.data;
    // } catch (err) {
    //   console.error(err);
    //   return err?.response?.data ?? `URL: '${url}' MESSAGE: ${err.message}`;
    // }
  }

  async logout() {
    const url = `${this.baseURL}/logout/`;
    try {
      const res = await this.service({
        method: "post",
        url: url,
      });
      return res.data;
    } catch (err) {
      return err?.response?.data ?? `URL: '${url}' MESSAGE: ${err.message}`;
    }
  }
}

export default AuthService;
