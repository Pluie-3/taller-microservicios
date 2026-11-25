const trs_history = (table, data, tipo, vehicles, customers) => {
  const tbody = table.getElementsByTagName("tbody")[0];
  tbody.textContent = "";
  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6">Todavía no tiene alquileres.</td></tr>';
    return;
  }
  data.forEach((item, index) => {
    const otro = tipo === "vehiculo" ? customerLabel(customers[item.cliente_id]) : vehicleLabel(vehicles[item.vehiculo_id]);
    const tr = document.createElement("tr");
    tr.appendChild(td(index + 1));
    tr.appendChild(td(otro));
    tr.appendChild(td(item.fecha_inicio));
    tr.appendChild(td(item.fecha_fin));
    tr.appendChild(td(item.fecha_devolucion || "-"));
    tr.appendChild(tdEstado(item.estado));
    tbody.appendChild(tr);
  });
};
