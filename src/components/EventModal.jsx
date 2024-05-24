import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const EventModal = ({ allDay, setAllDay, isOpen, onClose, onSave, startDate, endDate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState(startDate);
  const [end, setEnd] = useState(endDate);

  useEffect(() => {
    setStart(startDate);
    setEnd(endDate);
  }, [startDate, endDate]);

  const handleSubmit = () => {
    onSave({ title, description, start, end });
    onClose();
  };

  return (
    isOpen && (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" 
        aria-modal="true" 
        role="dialog"
      >
        <div className="bg-white w-1/3 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl mb-4">Agregar Evento</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="event-title">
              Título
            </label>
            <input
              id="event-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="event-description">
              Descripción
            </label>
            <textarea
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="start-date">
              Fecha {!allDay && "de Inicio"}
            </label>
            <input
              id="start-date"
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>{!allDay &&
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="end-date">
              Fecha de Finalización
            </label>
            <input
              id="end-date"
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>}
          <div className='mb-4  flex'>
            <input id='all-day-check' type="checkbox" className='outline-none border px-4 py-1 rounded-full' checked={allDay} onChange={(e) => setAllDay(!allDay)} />
            <label htmlFor="all-day-check" className='pl-2 block'>Todo el día</label>
          </div>
          <div className="flex justify-end">
            <button 
              onClick={onClose} 
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSubmit} 
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    )
  );
};
export default EventModal;
