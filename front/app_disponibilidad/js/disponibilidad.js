const table = document.getElementById("disponibles-table");
const fechaInput = document.getElementById("fecha");
fechaInput.value = params.get("fecha") || today();

const consultar = () => {
  const fecha = fechaInput.value;
  queryAvailable(fecha, {
    success: (data) => {
      document.getElementById("titulo-resultado").textContent = "Disponibles el " + fecha + " (" + data.length + ")";
      trs_available(table, data, fecha);
    },
    error: (message) => msg(true, message, true),
  });
};

document.getElementById("consultar-btn").addEventListener("click", consultar);
consultar();
