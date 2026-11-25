const queryVehicles = (callbacks) => request(URL_VEHICULOS, {}, callbacks);
const queryCustomers = (callbacks) => request(URL_CLIENTES, {}, callbacks);

// tipo = "vehiculo" o "cliente" (son las dos rutas del microservicio de alquileres)
const queryHistory = (tipo, id, callbacks) => request(URL_ALQUILERES + "/" + tipo + "/" + id, {}, callbacks);
