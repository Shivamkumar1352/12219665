import React, { useState } from 'react'
import {
  Container, Typography, TextField, Button, Grid, Box
} from '@mui/material'
import { createShortUrl } from '../api'

export default function Home() {
  const [urls, setUrls] = useState([{ url: '', validity: '', shortcode: '' }])
  const [results, setResults] = useState([])

  const handleChange = (i, field, value) => {
    const newUrls = [...urls]
    newUrls[i][field] = value
    setUrls(newUrls)
  }

  const handleSubmit = async () => {
    const resArr = []
    for (let i = 0; i < urls.length; i++) {
      try {
        const { data } = await createShortUrl(urls[i])
        resArr.push({ ...data, original: urls[i].url })
      } catch (err) {
        resArr.push({ error: true, message: err.response?.data?.message || 'Failed', original: urls[i].url })
      }
    }
    setResults(resArr)
  }

  const addField = () => {
    if (urls.length < 5) setUrls([...urls, { url: '', validity: '', shortcode: '' }])
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>URL Shortener</Typography>
      {urls.map((urlObj, i) => (
        <Box key={i} mb={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Long URL" value={urlObj.url}
                onChange={(e) => handleChange(i, 'url', e.target.value)}
              />
            </Grid>
            <Grid item xs={3} sm={2}>
              <TextField
                fullWidth label="Validity (min)" value={urlObj.validity}
                onChange={(e) => handleChange(i, 'validity', e.target.value)}
              />
            </Grid>
            <Grid item xs={3} sm={4}>
              <TextField
                fullWidth label="Custom Shortcode" value={urlObj.shortcode}
                onChange={(e) => handleChange(i, 'shortcode', e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>
      ))}
      <Button variant="contained" onClick={addField} disabled={urls.length >= 5}>
        Add URL
      </Button>
      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ ml: 2 }}>
        Shorten
      </Button>

      <Box mt={4}>
        <Typography variant="h6">Results</Typography>
        {results.map((res, idx) => (
          <Box key={idx} p={2} border="1px solid #ccc" my={1}>
            <Typography>Original: {res.original}</Typography>
            {res.error ? (
              <Typography color="error">Error: {res.message}</Typography>
            ) : (
              <>
                <Typography>Shortened: {res.shortLink}</Typography>
                <Typography>Expires At: {res.expiry}</Typography>
              </>
            )}
          </Box>
        ))}
      </Box>
    </Container>
  )
}
