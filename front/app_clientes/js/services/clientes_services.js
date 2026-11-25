// SERVICIOS: hablan con el microservicio de CLIENTES (puerto 8082)
const queryCustomers = (callbacks) => request(URL_CLIENTES, {}, callbacks);

const saveNewCustomer = (customer, callbacks) =>
  request(URL_CLIENTES, jsonOptions("POST", customer), callbacks);

const updateCustomer = (id, customer, callbacks) =>
  request(URL_CLIENTES + "/" + id, jsonOptions("PUT", customer), callbacks);

const deleteCustomer = (id, callbacks) =>
  request(URL_CLIENTES + "/" + id, { method: "DELETE" }, callbacks);
