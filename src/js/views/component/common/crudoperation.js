import axios from 'axios';

const urlPrefix = 'https://omdbapi.com/?apikey=b20d079f&type=movie'
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
const crudOperation = axios.create({
    baseURL: urlPrefix,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});
const getEvent = url => crudOperation.get(url);
module.exports = {
    getEvent
};
