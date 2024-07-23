document.addEventListener('DOMContentLoaded', function() {
    // Selectors for various elements
    const taskList = document.getElementById('task-list');
    const todoList = document.getElementById('todo-list');
    const noteList = document.getElementById('note-list');
    const teamTaskList = document.getElementById('team-task-list');
    const habitList = document.getElementById('habit-list');
    const taskForm = document.getElementById('task-form');
    const todoForm = document.getElementById('todo-form');
    const noteForm = document.getElementById('note-form');
    const teamForm = document.getElementById('team-form');
    const habitForm = document.getElementById('habit-form');
    const calendarEl = document.getElementById('calendar-view');
    const eventModal = document.getElementById('eventModal');
    const closeModal = document.getElementsByClassName('close')[0];
    const eventForm = document.getElementById('event-form');
    const deleteEventButton = document.getElementById('delete-event');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let teamTasks = JSON.parse(localStorage.getItem('teamTasks')) || [];
    let habits = JSON.parse(localStorage.getItem('habits')) || [];
    let currentEvent;

    // Save data to localStorage
    function saveToLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Render functions for each type
    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach(task => addTaskToList(task));
    }

    function renderToDos() {
        todoList.innerHTML = '';
        todos.forEach(todo => addToDoToList(todo));
    }

    function renderNotes() {
        noteList.innerHTML = '';
        notes.forEach(note => addNoteToList(note));
    }

    function renderTeamTasks() {
        teamTaskList.innerHTML = '';
        teamTasks.forEach(task => addTeamTaskToList(task));
    }

    function renderHabits() {
        habitList.innerHTML = '';
        habits.forEach(habit => addHabitToList(habit));
    }

    function renderCalendar() {
        $(calendarEl).fullCalendar('destroy');
        $(calendarEl).fullCalendar({
            editable: true,
            selectable: true,
            events: [
                ...tasks.map(task => ({ title: task.title, start: task.date, description: task.desc })),
                ...todos.map(todo => ({ title: todo.title, start: todo.date })),
                ...notes.map(note => ({ title: note.title, start: note.date, description: note.desc })),
                ...teamTasks.map(task => ({ title: task.title, start: task.date, description: task.desc })),
                ...habits.map(habit => ({ title: habit.title, start: habit.date, description: habit.desc }))
            ],
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

    // Add item to respective list
    function addTaskToList(task) {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `<span class="task-title">${task.title}</span> <span class="task-actions"><button class="btn btn-danger btn-sm" onclick="deleteTask('${task.id}')">Delete</button></span>`;
        taskList.appendChild(li);
    }

    function addToDoToList(todo) {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `<span class="todo-title">${todo.title}</span> <span class="todo-actions"><button class="btn btn-danger btn-sm" onclick="deleteToDo('${todo.id}')">Delete</button></span>`;
        todoList.appendChild(li);
    }

    function addNoteToList(note) {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `<span class="note-title">${note.title}</span> <span class="note-actions"><button class="btn btn-danger btn-sm" onclick="deleteNote('${note.id}')">Delete</button></span>`;
        noteList.appendChild(li);
    }

    function addTeamTaskToList(task) {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `<span class="team-task-title">${task.title}</span> <span class="team-task-actions"><button class="btn btn-danger btn-sm" onclick="deleteTeamTask('${task.id}')">Delete</button></span>`;
        teamTaskList.appendChild(li);
    }

    function addHabitToList(habit) {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `<span class="habit-title">${habit.title}</span> <span class="habit-actions"><button class="btn btn-danger btn-sm" onclick="deleteHabit('${habit.id}')">Delete</button></span>`;
        habitList.appendChild(li);
    }

    // Event listeners for form submissions
    taskForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        const task = {
            id: Date.now().toString(),
            title: taskForm.querySelector('#task-title').value,
            desc: taskForm.querySelector('#task-desc').value,
            date: taskForm.querySelector('#task-date').value,
            priority: taskForm.querySelector('#task-priority').value
        };
        tasks.push(task);
        saveToLocalStorage('tasks', tasks);
        addTaskToList(task);
        taskForm.reset();
        renderCalendar();
    });

    todoForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        const todo = {
            id: Date.now().toString(),
            title: todoForm.querySelector('#todo-title').value,
            date: new Date().toISOString()
        };
        todos.push(todo);
        saveToLocalStorage('todos', todos);
        addToDoToList(todo);
        todoForm.reset();
        renderCalendar();
    });

    noteForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        const note = {
            id: Date.now().toString(),
            title: noteForm.querySelector('#note-title').value,
            desc: noteForm.querySelector('#note-desc').value,
            date: new Date().toISOString()
        };
        notes.push(note);
        saveToLocalStorage('notes', notes);
        addNoteToList(note);
        noteForm.reset();
        renderCalendar();
    });

    teamForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        const teamTask = {
            id: Date.now().toString(),
            title: teamForm.querySelector('#team-task-title').value,
            desc: teamForm.querySelector('#team-task-desc').value,
            date: teamForm.querySelector('#team-task-date').value,
            members: teamForm.querySelector('#team-task-members').value
        };
        teamTasks.push(teamTask);
        saveToLocalStorage('teamTasks', teamTasks);
        addTeamTaskToList(teamTask);
        teamForm.reset();
        renderCalendar();
    });

    habitForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        const habit = {
            id: Date.now().toString(),
            title: habitForm.querySelector('#habit-title').value,
            desc: habitForm.querySelector('#habit-desc').value,
            frequency: habitForm.querySelector('#habit-frequency').value,
            date: new Date().toISOString()
        };
        habits.push(habit);
        saveToLocalStorage('habits', habits);
        addHabitToList(habit);
        habitForm.reset();
        renderCalendar();
    });

    // Delete functions
    window.deleteTask = function(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveToLocalStorage('tasks', tasks);
        renderTasks();
        renderCalendar();
    }

    window.deleteToDo = function(id) {
        todos = todos.filter(todo => todo.id !== id);
        saveToLocalStorage('todos', todos);
        renderToDos();
        renderCalendar();
    }

    window.deleteNote = function(id) {
        notes = notes.filter(note => note.id !== id);
        saveToLocalStorage('notes', notes);
        renderNotes();
        renderCalendar();
    }

    window.deleteTeamTask = function(id) {
        teamTasks = teamTasks.filter(task => task.id !== id);
        saveToLocalStorage('teamTasks', teamTasks);
        renderTeamTasks();
        renderCalendar();
    }

    window.deleteHabit = function(id) {
        habits = habits.filter(habit => habit.id !== id);
        saveToLocalStorage('habits', habits);
        renderHabits();
        renderCalendar();
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
        // Update event in local storage (implementation required based on data structure)
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
            // Update existing event logic (implementation required based on data structure)
        } else {
            // Add new event logic (implementation required based on data structure)
            $(calendarEl).fullCalendar('renderEvent', event, true);
        }
        saveToLocalStorage('events', events);  // Save updated events to local storage
        renderCalendar();
        closeModalHandler();
    });

    deleteEventButton.addEventListener('click', function() {
        if (currentEvent) {
            // Remove event from local storage (implementation required based on data structure)
            $(calendarEl).fullCalendar('removeEvents', currentEvent._id);
            saveToLocalStorage('events', events);  // Save updated events to local storage
            renderCalendar();
            closeModalHandler();
        }
    });

    // Initial rendering of all components
    renderTasks();
    renderToDos();
    renderNotes();
    renderTeamTasks();
    renderHabits();
    renderCalendar();
});
