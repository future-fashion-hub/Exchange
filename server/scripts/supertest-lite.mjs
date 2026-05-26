import { createServer } from "node:http";

class TestRequest {
  constructor(app, method, url) {
    this.app = app;
    this.method = method;
    this.url = url;
    this.headers = {};
    this.payload = undefined;
  }

  set(nameOrObject, value) {
    if (typeof nameOrObject === "string") {
      this.headers[nameOrObject] = value;
      return this;
    }

    if (nameOrObject && typeof nameOrObject === "object") {
      Object.entries(nameOrObject).forEach(([key, val]) => {
        this.headers[key] = val;
      });
    }

    return this;
  }

  async send(body) {
    this.payload = body;
    return this.execute();
  }

  then(onFulfilled, onRejected) {
    return this.execute().then(onFulfilled, onRejected);
  }

  catch(onRejected) {
    return this.execute().catch(onRejected);
  }

  finally(onFinally) {
    return this.execute().finally(onFinally);
  }

  async execute() {
    const server = createServer(this.app);

    try {
      await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      const target = `http://127.0.0.1:${port}${this.url}`;

      const headers = { ...this.headers };
      let body = undefined;
      if (this.payload !== undefined) {
        body = JSON.stringify(this.payload);
        if (!headers["Content-Type"] && !headers["content-type"]) {
          headers["Content-Type"] = "application/json";
        }
      }

      const response = await fetch(target, {
        method: this.method,
        headers,
        body,
      });

      const text = await response.text();
      let parsed = text;
      if (text) {
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = text;
        }
      }

      return {
        status: response.status,
        body: parsed,
        text,
        headers: Object.fromEntries(response.headers.entries()),
      };
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  }
}

const request = (app) => ({
  get: (url) => new TestRequest(app, "GET", url),
  post: (url) => new TestRequest(app, "POST", url),
  patch: (url) => new TestRequest(app, "PATCH", url),
  put: (url) => new TestRequest(app, "PUT", url),
  delete: (url) => new TestRequest(app, "DELETE", url),
});

export default request;
