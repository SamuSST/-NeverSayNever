import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [kmActual, setKmActual] = useState("");
  const [records, setRecords] = useState([
    { id: 1, nombre: "Cambio de Aceite", kmProximo: 5000, fechaProxima: "" },
    { id: 2, nombre: "Técnico-Mecánica", kmProximo: "", fechaProxima: "" },
    { id: 3, nombre: "Mantenimiento General", kmProximo: 10000, fechaProxima: "" },
    { id: 4, nombre: "SOAT", kmProximo: "", fechaProxima: "" },
  ]);

  useEffect(() => {
    const data = localStorage.getItem("records");
    const km = localStorage.getItem("kmActual");

    if (data) setRecords(JSON.parse(data));
    if (km) setKmActual(km);
  }, []);

  useEffect(() => {
    localStorage.setItem("records", JSON.stringify(records));
    localStorage.setItem("kmActual", kmActual);
  }, [records, kmActual]);

  const actualizarRecord = (id, campo, valor) => {
    setRecords(
      records.map((rec) =>
        rec.id === id ? { ...rec, [campo]: valor } : rec
      )
    );
  };

  const estadoRecord = (rec) => {
    const hoy = new Date();
    const kmActualNum = Number(kmActual);

    if (rec.kmProximo && kmActualNum >= rec.kmProximo) {
      return "🔴 Vencido por KM";
    }

    if (rec.fechaProxima) {
      const fecha = new Date(rec.fechaProxima);
      if (fecha <= hoy) return "🔴 Vencido por Fecha";

      const diffDias = (fecha - hoy) / (1000 * 60 * 60 * 24);
      if (diffDias <= 30) return "🟡 Próximo a vencer";
    }

    return "🟢 En regla";
  };

  return (
    <div className="container">
      <h1>🚗 Recordatorio de mi Carro</h1>

      <label>Kilometraje Actual</label>
      <input
        type="number"
        value={kmActual}
        onChange={(e) => setKmActual(e.target.value)}
      />

      {records.map((rec) => (
        <div key={rec.id} className="card">
          <h3>{rec.nombre}</h3>

          <label>Próximo KM:</label>
          <input
            type="number"
            value={rec.kmProximo || ""}
            onChange={(e) =>
              actualizarRecord(
                rec.id,
                "kmProximo",
                e.target.value ? Number(e.target.value) : ""
              )
            }
          />

          <label>Próxima Fecha:</label>
          <input
            type="date"
            value={rec.fechaProxima}
            onChange={(e) =>
              actualizarRecord(rec.id, "fechaProxima", e.target.value)
            }
          />

          <p><strong>Estado:</strong> {estadoRecord(rec)}</p>
        </div>
      ))}
    </div>
  );
}

export default App;