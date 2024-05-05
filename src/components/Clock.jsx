import React, { useState, useEffect } from "react";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Función para actualizar el estado de la hora cada segundo
    const updateTime = () => {
      setTime(new Date());
    };

    // Establecer un intervalo para llamar a updateTime cada segundo
    const interval = setInterval(updateTime, 1000);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, []); // El array vacío [] garantiza que el efecto se ejecute solo una vez, al montar el componente

  return (
    <div className="absolute right-0 top-5">
      <span className="border-2 rounded-full text-lg font-semibold text-white py-3 px-5  border-violet-500">{time.toLocaleTimeString()}</span>
    </div>
  );
};

export default Clock;