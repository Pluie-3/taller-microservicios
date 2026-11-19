const table = document.getElementById("vehiculos-table");
const formContent = document.getElementById("vehicle-form-content");
const registroBtn = document.getElementById("registro-btn");
const vehiculoForm = document.forms["vehiculo-form"];
const borrarModal = document.getElementById("borrar-modal");
let id_vehiculo = null; // vehiculo que se va a borrar
let id_editando = null; // vehiculo que se esta editando (null = registrando uno nuevo)

const consultarVehiculos = () => {
  queryVehicles({
    success: (data) => trs_vehicles(table, data),
    error: (message) => msg(true, message, true),
  });
};
consultarVehiculos();

// Abre el formulario: vacio (registrar) o con los datos del vehiculo (editar)
const abrirFormulario = (vehicle = null) => {
  id_editando = vehicle ? vehicle.id : null;
  document.getElementById("form-title").textContent = vehicle ? "Editar vehículo" : "Registrar vehículo";
  vehiculoForm["marca"].value = vehicle ? vehicle.marca : "";
  vehiculoForm["modelo"].value = vehicle ? vehicle.modelo : "";
  vehiculoForm["anio"].value = vehicle ? vehicle.anio : "";
  vehiculoForm["categoria"].value = vehicle ? vehicle.categoria : "Economico";

  // Regla de negocio: un vehiculo alquilado no cambia de estado a mano (se libera al devolverlo)
  const estados = vehicle && vehicle.estado === "alquilado" ? ["alquilado"] : ["disponible", "mantenimiento"];
  const estadoSelect = vehiculoForm["estado"];
  estadoSelect.textContent = "";
  estados.forEach((estado) => {
    const option = document.createElement("option");
    option.value = estado;
    option.textContent = estado;
    estadoSelect.appendChild(option);
  });
  estadoSelect.value = vehicle ? vehicle.estado : "disponible";
estadoSelect.disabled = Boolean(vehicle && vehicle.estado === "alquilado");

  formContent.classList.remove("close");
};

const editarVehiculo = (vehicle) => abrirFormulario(vehicle);

const borrarVehiculo = (id) => {
  id_vehiculo = id;
  borrarModal.classList.remove("close");
};

registroBtn.addEventListener("click", () => abrirFormulario());

vehiculoForm.addEventListener("reset", () => {
  formContent.classList.add("close");
});

vehiculoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = {
    marca: vehiculoForm["marca"].value,
    modelo: vehiculoForm["modelo"].value,
    anio: Number(vehiculoForm["anio"].value),
    categoria: vehiculoForm["categoria"].value,
    estado: vehiculoForm["estado"].value,
  };
  const callbacks = {
    success: () => {
      msg(true, id_editando ? "Vehículo actualizado" : "Vehículo registrado");
      consultarVehiculos();
      vehiculoForm.reset();
    },
    error: (message) => msg(true, message, true), // el formulario se queda abierto
  };
  if (id_editando) {
    updateVehicle(id_editando, data, callbacks);
  } else {
    saveNewVehicle(data, callbacks);
  }
});

document.getElementById("cancelar-modal-btn").addEventListener("click", () => {
  borrarModal.classList.add("close");
});

document.getElementById("borrar-modal-btn").addEventListener("click", () => {
  deleteVehicle(id_vehiculo, {
    success: () => {
      msg(true, "Vehículo eliminado");
      consultarVehiculos();
      borrarModal.classList.add("close");
    },
    error: (message) => {
      msg(true, message, true);
      borrarModal.classList.add("close");
    },
  });
});
