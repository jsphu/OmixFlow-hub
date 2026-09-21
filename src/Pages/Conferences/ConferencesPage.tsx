import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Chip,
  Button,
  Stack,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { api, ConferenceItem } from '../../services/api';

export const ConferencesPage: React.FC = () => {
  const [conferences, setConferences] = useState<ConferenceItem[]>([]);

  useEffect(() => {
    api.getConferences().then(setConferences);
  }, []);

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 4, textAlign: 'center', py: 2 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
          Bioinformatics <span className="gradient-text">Conference Radar</span>
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#94a3b8' }}>
          Global meeting calendar, abstract submission deadlines, and workflow symposium tracks.
        </Typography>
      </Box>

      <Stack spacing={3}>
        {conferences.map((conf) => (
          <Card key={conf.id} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', gap: 2 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Chip label={conf.acronym} color="secondary" sx={{ fontWeight: 800 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                    {conf.title}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={3} sx={{ color: '#94a3b8', my: 1.5, flexWrap: 'wrap', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EventIcon sx={{ fontSize: 18, color: '#38bdf8' }} />
                    <Typography variant="body2">{conf.start_date} – {conf.end_date}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOnIcon sx={{ fontSize: 18, color: '#818cf8' }} />
                    <Typography variant="body2">{conf.location}</Typography>
                  </Box>
                  {conf.abstract_deadline && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                      <Typography variant="body2" sx={{ color: '#f59e0b', fontWeight: 600 }}>
                        Abstract Deadline: {conf.abstract_deadline}
                      </Typography>
                    </Box>
                  )}
                </Stack>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mt: 2 }}>
                  {conf.topics.map((t) => (
                    <Chip key={t} label={t} size="small" sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1' }} />
                  ))}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  endIcon={<OpenInNewIcon />}
                  component="a"
                  href={conf.website_url}
                  target="_blank"
                  sx={{ borderColor: '#818cf8', color: '#818cf8', fontWeight: 600, minWidth: 160 }}
                >
                  Conference Site
                </Button>
              </Box>
            </Box>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};
