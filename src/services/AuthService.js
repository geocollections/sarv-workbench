class AuthService {
  constructor({ axios, url }) {
    // this.csrftoken = getCookie('csrftoken')
    this.baseURL = url || process.env.VUE_APP_AUTH_URL;
    this.service = axios.create({
      withCredentials: true,
      // headers: { "X-CSRFToken": 'bWQHFsONDUaTVgmPqBGmyqWoR6bvC6Fnobrqc2Tk4F7ZHkg10VDqilLbXjzszZqH' },
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
    // const url = `${this.baseURL}/idcard/`;
    const url = `https://idcard.geoloogia.info/?redirect_uri=${location.origin}/accounts/idcard/`;
    // const url = `https://idcard.geoloogia.info/accounts/idcard/?format=json`;
    // const url = `http://localhost:7000/accounts/idcard/`;
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

  async isLoggedIn() {
    const url = `${this.baseURL}/is_logged_in/`;
    try {
      const res = await this.service.get(url);
      return res.data?.detail ?? false;
    } catch (err) {
      console.error(
        err?.response?.data ?? `URL: '${url}' MESSAGE: ${err.message}`
      );
      return false;
    }
  }

  async accountStatus() {
    const url = `${this.baseURL}/status/`;
    try {
      const res = await this.service.get(url);
      return res.data;
    } catch (err) {
      // console.error(
      //   err?.response?.data ?? `URL: '${url}' MESSAGE: ${err.message}`
      // );
      return false;
    }
  }
}

export default AuthService;

function getCookie(name) {
  let cookieValue = null;

  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();

      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));

        break;
      }
    }
  }

  return cookieValue;
}
