const table = document.getElementById("alquileres-table");
const formContent = document.getElementById("rental-form-content");
const registroBtn = document.getElementById("registro-btn");
const alquilerForm = document.forms["alquiler-form"];
const confirmModal = document.getElementById("confirm-modal");
const devolverModal = document.getElementById("devolver-modal");
let accionPendiente = null;
let id_devolver = null;
let vehiculos = [];
let clientes = [];
let aperturaUrlProcesada = false;

const fallo = (message) => msg(true, message, true);

const consultarAlquileres = () => {
  queryVehicles({
    success: (v) => {
      vehiculos = v;
      queryCustomers({
        success: (c) => {
          clientes = c;
          if (!aperturaUrlProcesada && (params.get("vehiculo_id") || params.get("cliente_id"))) {
            aperturaUrlProcesada = true;
            abrirFormulario(params.get("vehiculo_id") || "", params.get("cliente_id") || "", params.get("fecha") || "");
          }
          queryRentals({
            success: (data) => trs_rentals(table, data, byId(vehiculos), byId(clientes)),
            error: fallo,
          });
        },
        error: fallo,
      });
    },
    error: fallo,
  });
};

const abrirFormulario = (vehiculo_id = "", cliente_id = "", fecha = "") => {
  fillSelect(
    alquilerForm["vehiculo_id"],
    vehiculos.filter((v) => v.estado !== "mantenimiento"),
    (v) => v.id,
    vehicleLabel,
    "-- elige un vehículo --"
  );
  fillSelect(
    alquilerForm["cliente_id"],
    clientes,
    (c) => c.id,
    (c) => c.nombre + " - " + c.numero_licencia,
    "-- elige un cliente --"
  );
  const inicio = fecha || today();
  alquilerForm["vehiculo_id"].value = vehiculo_id;
  alquilerForm["cliente_id"].value = cliente_id;
  alquilerForm["fecha_inicio"].value = inicio;
  alquilerForm["fecha_fin"].value = "";
  alquilerForm["fecha_inicio"].min = today();
  alquilerForm["fecha_fin"].min = inicio;
  formContent.classList.remove("close");
};

alquilerForm["fecha_inicio"].addEventListener("change", () => {
  const inicio = alquilerForm["fecha_inicio"].value || today();
  alquilerForm["fecha_fin"].min = inicio;
  if (alquilerForm["fecha_fin"].value && alquilerForm["fecha_fin"].value < inicio) {
    alquilerForm["fecha_fin"].value = inicio;
  }
});

const confirmar = (texto, accion) => {
  document.getElementById("confirm-text").textContent = texto;
  accionPendiente = accion;
  confirmModal.classList.remove("close");
};

const resultado = {
  success: (data) => {
    msg(true, (data && (data.mensaje || data.message)) || "Operación realizada");
    consultarAlquileres();
  },
  error: fallo,
};

const entregarAlquiler = (id) => confirmar("¿Entregar el vehículo al cliente?", () => startRental(id, resultado));
const cancelarAlquiler = (id) => confirmar("¿Cancelar esta reserva?", () => cancelRental(id, resultado));
const devolverAlquiler = (id) => {
  id_devolver = id;
  document.getElementById("devolucion-fecha").value = today();
  devolverModal.classList.remove("close");
};

registroBtn.addEventListener("click", () => abrirFormulario());

alquilerForm.addEventListener("reset", () => {
  formContent.classList.add("close");
});

alquilerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = {
    vehiculo_id: Number(alquilerForm["vehiculo_id"].value),
    cliente_id: Number(alquilerForm["cliente_id"].value),
    fecha_inicio: alquilerForm["fecha_inicio"].value,
    fecha_fin: alquilerForm["fecha_fin"].value,
  };
  if (data.fecha_fin < data.fecha_inicio) {
    fallo("La fecha de fin no puede ser anterior a la fecha de inicio");
    return;
  }
  saveNewRental(data, {
    success: (info) => {
      msg(true, (info && (info.mensaje || info.message)) || "Reserva creada");
      consultarAlquileres();
      alquilerForm.reset();
    },
    error: fallo,
  });
});

document.getElementById("cancelar-modal-btn").addEventListener("click", () => confirmModal.classList.add("close"));
document.getElementById("confirmar-modal-btn").addEventListener("click", () => {
  confirmModal.classList.add("close");
  if (accionPendiente) accionPendiente();
});

document.getElementById("cancelar-devolver-btn").addEventListener("click", () => devolverModal.classList.add("close"));
document.getElementById("confirmar-devolver-btn").addEventListener("click", () => {
  const fechaDevolucion = document.getElementById("devolucion-fecha").value;
  if (!fechaDevolucion) {
    fallo("Seleccione una fecha de devolución");
    return;
  }
  devolverModal.classList.add("close");
  returnRental(id_devolver, fechaDevolucion, resultado);
});

consultarAlquileres();