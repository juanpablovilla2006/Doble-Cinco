export default function CampoFormulario({
  etiqueta,
  nombre,
  tipo = "text",
  valor,
  onChange,
  error,
  opciones = [],
  ...resto
}) {
  const id = `campo-${nombre}`;
  const invalido = error ? "is-invalid" : "";

  let control;

  if (tipo === "select") {
    control = (
      <select id={id} name={nombre} className={`form-select ${invalido}`} value={valor} onChange={onChange} {...resto}>
        <option value="">Elegí una opción</option>
        {opciones.map((opcion) => (
          <option key={opcion} value={opcion}>
            {opcion}
          </option>
        ))}
      </select>
    );
  } else if (tipo === "textarea") {
    control = (
      <textarea id={id} name={nombre} className={`form-control ${invalido}`} rows="3" value={valor} onChange={onChange} {...resto} />
    );
  } else {
    control = (
      <input id={id} name={nombre} type={tipo} className={`form-control ${invalido}`} value={valor} onChange={onChange} {...resto} />
    );
  }

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {etiqueta}
      </label>
      {control}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}