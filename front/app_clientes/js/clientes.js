const table = document.getElementById("clientes-table");
const formContent = document.getElementById("customer-form-content");
const registroBtn = document.getElementById("registro-btn");
const clienteForm = document.forms["cliente-form"];
const borrarModal = document.getElementById("borrar-modal");
let id_cliente = null;
let id_editando = null;

const consultarClientes = () => {
  queryCustomers({
    success: (data) => trs_customers(table, data),
    error: (message) => msg(true, message, true),
  });
};
consultarClientes();

const abrirFormulario = (customer = null) => {
  id_editando = customer ? customer.id : null;
  document.getElementById("form-title").textContent = customer ? "Editar cliente" : "Registrar cliente";
  clienteForm["nombre"].value = customer ? customer.nombre : "";
  clienteForm["licencia"].value = customer ? customer.numero_licencia : "";
  clienteForm["telefono"].value = customer ? customer.telefono : "";
  clienteForm["email"].value = customer ? customer.email : "";
  formContent.classList.remove("close");
};

const editarCliente = (customer) => abrirFormulario(customer);

const borrarCliente = (id) => {
  id_cliente = id;
  borrarModal.classList.remove("close");
};

registroBtn.addEventListener("click", () => abrirFormulario());

clienteForm.addEventListener("reset", () => {
  formContent.classList.add("close");
});

clienteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = {
    nombre: clienteForm["nombre"].value,
    numero_licencia: clienteForm["licencia"].value,
    telefono: clienteForm["telefono"].value,
    email: clienteForm["email"].value,
  };
  const callbacks = {
    success: () => {
      msg(true, id_editando ? "Cliente actualizado" : "Cliente registrado");
      consultarClientes();
      clienteForm.reset();
    },
    error: (message) => msg(true, message, true),
  };
  if (id_editando) {
    updateCustomer(id_editando, data, callbacks);
  } else {
    saveNewCustomer(data, callbacks);
  }
});

document.getElementById("cancelar-modal-btn").addEventListener("click", () => {
  borrarModal.classList.add("close");
});

document.getElementById("borrar-modal-btn").addEventListener("click", () => {
  deleteCustomer(id_cliente, {
    success: () => {
      msg(true, "Cliente eliminado");
      consultarClientes();
      borrarModal.classList.add("close");
    },
    error: (message) => {
      msg(true, message, true);
      borrarModal.classList.add("close");
    },
  });
});
