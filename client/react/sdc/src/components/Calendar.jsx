import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./calendar.css";
import CalendarFrame from "./CalendarFrame";
import CalendarDay from "./CalendarDay";
import loading_path from "./loading.gif";
import "react-calendar/dist/Calendar.css";

const API_HOST = process.env.REACT_APP_API_HOST || "acolmenero.com";
// const API_PORT = process.env.REACT_APP_API_PORT || "5000";
const getDate = (dateObj) => {
	return `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
}

const Calendar = () => {

	console.log("Reloading Calendar");

	const { id } = useParams();

	const [current_date, set_current_date] = useState(undefined);
	const [firstFetch, setFirstFetch] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);
	const [loadingFile, setLoadingFile] = useState(null);
	const [selectedDay, setSelectedDay] = useState(undefined);
	const [loadingContent, setLoadingContent] = useState(true);
	const [calendarFiles, setCalendarFiles] = useState(undefined);
	const [textareaValue, setTextareaValue] = useState('');
	const [dayFiles, setDayFiles] = useState([]);
	const [loadingDaysFiles, setLoadingDaysFiles] = useState(true);

	const fetchDaysFile = async () => {
		try {
			const url = `https://${API_HOST}/calendar/php/Files.php?calendar_id=${id}`;
			console.log(url);
			const response = await fetch(
				url,
				{
					method: 'GET',
					mode: 'cors'
				}
			);
			const data = await response.json();

			console.log("calendar files: ", data);

			setCalendarFiles(data);
			setLoadingDaysFiles(false);

		} catch (error) {
			setCalendarFiles(null);
			console.error("Error fetching calendars:", error);
		}
	};
	const deleteFile = async (file) => {

		setLoadingDaysFiles(true);
		setSelectedFile(undefined);

		try {
			const url = `https://${API_HOST}/calendar/php/File.php`;
			console.log(url);
			const response = await fetch(
				url,
				{
					method: 'DELETE',
					mode: 'cors',
					body: JSON.stringify({
						file_id: file.id
					})
				}
			);
			const data = await response.text();

			console.log("delete: ", data);

			// reload calendar media
			fetchDaysFile();

			// reload current day medias
			fetchDayFiles(current_date);

			// setCalendarFiles(data);

		} catch (error) {
			console.error("Error fetching calendars:", error);
		}
	};
	const fetchDayContent = async (current_date) => {
		try {
			const url = `https://${API_HOST}/calendar/php/Day.php?date=${current_date}&calendar_id=${id}`;
			console.log(url);
			const response = await fetch(
				url,
				{
					method: 'GET',
					mode: 'cors',
					headers: {
						"Content-Type": "application/json",
					}
				}
			);
			const data = await response.text();

			console.log("setTextareaValue", url, data);
			setTextareaValue(data);

			setLoadingContent(false);

		} catch (error) {
			console.error("Error fetching calendars:", error);
		}
	};
	const fetchDayFiles = async (current_date) => {
		try {
			const url = `https://${API_HOST}/calendar/php/File.php?date=${current_date}&calendar_id=${id}`;
			console.log(url);
			const response = await fetch(
				url,
				{
					method: 'GET',
					mode: 'cors'
				}
			);
			const data = await response.json();
			console.log(data);
			setDayFiles(data);

		} catch (error) {
			console.error("Error fetching calendars:", error);
		}
	};

	if (calendarFiles === undefined) {
		fetchDaysFile();
	}

	// const current_date = getDate(selectedDay);


	return (
		<div className={"bg-dark" + ((selectedDay) ? ' open' : '')} id="main">

			<div id="calendar-group">

				{
					selectedFile
					&&
					<div className="panel">
						<div className="">
							<div className="preview-header bg-dark text-light p-1">
								<div className="d-flex justify-content-between px-1">
									<i
										className="bi bi-x-lg clickable"
										onClick={() => {
											setSelectedFile(undefined);
										}}
									></i>
									<i
										className="bi bi-trash2 clickable"
										onClick={() => {
											deleteFile(selectedFile);
										}}
									></i>
								</div>
							</div>
							<div className="preview-image">
								<img
									src={`https://acolmenero.com/calendar/${selectedFile.filename}`}
									alt={"preview image"}
								/>
							</div>
						</div>
					</div>
				}
				{
					loadingDaysFiles
					&&
					<div className="panel-loading">
						<div className="loading">
							<img src={loading_path} alt="" />
						</div>
					</div>
				}


				<CalendarFrame
					setSelectedDay={(year, month, day) => {
						console.log("Edit");
						setFirstFetch(false);
						setLoadingContent(true);
						setSelectedDay({
							year,
							month,
							day: day + 1,
							data: null,
						});

						const current_date = getDate({
							year,
							month,
							day: day + 1
						});
						set_current_date(current_date)
						fetchDayContent(current_date);
						fetchDayFiles(current_date);

					}}
					calendarID={id}
					calendarFiles={calendarFiles}
					selectedDay={selectedDay}
				/>

				<CalendarDay
					selectedDay={selectedDay}
					calendarID={id}
					firstFetch={firstFetch}
					setFirstFetch={setFirstFetch}
					loadingContent={loadingContent}
					setLoadingContent={setLoadingContent}
					loadingFile={loadingFile}
					setLoadingFile={setLoadingFile}
					selectedFile={selectedFile}
					setSelectedFile={setSelectedFile}
					setSelectedDay={setSelectedDay}
					textareaValue={textareaValue}
					setTextareaValue={setTextareaValue}
					loadingDaysFiles={loadingDaysFiles}
					setLoadingDaysFiles={setLoadingDaysFiles}
					dayFiles={dayFiles}
					setDayFiles={setDayFiles}
					fetchDayFiles={fetchDayFiles}
					fetchDaysFile={fetchDaysFile}
				/>

			</div>
		</div>
	);
};

export default Calendar;
