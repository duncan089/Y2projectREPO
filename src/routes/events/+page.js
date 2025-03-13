// import the client instance (created earlier)
import * as db from '$lib/data_access.js';

// The load function is executed when the page is loaded
// Here it is used to get data for display
export async function load({ fetch, params }) {

	// get all trolleys
	const trolleys = await db.get_all_trolleys();

	// get all trolley events
	const trolley_events = await db.get_all_trolley_events();

	console.log(trolley_events);
  
	// return data to page
	if (trolleys && trolley_events) {
		return {
			trolleys: trolleys,
			trolley_events: trolley_events
		};
	}

	// in case of error - return status code and message
	return {
		error: 'error occurred'
	};
}
