import axios from 'axios'

const BASE_URL = 'http://localhost:5000'

export const createShortUrl = async (data) => {
  return axios.post(`${BASE_URL}/shorturls`, data)
}

export const getStats = async (shortcode) => {
  return axios.get(`${BASE_URL}/shorturls/${shortcode}`)
}
