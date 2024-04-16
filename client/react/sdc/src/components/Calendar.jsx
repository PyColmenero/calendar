import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./calendar.css";
import CalendarFrame from "./CalendarFrame";
import CalendarDay from "./CalendarDay";
import loading_path from "./loading.gif";
import "react-calendar/dist/Calendar.css";
import imageCompression from 'browser-image-compression';

const API_HOST = process.env.REACT_APP_API_HOST || "acolmenero.com";
// const API_PORT = process.env.REACT_APP_API_PORT || "5000";
const getDate = (dateObj) => {
	return `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
}

var textareTimeout = undefined;
const Calendar = () => {

	// console.log("Reloading Calendar");

	const calendarID = 14;

	const [showAddFile, setShowAddFile] = useState(true);
	const [current_date, set_current_date] = useState(undefined);
	const [show_fill_day_data, set_show_fill_day_data] = useState(true);
	const [firstFetch, setFirstFetch] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);
	const [loadingFile, setLoadingFile] = useState(null);
	const [selectedDay, setSelectedDay] = useState(undefined);
	const [loadingContent, setLoadingContent] = useState(true);
	const [calendarFiles, setCalendarFiles] = useState(undefined);
	const [textareaValue, setTextareaValue] = useState('');
	const [dayFiles, setDayFiles] = useState([]);
	const [loadingDaysFiles, setLoadingDaysFiles] = useState(true);
	const [synchronized, setSynchronized] = useState(true);
	const [loadingUpdate, setLoadingUpdate] = useState(false);

	const updateDayContent = async (calendarID, current_date, textareaValue) => {

		const body = { calendar_id: calendarID, date: current_date, content: textareaValue };

		setLoadingUpdate(true);

		try {
			const url = `https://${API_HOST}/calendar/php/Day.php`;
			console.log(url);
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body)
			});

			const data = await response.text();
			console.log(data);

			setLoadingUpdate(false);
			setSynchronized(true);

		} catch (error) {
			console.error("Error creating calendar:", error);
		}

	};

	const handleUpload = async (file, thumbnail) => {

		if (!file) {
			alert('Please select a file to upload.');
			return;
		}

		const formData = new FormData();
		formData.append('file', file);
		formData.append('thumbnail', thumbnail);
		formData.append('calendar_id', calendarID);
		formData.append('date', current_date);

		try {

			const url = `https://${API_HOST}/calendar/php/File.php`;
			console.log(url);
			const response = await fetch(url, {
				method: 'POST',
				body: formData,
			});

			const data = await response.text();
			console.log("return: ", data);


			setLoadingDaysFiles(false);
			fetchDayFiles(current_date);
			fetchDaysFile();

			if (fileInputRef.current) {
				fileInputRef.current.value = null;
			}


		} catch (error) {
			console.error('Error uploading file:', error);
		}
	};
	const compressThubnail = async (imageFile) => {
		const options = {
			maxSizeMB: 1, // Maximum file size after compression
			maxWidthOrHeight: 100, // Maximum width or height of the image
			fileType: 'image/webp', // Convert to WebP format
		};
		const compressedBlob = await imageCompression(imageFile, options);
		return compressedBlob;
	};
	const fileInputRef = useRef(null);
	const handleFileButtonClick = () => {
		fileInputRef.current.click();
	};
	const compressImage = async (imageFile) => {
		const options = {
			maxSizeMB: 1, // Maximum file size after compression
			maxWidthOrHeight: 600, // Maximum width or height of the image
			fileType: 'image/webp', // Convert to WebP format
		};
		const compressedBlob = await imageCompression(imageFile, options);
		return compressedBlob;
	};
	const fetchDaysFile = async () => {
		try {
			const url = `https://${API_HOST}/calendar/php/Files.php?calendar_id=${calendarID}`;
			console.log(url);
			const response = await fetch(
				url,
				{
					method: 'GET',
					mode: 'cors'
				}
			);
			const data = await response.json();

			// console.log("calendar files: ", data);

			setCalendarFiles(data);
			setLoadingDaysFiles(false);

		} catch (error) {
			setCalendarFiles(null);
			console.error("Error fetching calendars:", error);
		}
	};
	const handleTextareaChange = (event) => {
		// console.log("event.target.value", event.target.value);
		const textarea_value = event.target.value
		setTextareaValue(textarea_value);
		setSynchronized(false);

		if (textareTimeout !== undefined) {
			clearTimeout(textareTimeout);
		}

		textareTimeout = setTimeout(() => {
			updateDayContent(calendarID, current_date, textarea_value);
		}, 1000);
	};
	const handleFileInputChange = async (event) => {
		const selectedFile = event.target.files[0];

		const allowed_types = ["image/gif", "image/jpeg", "image/png"];

		if (selectedFile && (allowed_types.includes(selectedFile.type))) {
			setLoadingDaysFiles(true);
			const compressedImageBlob = await compressImage(selectedFile);
			const compressedThumbnailBlob = await compressThubnail(selectedFile);
			handleUpload(compressedImageBlob, compressedThumbnailBlob);
		} else {
			if (fileInputRef.current) {
				fileInputRef.current.value = null;
			}
			alert('Please select a valid JPG or PNG file.');
		}
	};
	const formatDate = (inputDate) => {
		// Parse the input date string
		const date = new Date(inputDate);

		// Array of month names
		const months = [
			"January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"
		];

		// Extract day, month, and year
		const day = date.getDate();
		const month = months[date.getMonth()];
		const year = date.getFullYear();

		// Construct the formatted date string
		const formattedDate = `${day} of ${month} of ${year}`;

		return formattedDate;
	}
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
			const url = `https://${API_HOST}/calendar/php/Day.php?date=${current_date}&calendar_id=${calendarID}`;
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

			console.log("setTextareaValue", data);
			setTextareaValue(data);

			setLoadingContent(false);

		} catch (error) {
			console.error("Error fetching calendars:", error);
		}
	};
	const fetchDayFiles = async (current_date) => {
		try {
			const url = `https://${API_HOST}/calendar/php/File.php?date=${current_date}&calendar_id=${calendarID}`;
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

	const getFirstDayOffset = (year, month) => {
		const firstDay = new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday, etc.
		return firstDay === 0 ? 6 : firstDay - 1; // Convert 0-based index to match Monday as 0 and Sunday as 6
	};

	// const current_date = getDate(selectedDay);

	let months = [
		{ name: 'January', days: 31 },
		{ name: 'February', days: 28 },
		{ name: 'March', days: 31 },
		{ name: 'April', days: 30 },
		{ name: 'May', days: 31 },
		{ name: 'June', days: 30 },
		{ name: 'July', days: 31 },
		{ name: 'August', days: 31 },
		{ name: 'September', days: 30 },
		{ name: 'October', days: 31 },
		{ name: 'November', days: 30 },
		{ name: 'December', days: 31 }
	]

	const year = 2024;

	// console.log("calendarFiles", calendarFiles);

	const today = new Date();
	const currentMonth = today.getMonth();
	const currentDay = today.getDate();
	const today_date = getDate({
		year: 2024,
		month: currentMonth,
		day: currentDay
	});
	// console.log(today_date);

	return (

		<div className="calendar">
			{/* <div className="container">
				<div className="row"> */}
			{months.map((month, index) => {

				const firstDayOffset = getFirstDayOffset(year, index);

				return (
					<div key={index} className="month">
						<div className="days">
							{[...Array(firstDayOffset).keys()].map((day) => (
								<div key={`empty-${day}`} className="empty"></div>
							))}
							{Array.from({ length: month.days }, (_, i) => {


								const day_date = getDate({
									year: year,
									month: index,
									day: i + 1
								});

								let classname_selected = '';
								if (current_date) {
									if (current_date === day_date) {
										classname_selected = " day-selected"
									}
								}

								let classname_today = '';
								if (today_date === day_date) {
									classname_today = " day-today"
								}

								let classname_has_images = '';
								if (calendarFiles) {
									const images = calendarFiles.filter(i => i.linked_date === day_date);
									if (images.length !== 0) {
										classname_has_images = ' day-with-files';
									}
								}

								const classnames = classname_selected + classname_has_images + classname_today

								return (
									<div
										key={i}
										className={"day clickable" + classnames}
										onClick={() => {
											set_current_date(getDate({
												year: year,
												month: index,
												day: i + 1
											}));
											fetchDayFiles(day_date);
											fetchDayContent(day_date);
											set_show_fill_day_data(true);
										}}
									>
										{i + 1}
									</div>
								)
							})}
						</div>
					</div>
				)
			})}
			{/* </div>
			</div> */}

			{
				current_date
				&&
				<div className="popup position-absolute clickable"
					onClick={handleFileButtonClick}
				>
					<i className="bi bi-plus-lg"></i>

					<input
						type="file"
						ref={fileInputRef}
						style={{ display: 'none' }}
						onChange={handleFileInputChange}
					/>
				</div>
			}


			{
				current_date
				&&
				<div className="fill-day-data">

					<div className="d-flex justify-content-between bg-dark text-light px-2 py-1">

						<div className="">
							{
								formatDate(current_date)
							}
						</div>
						<div className="d-flex">
							<div className="loading-gap">
								{
									loadingUpdate
										?
										<img src={loading_path} alt="" width={"24px"} />
										:
										<div className="">
											{
												synchronized
													?
													<i className="bi text-success bi-house-check"></i>
													:
													<i className="bi text-danger bi-house-x"></i>
											}
										</div>
								}

							</div>
							<div className="clickable"
								onClick={() => {
									set_current_date(undefined)
								}}
							>

								<i className="bi bi-x-lg ps-2"></i>

							</div>
						</div>

					</div>

					<div className="p-2">

						<textarea
							value={textareaValue}
							className="flex-1 w-100"
							onChange={handleTextareaChange}
						></textarea>

						<div className="files">

							<div
								className="file text-light p-1 clickable"
								onClick={handleFileButtonClick}
							>
								<i className="bi bi-plus-lg"></i>
							</div>

							<input
								type="file"
								ref={fileInputRef}
								style={{ display: 'none' }}
								onChange={handleFileInputChange}
							/>

							{
								dayFiles.map((item, index) => {

									return <div
										key={index} className="file clickable"
										style={{
											backgroundImage: `url(https://acolmenero.com/calendar/${item.filename})`
										}}
										onClick={() => {
											setSelectedFile(item)
										}}
									>

									</div>
								})
							}


						</div>

					</div>

				</div>
			}



			{
				selectedFile
				&&
				<div className="panel">
					<div className="">
						<div className="preview-header bg-dark text-light p-1">
							<div className="d-flex justify-content-between px-1">
								<i
									className="bi bi-trash2 clickable"
									onClick={() => {
										deleteFile(selectedFile);
									}}
								></i>
								<i
									className="bi bi-x-lg clickable"
									onClick={() => {
										setSelectedFile(undefined);
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

		</div>

	);
};

export default Calendar;


{/* <div id="calendar-group">

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

</div>  */}