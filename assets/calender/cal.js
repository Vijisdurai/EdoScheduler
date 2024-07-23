document.addEventListener('DOMContentLoaded', function() {
    // Selectors for various elements
    const calendarEl = document.getElementById('calendar-view');
    const eventModal = document.getElementById('eventModal');
    const closeModal = document.getElementsByClassName('close')[0];
    const eventForm = document.getElementById('event-form');
    const deleteEventButton = document.getElementById('delete-event');

    let events = JSON.parse(localStorage.getItem('events')) || [];
    let currentEvent;

    // Save data to localStorage
    function saveToLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Render calendar
    function renderCalendar() {
        $(calendarEl).fullCalendar('destroy');
        $(calendarEl).fullCalendar({
            editable: true,
            selectable: true,
            events: events,
            eventClick: function(event) {
                openModal(event);
            },
            dayClick: function(date) {
                openModal({ start: date });
            },
            eventDrop: function(event) {
                updateEvent(event);
            },
            eventResize: function(event) {
                updateEvent(event);
            }
        });
    }

    // Modal handling
    function openModal(event = null) {
        if (event) {
            document.getElementById('event-title').value = event.title;
            document.getElementById('event-desc').value = event.description;
            document.getElementById('event-start').value = moment(event.start).format('YYYY-MM-DD');
            document.getElementById('event-end').value = event.end ? moment(event.end).format('YYYY-MM-DD') : '';
            deleteEventButton.style.display = 'block';
            currentEvent = event;
        } else {
            eventForm.reset();
            deleteEventButton.style.display = 'none';
            currentEvent = null;
        }
        eventModal.style.display = 'block';
    }

    function closeModalHandler() {
        eventModal.style.display = 'none';
    }

    closeModal.onclick = closeModalHandler;

    window.onclick = function(event) {
        if (event.target == eventModal) {
            closeModalHandler();
        }
    }

    function updateEvent(event) {
        events = events.map(evt => (evt._id === event._id ? event : evt));
        saveToLocalStorage('events', events);
        renderCalendar();
    }

    eventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const event = {
            title: document.getElementById('event-title').value,
            description: document.getElementById('event-desc').value,
            start: document.getElementById('event-start').value,
            end: document.getElementById('event-end').value
        };
        if (currentEvent) {
            currentEvent.title = event.title;
            currentEvent.description = event.description;
            currentEvent.start = event.start;
            currentEvent.end = event.end;
            updateEvent(currentEvent);
        } else {
            event._id = Date.now().toString();
            events.push(event);
            $(calendarEl).fullCalendar('renderEvent', event, true);
        }
        saveToLocalStorage('events', events);
        renderCalendar();
        closeModalHandler();
    });

    deleteEventButton.addEventListener('click', function() {
        if (currentEvent) {
            events = events.filter(event => event._id !== currentEvent._id);
            $(calendarEl).fullCalendar('removeEvents', currentEvent._id);
            saveToLocalStorage('events', events);
            renderCalendar();
            closeModalHandler();
        }
    });

    // Initial render
    renderCalendar();
});
