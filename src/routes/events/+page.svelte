<script>
	// @ts-nocheck
	
		// import the client instance (created earlier)
		import * as db from '$lib/data_access.js';
		import { format_timestamp } from '$lib/utilities.js';
	
		// import writable stores
		// used here to make the trolley events list 'reactive' to support sorting 
		import { writable } from 'svelte/store';
	
		// get data returned during page load
		export let data;
	
		// get data
		let trolleys = data.trolleys;
	
		let search_text = '';
	
		// make events a 'store' (for reactivity when sorting)
		// use spread operator (...) to add each event to the events 'store'
		let events = writable([...data.trolley_events]);
	
	
	  // Request Supabase to select * from trolley_events where trolley_id = filter_id
	  async function filterByTrolley(filter_id = '') {
	
		// a variable for supabase result
		let filtered_events = [];
	
		// if filter_id is set, fetch matching events
		// SELECT * FROM trolley_events WHERE trolley_id = filter_id
		if (filter_id) {
			filtered_events = await db.get_events_by_trolley_id(filter_id);
	
		} else {
		  // if filter_id is empty, get all events
		  filtered_events = await db.get_all_trolley_events();
		}
		console.log(filtered_events);
		// set events to the filtered data
		$events = filtered_events;
	  }
	
	// Handle search button event
	 async function search_events() {
	
		if (search_text =='') {
			alert(`Invalid search`);
			return false;
		}
		const result = await db.search_events(search_text);


	
		$events = result;
	}
	
	// Handle delete button event
	async function delete_event(id = 0) {
	
		if (isNaN(id)) {
			alert(`Cannot delete event with invalid ID`);
			return false;
		}
	
		if (confirm(`Permanently deleting event with ID= ${id}\n\nAre you sure?`)) {
			const result = await db.delete_trolley_event_by_id(id);
			alert(`Event with id ${id} deleted`);
		}
		return true;
	}
	
	// Keep track of sort directions for each col
	const table_sort = {
		id: false,
		timestamp: false,
		trolley_id: false,
		status: false,
		location: false
	};
	
	// Get events sorted based on a given column
	async function sort_by_col(col) { 
	
		let db_sort_col = col;
		
		// Reverse current sort direction for this col
		// i.e. reverse the current order
		table_sort[col] = !table_sort[col];
	
		const sorted = await db.get_all_trolley_events(db_sort_col, table_sort[col]);
	
		$events = sorted;
	
		// Output to the browser console
		console.log(`${col} : ${table_sort[col]}`);
	
	};
	
	</script>
	
	<!-- The HTML content of the page-->
	
	<div class="container">
		<div class="row">
			<!-- Page Header -->
			<h2 class="mt-5">Trolley Events Log</h2>
		</div>
		<div class="row">
			<div class="col-sm-2">
				<!-- Page Body Left Column (menu) -->
				<div id="trolleys" class="list-group">
					<!-- Trolley links -->
					<button on:click={filterByTrolley} class="list-group-item list-group-item-action"> All Trolleys </button>
					{#each trolleys as trolley}
						<button on:click={()=> {filterByTrolley(trolley.trolley_id)}} class="list-group-item list-group-item-action">
							{trolley.trolley_id} - {trolley.status}
						</button>
					{/each}
				</div>
			</div>
			<!-- End trolley col -->
			<div class="col-sm-10">
				<!-- Page Body Right Side (Content goes here) -->
	
				<!-- Search box -->
				<form>
					<div class="row m-4">
						<div class="col-md-4 d-flex">
						<input type="text" bind:value={search_text} class="form-control" name="search" placeholder="Search Trolley Events" />
						</div>
						<!-- Submit button -->
						<div class="col-md-1">
							<button on:click={search_events} class="btn btn-primary">Search</button>
						</div>
					</div>
				</form>
	
				<div id="events">
					<table class="table table-striped table-bordered table-hover">
						<thead>
							<tr>
								<th class="click-text" on:click={() => sort_by_col('id')}><i class={ table_sort['id'] ? 'bi bi-sort-down' : 'bi bi-sort-up'}></i>ID</th>
								<th class="click-text" on:click={() => sort_by_col('timestamp')}><i class={ table_sort['timestamp'] ? 'bi bi-sort-down' : 'bi bi-sort-up'}></i>Time</th>
								<th class="click-text" on:click={() => sort_by_col('trolley_id')}><i class={ table_sort['trolley_id'] ? 'bi bi-sort-down' : 'bi bi-sort-up'}></i>Trolley ID</th>
								<th class="click-text" on:click={() => sort_by_col('status')}><i class={ table_sort['status'] ? 'bi bi-sort-down' : 'bi bi-sort-up'}></i>Status</th>
								<th>Size</th>
								<th>Location</th>
								<th>Reported By</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							<!-- Note use of $events -->
							{#each $events as event}
								<tr>
									<td><a href="/event_details/{event.id}">{event.id}</a></td>
									<td>{format_timestamp(event.timestamp)}</td>
									<td>{event.trolley_id}</td>
									<td>{event.status}</td>
									<td>{event.trolley_size}</td>
									<td>{event.location}</td>
									<td>{event.reported_by}</td>
									<td>
										<button
											on:click={() => delete_event(event.id)}
											class="btn btn-sm btn-outline-danger">
											<span class="bi bi-trash" />
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
			<!-- End events col -->
		</div>
		<!-- End Row -->
	</div>
	<!-- End Main Content-->
	