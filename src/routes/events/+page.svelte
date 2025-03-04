<script>
	// @ts-nocheck  // Prevent type errors (For now)

	import { supabase } from '$lib/supabase.js';
	// Get data returned during page load
	export let data;

	// Get initial data
	let trolleys = data.trolleys;
	let events = data.trolley_events;

	// Request Supabase to select * from trolley_events where trolley_id = filter_id
	async function filterByTrolley(filter_id = '') {
		// A variable for Supabase result
		let filtered = [];

		// If filter_id is set, fetch matching events
		if (filter_id) {
			filtered = await supabase.from('trolley_events').select('*').eq('trolley_id', filter_id);
		} 
		// If no filter is set, fetch all events
		else {
			filtered = await supabase.from('trolley_events').select('*');
		}

		// Set events to the filtered data
		events = filtered.data;
	}
</script>
<!-- The HTML content of the page -->

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
				<button on:click={() => filterByTrolley('')} class="list-group-item list-group-item-action">
					All Trolleys
				</button>

				{#each trolleys as trolley}
					<button
						on:click={() => filterByTrolley(trolley.trolley_id)}
						class="list-group-item list-group-item-action"
					>
						{trolley.trolley_id} - {trolley.status}
					</button>
				{/each}
			</div>
		</div>
		<!-- End trolley col -->
		<div class="col-sm-10">
			<!-- Page Body Right Side (Content goes here) -->
			<div id="events">
				<table class="table table-striped table-bordered table-hover">
					<thead>
						<tr>
							<th>ID</th>
							<th>Trolley ID</th>
							<th>Status</th>
							<th>Size</th>
							<th>Location</th>
							<th>Reported By</th>
							<th>Timestamp</th>
						</tr>
					</thead>
					<tbody>
						{#each events as event}
							<tr>
								<td>{event.id}</td>
								<td>{event.trolley_id}</td>
								<td>{event.status}</td>
								<td>{event.trolley_size}</td>
								<td>{event.location}</td>
								<td>{event.reported_by}</td>
								<td>{new Date(event.timestamp).toLocaleString()}</td>
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
