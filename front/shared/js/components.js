// Componentes pequenos para construir la tabla con el DOM (igual que en la app de estudiantes)
const td = (content) => {
  const component = document.createElement("td");
  component.textContent = content; // textContent (no innerHTML): el texto nunca se interpreta como HTML
  return component;
};

const button = (content, onClick) => {
  const component = document.createElement("button");
  component.textContent = content;
  component.addEventListener("click", () => onClick());
  return component;
};

const link = (content, href) => {
  const component = document.createElement("a");
  component.textContent = content;
  component.href = href;
  component.className = "enlace-btn";
  return component;
};

const tdEstado = (estado) => {
  const component = td(estado);
  component.className = "estado " + estado;
  return component;
};

const fillSelect = (select, items, getValue, getText, emptyText) => {
  select.textContent = "";
  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = emptyText;
  select.appendChild(empty);
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = getValue(item);
    option.textContent = getText(item);
    select.appendChild(option);
  });
};

const vehicleLabel = (v) => (v ? v.marca + " " + v.modelo + " (" + v.anio + ")" : "(vehículo eliminado)");
const customerLabel = (c) => (c ? c.nombre : "(cliente eliminado)");
const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]));
const today = () => new Date().toLocaleDateString("en-CA"); // AAAA-MM-DD
