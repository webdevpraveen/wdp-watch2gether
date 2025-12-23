const socket = io(
  location.hostname === "localhost"
    ? "http://localhost:3000"
    : "YOUR_BACKEND_URL_HERE"
);
