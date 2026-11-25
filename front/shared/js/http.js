// request: hace fetch(), convierte la respuesta a JSON y avisa con callbacks
//   callbacks.success(datos)  -> la respuesta fue exitosa (codigos 200 a 299)
//   callbacks.error(mensaje)  -> hubo un error; el mensaje viene del microservicio ({ "error": "..." })
const request = async (url, options, callbacks) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => null);
    if (response.ok) {
      callbacks.success(data);
    } else {
      callbacks.error((data && (data.error || data.message)) || "Error " + response.status);
    }
  } catch (exception) {
    console.error(exception);
    callbacks.error("No se pudo conectar con el microservicio. ¿Está encendido?");
  }
};

// Arma las opciones de fetch para enviar un cuerpo JSON (POST o PUT)
const jsonOptions = (method, body) => ({
  method: method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body ?? {}),
});
