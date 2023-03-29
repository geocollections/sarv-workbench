// Service worker that adds Authorization header to file requests
self.addEventListener("install", function (event) {
  // simultaneously only one sw can be active
  // the new sw replaces the old one once it has no clients
  // this period is also known as the waiting phase

  // we want to skip it and be active immediately
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  // page gets controlled when a request for it
  // was executed through a service worker
  // but we can always request control over uncontrolled clients
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(getResponse(event.request));
});

async function getResponse(request) {
  if (request.url.startsWith("https://files-new.geocollections.info/private")) {
    const token = await getAuthTokenHeader();
    const headers = new Headers(Array.from(request.headers.entries()));
    headers.append("Authorization", `Token ${token}`);
    const newRequest = new Request(request, {
      mode: "cors",
      headers,
    });
    return fetch(newRequest);
  }
  return fetch(request);
}

const getAuthTokenHeader = async () => {
  // we can't get a client that sent the current request, therefore we need
  // to ask any controlled page for auth token
  const allClients = await self.clients.matchAll();
  const client = allClients.filter((client) => client.type === "window")[0];

  // if there is no page in scope, we can't get any token
  // and we indicate it with null value
  if (!client) {
    return null;
  }

  // to communicate with a page we will use MessageChannels
  // they expose pipe-like interface, where a receiver of
  // a message uses one end of a port for messaging and
  // we use the other end for listening
  const channel = new MessageChannel();

  console.debug("Requesting auth token header from app");
  client.postMessage(
    {
      action: "getAuthTokenHeader",
    },
    [channel.port1]
  );

  // ports support only onmessage callback which
  // is cumbersome to use, so we wrap it with Promise
  return new Promise((resolve, reject) => {
    channel.port2.onmessage = (event) => {
      if (event.data.error) {
        console.error("Port error", event.error);
        reject(event.data.error);
      }

      resolve(event.data.authHeader);
    };
  });
};
