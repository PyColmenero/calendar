import React, { useState, useEffect } from "react";
import "./calendar.css";
import loading_path from "./loading.gif";

const API_HOST = process.env.REACT_APP_API_HOST || "acolmenero.com";
const API_PORT = process.env.REACT_APP_API_PORT || "5000";

const CalendarList = () => {
	const [calendars, setCalendars] = useState(undefined);
	const [name, setName] = useState("");
	const [showAddCalendar, setShowAddCalendar] = useState(false);
	const [description, setDescription] = useState("");
	const [loading_delete, setLoadingDelete] = useState(-1);
	const [loading_create, setLoadingCreate] = useState(false);

	const fetchCalendars = async () => {
		try {
			const response = await fetch(
				`https://${API_HOST}/calendar/php/Calendar.php`,
				{
					method: 'GET',
					mode: 'cors',
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
			const data = await response.json();
			setCalendars(data);

			setShowAddCalendar(false);
			setLoadingCreate(false);
		} catch (error) {
			console.error("Error fetching calendars:", error);
		}
	};

	const createCalendar = async () => {
		setLoadingCreate(true);
		try {
			const url = `https://${API_HOST}/calendar/php/Calendar.php`;
			console.log(url);
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name, description })
			});

			if (response.ok) {
				setName("");
				setDescription("");

				fetchCalendars();
			} else {
				console.error("Error creating calendar");
			}
		} catch (error) {
			console.error("Error creating calendar:", error);
		}
	};

	// const updateCalendar = async (id, newName, newDescription) => {
	// 	try {
	// 		const response = await fetch(
	// 			`http://${API_HOST}:${API_PORT}/calendar/${id}`,
	// 			{
	// 				method: "PUT",
	// 				headers: {
	// 					"Content-Type": "application/json",
	// 				},
	// 				body: JSON.stringify({ name: newName, description: newDescription }),
	// 			}
	// 		);

	// 		if (response.ok) {
	// 			fetchCalendars();
	// 		} else {
	// 			console.error("Error updating calendar");
	// 		}
	// 	} catch (error) {
	// 		console.error("Error updating calendar:", error);
	// 	}
	// };

	const deleteCalendar = async (id) => {
		setLoadingDelete(id);
		try {
			const url = `https://${API_HOST}/calendar/php/Calendar.php?id=${id}`;
			console.log("url", url);
			const response = await fetch(
				url,
				{
					method: "DELETE",
					body: JSON.stringify({ id })
				}
			);

			if (response.ok) {
				fetchCalendars();
			} else {
				console.error("Error deleting calendar");
			}
		} catch (error) {
			console.error("Error deleting calendar:", error);
		}
	};

	useEffect(() => {
		fetchCalendars();
	}, []);

	return (
		<div className="container">
			<div className="p-3" id="main">
				{calendars === undefined && (
					<div className="panel-loading">
						<div className="loading">
							<img src={loading_path} alt="" />
						</div>
					</div>
				)}

				{showAddCalendar && (
					<div className="panel">
						<div className="panel-inner position-relative">
							<div className="">
								<h2 className="mb-4">Create Calendar</h2>
								<input
									type="text"
									className="form-control mb-1"
									placeholder="Name"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
								<input
									type="text"
									className="form-control mb-1"
									placeholder="Description"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
								/>

								<div className="d-flex mt-3">
									<button
										className="btn btn-danger"
										onClick={() => {
											setShowAddCalendar(false);
										}}
									>
										<i className="bi bi-x-lg"></i>
									</button>
									<button
										className="btn btn-primary w-100 ms-1"
										onClick={createCalendar}
									>
										{loading_create && (
											<div className="panel-loading">
												<div className="loading">
													<img src={loading_path} alt="" />
												</div>
											</div>
										)}
										Crear
									</button>
								</div>
							</div>
						</div>
					</div>
				)}

				<div className="pt-4">
					<div>
						{calendars !== undefined && (
							<div className="">
								{calendars.length === 0 ? (
									<p>No hay calendarios.</p>
								) : (
									calendars.map((calendar) => (
										<div className="card mb-2" key={calendar.id}>
											<div className="card-body d-flex justify-content-between">

												<a href={"/calendar/v/" + calendar.id}>
													<div
														className="w-100"

													>
														<h3>{calendar.name}</h3>
														<p className="info-description">
															{calendar.description}
														</p>
													</div>
												</a>

												{/* <button
												onClick={() => deleteCalendar(calendar.id)}
												className="btn btn-danger position-relative"
											>
												{loading_delete === calendar.id && (
													<div className="panel">
														<div className="loading">
															<img src={loading_path} alt="" />
														</div>
													</div>
												)}

												<i className="bi bi-x-lg"></i>
											</button> */}
											</div>
										</div>
									))
								)}
							</div>
						)}

						<div
							className="card mb-2"
							onClick={() => {
								setShowAddCalendar(true);
							}}
						>
							<div className="card-body d-flex align-items-center text-center justify-content-center py-1 clickable">
								<i className="bi bi-plus-lg text-success fs-1"></i>
							</div>
						</div>
					</div>
				</div>
			</div> 
		</div>
	);
};

export default CalendarList;
