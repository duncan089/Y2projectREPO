// @ts-nocheck

/* Useful links and guides for building Supabase queries

*** IMPORTANT: Read the API docs for your database in the Supabase dashboard ***

select:         https://www.restack.io/docs/supabase-knowledge-supabase-api-select-guide#clpx3g95y0g2xvh0vwuz164y1

where:          https://www.restack.io/docs/supabase-knowledge-supabase-client-raw-sql-guide

1-to-m/ m-to-m: https://www.restack.io/docs/supabase-knowledge-supabase-nested-query-guide
                https://github.com/orgs/supabase/discussions/7958

filter queries: https://supabase.com/docs/reference/javascript/filter
                https://www.restack.io/docs/supabase-knowledge-supabase-filter-guide

sort:           https://www.restack.io/docs/supabase-knowledge-supabase-select-sort-guide#clpzufwv80mklvh0v4bcbkn5f
                https://stackoverflow.com/questions/77049329/how-to-order-by-multiple-columns-in-supabase

ilike :         https://github.com/orgs/supabase/discussions/6778      
*/

// Use the queries below as templates for your project

// import supabase client
import { supabase } from './supabase.js';

// Get all trolleys via Supabase API
export async function get_all_trolleys() {
	const result = await supabase
		.from('trolley')
		.select('*')
		.order('id', { ascending: true });

    // log errors
    if (result.error) {
        console.log(`get all trolleys error: ${result.error}`);
    }

    // return data
    return result.data;
}

// Get all trolley events via Supabase API
export async function get_all_trolley_events(order_col = 'timestamp', order_dir = true) {
	const result = await supabase
		.from('trolley_events')
        // select trolley_id from trolley table - requires valid one-many setup  
		.select('*, trolley(trolley_id)')
		.order(order_col, { ascending: order_dir });

    // log errors
    if (result.error) {
        console.log(`get all trolley events error: ${result.error}`);
    }

    // return data
    return result.data;
}

// Get all events by trolley_id via Supabase API
export async function get_events_by_trolley_id(trolley_id) {
    const result = await supabase
		.from('trolley_events')
        // select trolley_id from trolley table - requires valid one-many setup  
		.select('*, trolley(trolley_id)')
        .eq('trolley_id', trolley_id)
		.order('timestamp', { ascending: true });

    // log errors
    if (result.error) {
        console.log(`get all trolley events error: ${result.error}`);
    }

    // return data
    return result.data;
}

// Delete trolley event - no data returned by Supabase
export async function delete_event_by_id(event_id) {
    const result = await supabase
		.from('trolley_events')
        // delete the trolley event by ID
		.delete()
        .eq('id', event_id);

    // log errors
    if (result.error) {
        console.log(`delete trolley event error: ${result.error}`);
        return false;
    }

    // no error
    return true;
}

// Search trolley events
// uses .or and ilike to search multiple columns
export async function search_events(search_text) {
    const result = await supabase
		.from('trolley_events')
        // select trolley_id from trolley table - requires valid one-many setup  
		.select('*, trolley(trolley_id)')
        .or(`status.ilike.%${search_text}%,location.ilike.%${search_text}%`)
		.order('timestamp', { ascending: true });

    // log errors
    if (result.error) {
        console.log(`search trolley events error: ${result.error}`);
    }

    // return data
    return result.data;
}

// Get details for a single trolley event by ID
export async function get_event_by_id(id) {
    const result = await supabase
		.from('trolley_events')
        // select trolley_id from trolley table - requires valid one-many setup  
		.select('*, trolley(*)')
        .eq('id', id);

    // log errors
    if (result.error) {
        console.log(`get trolley event error: ${result.error}`);
    }

    // return data
    return result.data;
}
