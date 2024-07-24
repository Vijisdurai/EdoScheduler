$(document).ready(function() {
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];

    $('#calendar-view').fullCalendar({
        editable: true,
        droppable: true,
        events: storedEvents,
        eventRender: function(event, element) {
            element.attr('title', event.description);
            element.click(function() {
                displayDescription(event);
            });
        }
    });

    storedEvents.forEach(event => {
        $('#calendar-view').fullCalendar('renderEvent', event, true);
    });

    function saveEvents() {
        const events = $('#calendar-view').fullCalendar('clientEvents');
        localStorage.setItem('events', JSON.stringify(events));
    }

    document.getElementById("save-note").onclick = function() {
        const id = document.getElementById("note-id").value;
        const title = document.getElementById("note-title").value;
        const content = document.getElementById("note-content").value;
        const start = document.getElementById("note-start").value;
        const end = document.getElementById("note-end").value;

        if (title && content && start && end) {
            let newEvent = {
                title: title,
                start: start,
                end: end,
                description: content
            };

            if (id) {
                newEvent._id = id;
                $('#calendar-view').fullCalendar('removeEvents', id);
            }

            $('#calendar-view').fullCalendar('renderEvent', newEvent, true);
            saveEvents();

            // Clear the input fields
            document.getElementById("note-id").value = '';
            document.getElementById("note-title").value = '';
            document.getElementById("note-content").value = '';
            document.getElementById("note-start").value = '';
            document.getElementById("note-end").value = '';
            document.getElementById("form-title").innerText = 'Add Note';
            document.getElementById("save-note").innerHTML = '<i class="fas fa-save"></i> Save Note';
        } else {
            alert("Please fill in all fields.");
        }
    }

    function displayDescription(event) {
        document.getElementById("modal-title").innerText = event.title;
        document.getElementById("modal-description").innerText = event.description;

        const modal = document.getElementById("description-modal");
        modal.style.display = "block";

        document.getElementById("edit-note").onclick = function() {
            document.getElementById("note-id").value = event._id;
            document.getElementById("note-title").value = event.title;
            document.getElementById("note-content").value = event.description;
            document.getElementById("note-start").value = event.start.format("YYYY-MM-DD");
            document.getElementById("note-end").value = event.end.format("YYYY-MM-DD");
            document.getElementById("form-title").innerText = 'Edit Note';
            document.getElementById("save-note").innerHTML = '<i class="fas fa-save"></i> Update Note';
            modal.style.display = "none";
        };

        document.getElementById("delete-note").onclick = function() {
            if (confirm("Do you want to delete this event?")) {
                $('#calendar-view').fullCalendar('removeEvents', event._id);
                saveEvents();
                modal.style.display = "none";
            }
        };

        document.querySelector(".close").onclick = function() {
            modal.style.display = "none";
        };

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
    }
});
