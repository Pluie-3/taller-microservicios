// Mensaje flotante (verde si salio bien, rojo si fue un error)
let msgTimer = null;
const msg = (show, text = "", isError = false) => {
  const content = document.getElementById("msg-content");
  if (show) {
    content.getElementsByTagName("p")[0].textContent = text;
    content.classList.toggle("error", isError);
    content.classList.remove("hidden");
    clearTimeout(msgTimer);
    msgTimer = setTimeout(() => msg(false), isError ? 5000 : 2500);
  } else {
    content.classList.add("hidden");
  }
};

const params = new URLSearchParams(window.location.search); // por ejemplo ?vehiculo_id=3
