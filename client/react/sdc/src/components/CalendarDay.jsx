import React, { useState, useRef } from "react";
import loading_path from "./loading.gif";
import imageCompression from 'browser-image-compression';

import "./calendar-frame.css";

var textareTimeout = undefined;
const API_HOST = process.env.REACT_APP_API_HOST || "acolmenero.com";

const getDate = (dateObj) => {
	return `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
}
const getFullDate = (dateObj) => {
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

	// Get the Spanish month name
	const spanishMonth = monthNames[dateObj.month - 1];

	// Format the date string
	return `${dateObj.day} de ${spanishMonth} de ${dateObj.year}`;
}


// const dayContent = 
var first_fetch = false;

function CalendarDay({ selectedDay, calendarID, dayFiles, setDayFiles, fetchDaysFile, loadingContent, fetchDayFiles, loadingFile, setLoadingFile, setSelectedDay, setSelectedFile, textareaValue, setTextareaValue, loadingDaysFiles, setLoadingDaysFiles }) {

	console.log("Reloading CalendarDay: ", textareaValue);

	const [loadingUpdate, setLoadingUpdate] = useState(false);
	const [synchronized, setSynchronized] = useState(true);



	const fileInputRef = useRef(null);

	if (!selectedDay) { return <div></div> }

	const handleFileButtonClick = () => {
		fileInputRef.current.click();
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
			console.log("return: ",data);


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
	const compressImage = async (imageFile) => {
		const options = {
			maxSizeMB: 1, // Maximum file size after compression
			maxWidthOrHeight: 600, // Maximum width or height of the image
			fileType: 'image/webp', // Convert to WebP format
		};
		const compressedBlob = await imageCompression(imageFile, options);
		return compressedBlob;
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
	const handleTextareaChange = (event) => {
		setTextareaValue(event.target.value);
		setSynchronized(false);

		if (textareTimeout !== undefined) {
			clearTimeout(textareTimeout);
		}

		textareTimeout = setTimeout(() => {
			updateDayContent(calendarID, current_date, textareaValue);
		}, 1000);
	};
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


	const date_text = getFullDate(selectedDay);
	const current_date = getDate(selectedDay);


	return (

		<div id="calendar-day" className="position-relative">


			{
				loadingContent
				&&
				<div className="panel-loading">
					<div className="loading">
						<img src={loading_path} alt="" />
					</div>
				</div>
			}

			<div className="h-100 w-100 text-center">

				<div className="h-100 flex-column">


					<div className="d-flex justify-content-between align-items-center position-relative">
						<div
							className="loading-gap clickable"
							onClick={() => {
								setSelectedDay(undefined);
								setTextareaValue("");
								setDayFiles([]);
							}}
						>
							<i className="bi bi-x-lg text-light"></i>
						</div>
						<h2 className="mt-2 fs-6">{date_text}</h2>
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
					</div>

					<textarea
						value={textareaValue}
						className="flex-1"
						onChange={handleTextareaChange}
					></textarea>

					<div className="files">

						<div
							className="file text-light p-1"
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
								// console.log(item.filename);
								
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

		</div>

	);
}

export default CalendarDay;
