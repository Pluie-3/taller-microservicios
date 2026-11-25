const table = document.getElementById("historial-table");
const tipoSelect = document.getElementById("tipo");
const entidadSelect = document.getElementById("entidad");
let vehiculos = [];
let clientes = [];

const fallo = (message) => msg(true, message, true);

// Llena la segunda lista con vehiculos o clientes segun lo elegido en la primera
const llenarEntidades = (id = "") => {
  if (tipoSelect.value === "vehiculo") {
    fillSelect(entidadSelect, vehiculos, (v) => v.id, vehicleLabel, "-- elige un vehículo --");
  } else {
    fillSelect(entidadSelect, clientes, (c) => c.id, (c) => c.nombre, "-- elige un cliente --");
  }
  entidadSelect.value = id;
  document.getElementById("th-otro").textContent = tipoSelect.value === "vehiculo" ? "Cliente" : "Vehículo";
};

const consultarHistorial = () => {
  const tipo = tipoSelect.value;
  const id = entidadSelect.value;
  const tbody = table.getElementsByTagName("tbody")[0];
  if (!id) {
    tbody.textContent = "";
    document.getElementById("titulo-resultado").textContent = "";
    return;
  }
  queryHistory(tipo, id, {
    success: (data) => {
      document.getElementById("titulo-resultado").textContent = "Total de registros: " + data.length;
      trs_history(table, data, tipo, byId(vehiculos), byId(clientes));
    },
    error: fallo,
  });
};

tipoSelect.addEventListener("change", () => {
  llenarEntidades();
  consultarHistorial();
});
entidadSelect.addEventListener("change", consultarHistorial);

// Carga las dos listas (vehiculos 8081 y clientes 8082) y preselecciona lo que venga en la URL
queryVehicles({
  success: (v) => {
    vehiculos = v;
    queryCustomers({
      success: (c) => {
        clientes = c;
        tipoSelect.value = params.get("tipo") === "cliente" ? "cliente" : "vehiculo";
        llenarEntidades(params.get("id") || "");
        consultarHistorial();
      },
      error: fallo,
    });
  },
  error: fallo,
});
