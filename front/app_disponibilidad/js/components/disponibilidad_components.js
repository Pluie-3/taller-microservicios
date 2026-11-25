const trs_available = (table, data, date) => {
  const tbody = table.getElementsByTagName("tbody")[0];
  tbody.textContent = "";
  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6">No hay vehículos disponibles para esa fecha.</td></tr>';
    return;
  }
  data.forEach((item, index) => {
    const tdBotones = td("");
    tdBotones.appendChild(link("Reservar", "../app_alquileres/index.html?vehiculo_id=" + item.id + "&fecha=" + date));
    const tr = document.createElement("tr");
    tr.appendChild(td(index + 1));
    tr.appendChild(td(item.marca));
    tr.appendChild(td(item.modelo));
    tr.appendChild(td(item.anio));
    tr.appendChild(td(item.categoria));
    tr.appendChild(tdBotones);
    tbody.appendChild(tr);
  });
};
