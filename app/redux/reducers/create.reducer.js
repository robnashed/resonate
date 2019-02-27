import Spotify from "rn-spotify-sdk";

export const SEARCH = 'create/SEARCH';
export const SEARCH_SUCCESS = 'create/SEARCH_SUCCESS';
export const SEARCH_FAIL = 'create/SEARCH_FAIL';

export const INIT = 'spotify/INIT';
export const INIT_SUCCESS = 'spotify/INIT_SUCCESS';
export const INIT_FAIL = 'spotify/INIT_FAIL';

export const SET_MOOD = 'create/SET_MOOD';

export const SET_LISTS = 'create/SET_LISTS';

defaultState = {
  loading: false,
  searchResults: [],
  trackQueue: [],
  term: "",
  init: false,
  moodColor: "#ffffff",
  moodCoordinates: {
    x: 0,
    y: 0
  }
}

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case SEARCH:
      return { ...state, loading: true, term: action.term, searchResults: [] };
    case SEARCH_SUCCESS:
      if (state.term == action.term) {
        return { ...state, loading: false, searchResults: action.results };
      } else {
        return { ...state, loading: false, searchResults: [] };
      }
    case INIT_SUCCESS:
      return { ...state, init: true};
    case SET_LISTS:
      return {...state, searchResults: action.searchResults, trackQueue: action.trackQueue}
    case SEARCH_FAIL:
      return {
        ...state,
        loading: false
      };
    case SET_MOOD:
      return {...state, moodColor: action.color, moodCoordinates: action.coordinates}
    default:
      return state;
  }
}

function setSearchTerm(term) {
  return {
    type: SEARCH,
    term: term
  }
}

export function receiveResults(results, term) {
  return {
    type: SEARCH_SUCCESS,
    term: term,
    results: results
  }
}

export function setMood(color, coordinates) {
  return {
    type: SET_MOOD,
    color: color,
    coordinates: coordinates
  }
}


export function initSpotify() {
  const spotifyOptions = {
    "clientID":"dcd8765def1247768928a9a0887e625e",
    "redirectURL":"http://resonate.openode.io/callback",
    "scopes":["user-read-private", "playlist-read", "playlist-read-private", "streaming"],
    "tokenSwapURL":"http://resonate.openode.io/api/token/swap",
    "tokenRefreshURL":"http://resonate.openode.io/api/token/refresh"
  };
  const loggedIn = Spotify.initialize(spotifyOptions);
  Spotify.login();

  return {
    type: INIT_SUCCESS
  }
}

export function dragItem (searchRes, queue, index, offset, fromSearch) {
  if (fromSearch) {
    item = searchRes.splice(index, 1);
    queue.splice(offset, 0, item[0]);

  } else {
    item = queue.splice(index, 1);
    searchRes.splice(offset, 0, item[0]);
  }
  return {
    type: SET_LISTS,
    searchResults: searchRes,
    trackQueue: queue
  }
}

export const searchTrack = (term) => (dispatch, getState) => {
  dispatch(setSearchTerm(term));
  // search for query
  let trackQueue = getState().create.trackQueue;
  Spotify.search( term,["track"]).then( res => {
    // PARSE DATA
    let data = []
    for (item of res.tracks.items) {
      var found = trackQueue.some(function (el) {
        console.log(el.spotify_id);
        console.log(item.id)
        return el.spotify_id === item.id;
      });
  
      if (found) {
        continue;
      }

      let itemData = { artists: []}
      for (artist of item.artists) {
        itemData.artists.push(artist.name);
      }
      itemData.title = item.name;
      itemData.album = item.album.name;
      itemData.image_url = item.album.images[0].url;
      itemData.spotify_id = item.id;
      itemData.duration = item.duration_ms;
      
      data.push(itemData);
    }

    dispatch(receiveResults(data, term));
  }).catch(err=> console.log("ERROR: ", err))
}