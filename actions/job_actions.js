import axios from 'axios';
import reverseGeocode from 'latlng-to-zip';
import qs from 'qs';

import {
    FETCH_JOBS,
    LIKE_JOB,
    CLEAR_LIKED_JOBS
} from './types';

const JOB_ROOT_URL = 'http://api.indeed.com/ads/apisearch?';
// radius in miles
const JOB_QUERY_PARAMS = {
  publisher: '4201738803816157',
  format: 'json',
  v: '2',
  latlong: 1,
  radius: 10,
  q: 'data scientist'
};

// this helper function will take the zip and add it to the url
const buildJobsUrl = (zip) => {
    const query = qs.stringify({...JOB_QUERY_PARAMS, l:zip});
    // add the query to the end of the root url
    return `${JOB_ROOT_URL}${query}`;
};

export const fetchJobs = (region, callback) => async (dispatch) => {
    // Using this action is asynchronous (fetching data), so use async-await
    try {
        let zip = await reverseGeocode(region);
        const url = buildJobsUrl(zip);
        let { data } = await axios.get(url);
        dispatch({ type: FETCH_JOBS, payload: data });
        callback();
        console.log(data);
    } catch(e) {
        console.error(e);
    }
};

export const likeJob = (job) => {
    return {
        payload: job,
        type: LIKE_JOB
    };
};

export const clearLikedJobs = () => {
    return {
        type: CLEAR_LIKED_JOBS
    };
};