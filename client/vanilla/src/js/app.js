// function formatDate(day, month, year) {
//     // Add leading zeros for day and month if necessary
//     const formattedDay = day < 10 ? `0${day}` : day;
//     const formattedMonth = month < 10 ? `0${month}` : month;

//     // Return the formatted date string
//     return `${year}-${formattedMonth}-${formattedDay}`;
// }

// function findDivWithDateAndChild(dateAttributeValue) {
//     // Find all div elements with the given data-date attribute value
//     const divElements = document.querySelectorAll(`td[data-date="${dateAttributeValue}"]`);

//     // Loop through the found div elements to find the one with the child element
//     let targetChildElement = null;
//     for (const divElement of divElements) {
//         const childElement = divElement.querySelector(`.fc-daygrid-day-events`);
//         if (childElement) {
//             targetChildElement = childElement;
//             break;
//         }
//     }

//     return targetChildElement;
// }

// // for (const event of events) {

// //     console.log(event);

// // }


$(document).ready(function () {
    $('#calendar').fullCalendar({
        defaultView: 'month',
        events: generateEventsForLast18Months(),
        dayRender: function (date, cell) {
            // Add your custom HTML to specific dates
            // For example:
            if (date.isSame('2023-06-15', 'day')) {
                cell.append('<div class="custom-event">Your HTML here</div>');
            }
        },
    });
});

function generateEventsForLast18Months() {
    let events = [];
    let currentDate = moment().subtract(18, 'months');
    const endDate = moment(); // Today

    while (currentDate.isSameOrBefore(endDate, 'month')) {
        events.push({
            title: 'Event Title',
            start: currentDate.format('YYYY-MM-DD'),
        });
        currentDate.add(1, 'month');
    }

    return events;
}
