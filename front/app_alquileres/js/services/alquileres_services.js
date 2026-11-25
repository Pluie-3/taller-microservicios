// SERVICIOS: este frontend habla con LOS TRES microservicios.
//   alquileres (8083): reservas, entregar, devolver, cancelar
//   vehiculos  (8081) y clientes (8082): solo para llenar las listas y mostrar nombres
const queryRentals = (callbacks) => request(URL_ALQUILERES, {}, callbacks);
const queryVehicles = (callbacks) => request(URL_VEHICULOS, {}, callbacks);
const queryCustomers = (callbacks) => request(URL_CLIENTES, {}, callbacks);

const saveNewRental = (rental, callbacks) =>
  request(URL_ALQUILERES, jsonOptions("POST", rental), callbacks);

const startRental = (id, callbacks) =>
  request(URL_ALQUILERES + "/" + id + "/entregar", jsonOptions("PUT", {}), callbacks);

const returnRental = (id, return_date, callbacks) =>
  request(URL_ALQUILERES + "/" + id + "/devolver", jsonOptions("PUT", { fecha_devolucion: return_date }), callbacks);

const cancelRental = (id, callbacks) =>
  request(URL_ALQUILERES + "/" + id + "/cancelar", jsonOptions("PUT", {}), callbacks);
