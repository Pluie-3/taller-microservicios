// SERVICIOS: hablan con el microservicio de VEHICULOS (puerto 8081)
const queryVehicles = (callbacks) => request(URL_VEHICULOS, {}, callbacks);

const saveNewVehicle = (vehicle, callbacks) =>
  request(URL_VEHICULOS, jsonOptions("POST", vehicle), callbacks);

const updateVehicle = (id, vehicle, callbacks) =>
  request(URL_VEHICULOS + "/" + id, jsonOptions("PUT", vehicle), callbacks);

const deleteVehicle = (id, callbacks) =>
  request(URL_VEHICULOS + "/" + id, { method: "DELETE" }, callbacks);
