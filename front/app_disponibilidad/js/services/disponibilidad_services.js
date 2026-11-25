const queryAvailable = (date, callbacks) =>
  request("http://localhost:8003/disponibles?fecha=" + encodeURIComponent(date), {}, callbacks);