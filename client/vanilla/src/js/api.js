// Create a new calendar event
function createEvent() {
    const eventData = {
        name: 'New Event',
        description: 'Event Description',
        creation_date: new Date().toISOString()
    };

    fetch('/calendar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Get a calendar event by ID
function getEvent(eventId) {
    fetch(`/calendar/${eventId}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Update a calendar event by ID
function updateEvent(eventId) {
    const eventData = {
        name: 'Updated Event Name',
        description: 'Updated Event Description'
    };

    fetch(`/calendar/${eventId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Delete a calendar event by ID
function deleteEvent(eventId) {
    fetch(`/calendar/${eventId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}