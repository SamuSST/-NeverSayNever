import { useState, useEffect } from "react";

function App() {
  const [kmActual, setKmActual] = useState(0);
  const [records, setRecords] = useState([
    { id: 1, nombre: "Cambio de Aceite", kmProximo: 5000, fechaProxima: "" },
    { id: 2, nombre: "Técnico-Mecánica", kmProximo: "", fechaProxima: "" },
    { id: 3, nombre: "Mantenimiento General", kmProximo: 10000, fechaProxima: "" },
    { id: 4, nombre: "SOAT", kmProximo: "", fechaProxima: "" },
  ]);

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    guardarDatos();
  }, [records, kmActual]);

  const guardarDatos = () => {
    localStorage.setItem("records", JSON.stringify(records));
    localStorage.setItem("kmActual", kmActual);
  };

  const cargarDatos = () => {
    const data = localStorage.getItem("records");
    const km = localStorage.getItem("kmActual");

    if (data) setRecords(JSON.parse(data));
    if (km) setKmActual(Number(km));
  };

  const actualizarRecord = (id, campo, valor) => {
    setRecords(
      records.map((rec) =>
        rec.id === id ? { ...rec, [campo]: valor } : rec
      )
    );
  };

  const estadoRecord = (rec) => {
    const hoy = new Date();

    if (rec.kmProximo && kmActual >= rec.kmProximo) {
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
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>🚗 Recordatorio de mi Carro</h1>

      <p>Kilometraje Actual</p>
      <input
        type="number"
        value={kmActual}
        onChange={(e) => setKmActual(Number(e.target.value))}
      />

      {records.map((rec) => (
        <div
          key={rec.id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "12px",
            marginTop: "15px",
          }}
        >
          <h3>{rec.nombre}</h3>

          <p>Próximo KM:</p>
          <input
            type="number"
            value={rec.kmProximo}
            onChange={(e) =>
              actualizarRecord(rec.id, "kmProximo", Number(e.target.value))
            }
          />

          <p>Próxima Fecha:</p>
          <input
            type="date"
            value={rec.fechaProxima}
            onChange={(e) =>
              actualizarRecord(rec.id, "fechaProxima", e.target.value)
            }
          />

          <p style={{ fontWeight: "bold" }}>
            Estado: {estadoRecord(rec)}
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;