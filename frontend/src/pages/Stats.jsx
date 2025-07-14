import React, { useState } from 'react'
import {
  Container, Typography, TextField, Button, Box
} from '@mui/material'
import { getStats } from '../api'

export default function Stats() {
  const [shortcode, setShortcode] = useState('')
  const [stats, setStats] = useState(null)

  const fetchStats = async () => {
    try {
      const { data } = await getStats(shortcode)
      setStats(data)
    } catch (e) {
      setStats({ error: true, message: 'Not Found or Invalid' })
    }
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>URL Stats</Typography>
      <TextField
        label="Enter Shortcode"
        fullWidth
        value={shortcode}
        onChange={(e) => setShortcode(e.target.value)}
      />
      <Button variant="contained" onClick={fetchStats} sx={{ mt: 2 }}>
        Get Stats
      </Button>

      {stats && (
        <Box mt={4}>
          {stats.error ? (
            <Typography color="error">{stats.message}</Typography>
          ) : (
            <>
              <Typography>Original URL: {stats.url}</Typography>
              <Typography>Total Clicks: {stats.clicks.length}</Typography>
              <Typography>Created At: {stats.createdAt}</Typography>
              <Typography>Expires At: {stats.expiry}</Typography>
              <Typography variant="h6" mt={2}>Click Details</Typography>
              {stats.clicks.map((click, i) => (
                <Box key={i} mb={1}>
                  <Typography>{click.timestamp} — {click.source} — {click.location}</Typography>
                </Box>
              ))}
            </>
          )}
        </Box>
      )}
    </Container>
  )
}
