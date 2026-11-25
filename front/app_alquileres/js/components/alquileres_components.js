// El microservicio de alquileres solo devuelve ids: los nombres se buscan en los mapas de vehiculos y clientes
const trs_rentals = (table, data, vehicles, customers) => {
  const tbody = table.getElementsByTagName("tbody")[0];
  tbody.textContent = "";
  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8">No hay datos registrados...</td></tr>';
    return;
  }
  data.forEach((item, index) => {
    const tdBotones = td("");
    if (item.estado === "reservado") {
      tdBotones.appendChild(button("Entregar", () => entregarAlquiler(item.id)));
      tdBotones.appendChild(button("Cancelar", () => cancelarAlquiler(item.id)));
    } else if (item.estado === "en_curso") {
      tdBotones.appendChild(button("Devolver", () => devolverAlquiler(item.id)));
    }

    const tr = document.createElement("tr");
    tr.appendChild(td(index + 1));
    tr.appendChild(td(vehicleLabel(vehicles[item.vehiculo_id])));
    tr.appendChild(td(customerLabel(customers[item.cliente_id])));
    tr.appendChild(td(item.fecha_inicio));
    tr.appendChild(td(item.fecha_fin));
    tr.appendChild(td(item.fecha_devolucion || "-"));
    tr.appendChild(tdEstado(item.estado));
    tr.appendChild(tdBotones);
    tbody.appendChild(tr);
  });
};
