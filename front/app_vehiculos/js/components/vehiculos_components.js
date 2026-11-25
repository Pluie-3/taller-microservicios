// COMPONENTES: construyen las filas de la tabla
const trs_vehicles = (table, data) => {
  const tbody = table.getElementsByTagName("tbody")[0];
  tbody.textContent = "";
  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7">No hay datos registrados...</td></tr>';
    return;
  }
  data.forEach((item, index) => {
    const tdBotones = td("");
    tdBotones.appendChild(button("Editar", () => editarVehiculo(item)));
    tdBotones.appendChild(button("Borrar", () => borrarVehiculo(item.id)));
    tdBotones.appendChild(link("Reservar", "../app_alquileres/index.html?vehiculo_id=" + item.id));
    tdBotones.appendChild(link("Historial", "../app_historial/index.html?tipo=vehiculo&id=" + item.id));

    const tr = document.createElement("tr");
    tr.appendChild(td(index + 1));
    tr.appendChild(td(item.marca));
    tr.appendChild(td(item.modelo));
    tr.appendChild(td(item.anio));
    tr.appendChild(td(item.categoria));
    tr.appendChild(tdEstado(item.estado));
    tr.appendChild(tdBotones);
    tbody.appendChild(tr);
  });
};
