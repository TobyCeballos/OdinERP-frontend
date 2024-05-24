import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import EventModal from './EventModal'; // Asegúrate de que la ruta sea correcta
import moment from 'moment-timezone';
import { API_ENDPOINT } from '../utils/config';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allDay, setAllDay] = useState(false);
  const [selectInfo, setSelectInfo] = useState(null);
  const token = localStorage.getItem("token")
  const config = {
    headers: {
      "x-access-token": `${token}`,
    },
  };
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINT}api/calendar/${localStorage.getItem('company')}/events`, config);
        setEvents(response.data);
      } catch (error) {
        console.error('Error al cargar eventos:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleDateSelect = (selectInfo) => {
    
    console.log(selectInfo);
    setAllDay(selectInfo.allDay);
    setSelectInfo(selectInfo);
    setIsModalOpen(true);
  };

  const handleSave = async (newEvent) => {
    try {
      const response = await axios.post(`${API_ENDPOINT}api/calendar/${localStorage.getItem('company')}/event`,newEvent, config );
      const savedEvent = response.data;

      setEvents([...events, savedEvent]);
    } catch (error) {
      console.error('Error al guardar el evento:', error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectInfo(null);
  };

  // Función para formatear la fecha en el formato requerido y ajustar a la hora 00:00 en la zona horaria de Argentina
  const formatDate = (date) => {
    if (!date) return '';
    return moment(date).tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DDTHH:mm');
  };

  return (
    <div className="h-full bg-white p-2 rounded-md">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="100%"
        weekends={true}
        firstDay={1}
        selectable={true}
        eventBackgroundColor="#8b5cf6"
        events={events}
        select={handleDateSelect}
      />
      <EventModal
        allDay={allDay}
        setAllDay={setAllDay}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
        startDate={formatDate(selectInfo ? selectInfo.start : '')}
        endDate={formatDate(selectInfo ? selectInfo.end : '')}
      />
    </div>
  );
};

export default Calendar;
