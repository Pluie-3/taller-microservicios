const trs_customers = (table, data) => {
  const tbody = table.getElementsByTagName("tbody")[0];
  tbody.textContent = "";
  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6">No hay datos registrados...</td></tr>';
    return;
  }
  data.forEach((item, index) => {
    const tdBotones = td("");
    tdBotones.appendChild(button("Editar", () => editarCliente(item)));
    tdBotones.appendChild(button("Borrar", () => borrarCliente(item.id)));
    tdBotones.appendChild(link("Reservar", "../app_alquileres/index.html?cliente_id=" + item.id));
    tdBotones.appendChild(link("Historial", "../app_historial/index.html?tipo=cliente&id=" + item.id));

    const tr = document.createElement("tr");
    tr.appendChild(td(index + 1));
    tr.appendChild(td(item.nombre));
    tr.appendChild(td(item.telefono));
    tr.appendChild(td(item.email));
    tr.appendChild(td(item.numero_licencia));
    tr.appendChild(tdBotones);
    tbody.appendChild(tr);
  });
};
