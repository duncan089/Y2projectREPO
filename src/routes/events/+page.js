// Import the client instance (created earlier)
import { supabase } from '$lib/supabase.js';

// The load function is executed when the page is loaded
// Here it is used to get data for display
export async function load({ fetch, params }) {
    // Request Supabase client to select * from trolleys
    const trolleys = await supabase.from('trolley').select('*');

    // Request Supabase client to select * from trolley_events
    const trolley_events = await supabase.from('trolley_events').select('*');

    // Return data
    if (trolleys && trolley_events) {
        return {
            trolleys: trolleys.data,
            trolley_events: trolley_events.data
        };
    }

    // In case of error - return status code and message
    return {
        error: 'Error occurred while fetching data'
    };
}

