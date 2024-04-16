import React, { useState, useRef, useEffect } from "react";
import "./calendar-frame.css";

function getDaysInMonth(year, month) {
	return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {

	console.log(year, month);

	console.log(new Date(year, month, 1));

	return new Date(year, month, 1).getDay();
}

function getMonthName(month) {
	const monthNames = [
		"Enero",
		"Febrero",
		"Marzo",
		"Abril",
		"Mayo",
		"Junio",
		"Julio",
		"Agosto",
		"Septiembre",
		"Octubre",
		"Noviembre",
		"Diciembre",
	];
	return monthNames[month];
}


function groupArrayInChunks(array, chunkSize) {
	var groupedArray = [];
	for (var i = 0; i < array.length; i += chunkSize) {
		groupedArray.push(array.slice(i, i + chunkSize).reverse());
	}
	return groupedArray;
}
function flattenArray(arr) {
	var flattenedArray = [];
	arr.forEach(function (element) {
		if (Array.isArray(element)) {
			flattenedArray = flattenedArray.concat(flattenArray(element));
		} else {
			flattenedArray.push(element);
		}
	});
	return flattenedArray;
}

function CalendarFrame({ selectedDay, setSelectedDay, calendarFiles }) {


	const divRef = useRef(null);

	useEffect(() => {
		console.log(divRef.current);
		// Set the scrollTop property of the div to its maximum scroll height
		if (divRef.current) {
			divRef.current.scrollTop = divRef.current.scrollHeight;
		}
	}, divRef.current);

	console.log("Reloading CalendarFrame");

	const [year, setYear] = useState(new Date().getFullYear());
	const [month, setMonth] = useState(new Date().getMonth());
	const [dayFiles, setDayFiles] = useState(undefined);

	const handlePrevMonth = () => {
		if (month === 0) {
			setMonth(11);
			setYear(year - 1);
		} else {
			setMonth(month - 1);
		}
	};
	const handleNextMonth = () => {
		if (month === 11) {
			setMonth(0);
			setYear(year + 1);
		} else {
			setMonth(month + 1);
		}
	};

	// function Calendar({ year, month, handleNextMonth, handlePrevMonth }) {

	// 	// console.log(calendarFiles);
	// 	let months = calendarFiles.map(i => parseInt(i.linked_date.split("-")[1]));
	// 	months = Array.from(new Set(months));
	// 	months = months.sort(function (a, b) {
	// 		return a - b;
	// 	});
	// 	let start_month = months[0];
	// 	month = start_month;

	// 	const today = new Date();
	// 	const currentYear = today.getFullYear();
	// 	const currentMonth = today.getMonth();
	// 	const currentDay = today.getDate();


	// 	const firstDay = getFirstDayOfMonth(year, month);
	// 	const adjustedFirstDay = (firstDay + 6) % 7;

	// 	const blankDays = Array.from({ length: adjustedFirstDay }, (_, i) => (
	// 		<div key={`blank-${i}`} className="calendar-day empty"></div>
	// 	));
	// 	let monthDays = [];

	// 	for (let j = 0; j < months.length; j++) {
	// 		month = months[j];

	// 		const daysInMonth = getDaysInMonth(year, month);
	// 		console.log("month", month);
	// 		// console.log("daysInMonth", daysInMonth);
	// 		const current_month_days = Array.from({ length: daysInMonth }, (_, i) => {

	// 			const day = i + 1;

	// 			const isToday = year === currentYear && month === currentMonth && day === currentDay;
	// 			const isPast = year > currentYear || (year === currentYear && month >= currentMonth && day > currentDay);
	// 			var classNames = `calendar-day ${isToday ? 'today' : ''} ${isPast ? 'post-day' : ''}`;

	// 			const current_date = `${year}-${month}-${day}`;

	// 			if (selectedDay) {
	// 				const selected_date = `${selectedDay.year}-${selectedDay.month}-${selectedDay.day}`;
	// 				if (selected_date === current_date) {
	// 					classNames += " selected-day"
	// 				}
	// 			}

	// 			// get last 3 images
	// 			var images = [];
	// 			if (calendarFiles) {
	// 				images = calendarFiles.filter(i => i.linked_date === current_date);
	// 				images = images.slice(0, 3);
	// 			}

	// 			return <div
	// 				key={`day-${j}-${i}`}
	// 				data-month={month}
	// 				data-day={(i)}
	// 				data-year={year}
	// 				className={classNames}
	// 				onClick={(e) => {
	// 					const date = [
	// 						parseInt(e.currentTarget.dataset.year),
	// 						parseInt(e.currentTarget.dataset.month),
	// 						parseInt(e.currentTarget.dataset.day)
	// 					];
	// 					console.log(date);
	// 					setSelectedDay(...date)
	// 				}}>
	// 				<div className="d-flex h-100">
	// 					<div className="day-label">
	// 						{day}
	// 					</div>

	// 					{
	// 						images.map((image, index) => {
	// 							var styles = {
	// 								backgroundImage: `url(https://acolmenero.com/calendar/${image.filename})`
	// 							};
	// 							if (index + 1 !== images.length) {
	// 								styles.borderBottom = "1px solid whitesmoke";
	// 							}

	// 							return <div
	// 								key={index}
	// 								className="day-preview"
	// 								style={styles}
	// 							>

	// 							</div>
	// 						})
	// 					}

	// 				</div>
	// 			</div>
	// 		});

	// 		monthDays = monthDays.concat(current_month_days);
	// 	}


	// 	const monthName = getMonthName(month);

	// 	let calendar_frame_styles = {};
	// 	if (selectedDay === undefined) {
	// 		calendar_frame_styles.height = '100%';
	// 	}

	// 	return (
	// 		<div
	// 			className="calendar"
	// 			style={calendar_frame_styles}
	// 		>
	// 			<div className="d-flex justify-content-between p-2 calendar-header">
	// 				<button onClick={handlePrevMonth} className="btn btn-primary py-0 rounded-1">
	// 					<i className="bi bi-arrow-left"></i>
	// 				</button>
	// 				<div className="text-light fs-5">{`${monthName} de ${year}`}</div>
	// 				<button onClick={handleNextMonth} className="btn btn-primary py-0 rounded-1">
	// 					<i className="bi bi-arrow-right"></i>
	// 				</button>
	// 			</div>

	// 			<div className="d-flex" id="days-columns">
	// 				<div className="calendar-day-label w-100">Lun</div>
	// 				<div className="calendar-day-label w-100">Mar</div>
	// 				<div className="calendar-day-label w-100">Mié</div>
	// 				<div className="calendar-day-label w-100">Jue</div>
	// 				<div className="calendar-day-label w-100">Vie</div>
	// 				<div className="calendar-day-label w-100">Sáb</div>
	// 				<div className="calendar-day-label w-100">Dom</div>
	// 			</div>
	// 			<div className="calendar-grid">
	// 				{blankDays}
	// 				{monthDays}
	// 			</div>
	// 		</div>
	// 	);
	// }



	if (calendarFiles === undefined) {
		return <div className=""></div>;
	}

	let months = calendarFiles.map(i => parseInt(i.linked_date.split("-")[1]));
	months = Array.from(new Set(months));
	months = months.sort(function (a, b) {
		return a - b;
	});
	let start_month = months[0];
	// imonth = start_month;

	const today = new Date();
	const currentYear = today.getFullYear();
	const currentMonth = today.getMonth();
	const currentDay = today.getDate();


	console.log(months);
	const firstDay = getFirstDayOfMonth(year, months[0]);
	const adjustedFirstDay = (firstDay + 6) % 7;

	console.log("\ndale");
	console.log(adjustedFirstDay);


	const blankDays = Array.from({ length: adjustedFirstDay }, (_, i) => (
		<div key={`blank-${i}`} className="calendar-day empty"></div>
	));

	let monthDays = [];

	for (let j = 0; j < months.length; j++) {
		const cmonth = months[j];

		const daysInMonth = getDaysInMonth(year, cmonth);
		console.log("month", cmonth);
		// console.log("daysInMonth", daysInMonth);
		const current_month_days = Array.from({ length: daysInMonth }, (_, i) => {

			const day = i + 1;

			const isToday = year === currentYear && cmonth === currentMonth && day === currentDay;
			const isPast = year > currentYear || (year === currentYear && cmonth >= currentMonth && day > currentDay);
			var classNames = `calendar-day ${isToday ? 'today' : ''} ${isPast ? 'post-day' : ''}`;

			const current_date = `${year}-${cmonth}-${day}`;

			if (selectedDay) {
				const selected_date = `${selectedDay.year}-${selectedDay.month}-${selectedDay.day}`;
				if (selected_date === current_date) {
					classNames += " selected-day"
				}
			}

			// get last 3 images
			var images = [];
			if (calendarFiles) {
				images = calendarFiles.filter(i => i.linked_date === current_date);
				images = images.slice(0, 3);
			}

			return <div
				key={`day-${j}-${i}`}
				data-month={cmonth}
				data-day={(i)}
				data-year={year}
				className={classNames}
				onClick={(e) => {
					const date = [
						parseInt(e.currentTarget.dataset.year),
						parseInt(e.currentTarget.dataset.month),
						parseInt(e.currentTarget.dataset.day)
					];
					console.log(date);
					setSelectedDay(...date)
				}}>
				<div className="d-flex h-100">
					<div className="day-label">
						{day}
					</div>

					{
						images.map((image, index) => {
							const filename = image.filename.split("/");
							const full_filename = "uploads/thumbnails/" + filename[1];
							var styles = {
								backgroundImage: `url(https://acolmenero.com/calendar/${full_filename})`
							};
							if (index + 1 !== images.length) {
								styles.borderBottom = "1px solid whitesmoke";
							}

							return <div
								key={index}
								className="day-preview"
								style={styles}
							>

							</div>
						})
					}

				</div>
			</div>
		});

		monthDays = monthDays.concat(current_month_days);
	}


	monthDays = [...blankDays, ...monthDays];
	// monthDays = groupArrayInChunks(monthDays.reverse(), 7);
	// console.log(monthDays);
	// monthDays = flattenArray(monthDays);

	// monthDays = monthDays.reverse();

	const monthName = getMonthName(month);

	let calendar_frame_styles = {};
	if (selectedDay === undefined) {
		calendar_frame_styles.height = '100%';
	}

	return (

		<div
			className="calendar"
			style={calendar_frame_styles}
		>
			<div className="d-flex justify-content-between p-2 calendar-header">
				<button onClick={handlePrevMonth} className="btn btn-primary py-0 rounded-1">
					<i className="bi bi-arrow-left"></i>
				</button>
				<div className="text-light fs-5">{`${monthName} de ${year}`}</div>
				<button onClick={handleNextMonth} className="btn btn-primary py-0 rounded-1">
					<i className="bi bi-arrow-right"></i>
				</button>
			</div>

			<div className="d-flex" id="days-columns">
				<div className="calendar-day-label w-100">Lun</div>
				<div className="calendar-day-label w-100">Mar</div>
				<div className="calendar-day-label w-100">Mié</div>
				<div className="calendar-day-label w-100">Jue</div>
				<div className="calendar-day-label w-100">Vie</div>
				<div className="calendar-day-label w-100">Sáb</div>
				<div className="calendar-day-label w-100">Dom</div>
			</div>
			<div className="calendar-grid" ref={divRef}>
				{/* {blankDays} */}
				{monthDays}
			</div>
		</div>
		// <Calendar
		// 	year={year}
		// 	month={month}
		// 	handlePrevMonth={handlePrevMonth}
		// 	handleNextMonth={handleNextMonth}
		// 	setSelectedDay={setSelectedDay}
		// 	dayFiles={dayFiles}
		// 	setDayFiles={setDayFiles}
		// />
	);
}

export default CalendarFrame;
