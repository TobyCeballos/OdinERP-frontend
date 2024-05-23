import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import  interactionPlugin from '@fullcalendar/interaction'
const events = [
  {
    title: "Conferencia de Innovación Tecnológica",
    start: "2024-04-01T09:00:00",
    end: "2024-04-01T18:00:00",
    location: "Centro de Convenciones XYZ",
    classNames: ["conferencia"]
  },
  {
    title: "Taller de Desarrollo de Aplicaciones Móviles",
    start: "2024-04-05T10:30:00",
    end: "2024-04-05T16:30:00",
    location: "Sala de Conferencias ABC",
    classNames: ["taller"]
  },
  {
    title: "Feria de Emprendimiento Local",
    start: "2024-04-10T11:00:00",
    end: "2024-04-10T19:00:00",
    location: "Plaza del Pueblo",
    classNames: ["feria"]
  },
  {
    title: "Seminario de Marketing Digital",
    start: "2024-04-12T10:00:00",
    end: "2024-04-12T16:00:00",
    location: "Salón de Eventos Zeta",
    classNames: ["seminario"]
  },
  {
    title: "Expo de Tecnología e Innovación",
    start: "2024-04-15T08:30:00",
    end: "2024-04-15T17:30:00",
    location: "Pabellón de Exposiciones Gamma",
    classNames: ["expo"]
  },
  {
    title: "Taller de Diseño Gráfico Avanzado",
    start: "2024-04-18T11:00:00",
    end: "2024-04-18T16:00:00",
    location: "Aula Creativa Epsilon",
    classNames: ["taller"]
  },
  {
    title: "Foro de Emprendedores",
    start: "2024-04-22T09:30:00",
    end: "2024-04-22T18:30:00",
    location: "Centro de Emprendimiento Beta",
    classNames: ["foro"]
  },
  {
    title: "Charla sobre Inteligencia Artificial",
    start: "2024-04-25T14:00:00",
    end: "2024-04-25T19:00:00",
    location: "Sala de Conferencias Delta",
    classNames: ["charla"]
  },
  {
    title: "Curso de Desarrollo Web Frontend",
    start: "2024-04-28T10:00:00",
    end: "2024-04-28T17:00:00",
    location: "Aula de Desarrollo Web",
    classNames: ["curso"]
  },
  {
    title: "Expo de Arte Contemporáneo",
    start: "2024-04-30T12:00:00",
    end: "2024-04-30T20:00:00",
    location: "Galería de Arte Omega",
    classNames: ["expo"]
  }
];

export default function Calendar() {
  return (
  <div className='p-3 mt-2 bg-white rounded-md '>
  <FullCalendar
  plugins={[ dayGridPlugin, interactionPlugin ]}
  initialView="dayGridMonth"
  height={700}
  weekends={true}
  firstDay={1} selectable
  eventBackgroundColor='#8b5cf6'
  events={events}
/></div>
  )
}