import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CodeIcon from '@mui/icons-material/Code';
import DescriptionIcon from '@mui/icons-material/Description';
import HubIcon from '@mui/icons-material/Hub';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import StorageIcon from '@mui/icons-material/Storage';
import { api, DatasetItem, SnippetItem, WorkspaceItem } from '../../services/api';

export const WorkspacePage: React.FC = () => {
  const [subTab, setSubTab] = useState('datasets');
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>([]);
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [snippets, setSnippets] = useState<SnippetItem[]>([]);

  useEffect(() => {
    api.getWorkspaces().then((ws) => {
      setWorkspaces(ws);
      if (ws.length > 0) {
        api.getWorkspaceDatasets(ws[0].slug).then(setDatasets);
        api.getWorkspaceSnippets(ws[0].slug).then(setSnippets);
      }
    });
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 } }}>
      {/* Workspace Header Card */}
      <Card sx={{ p: 3, mb: 3, bgcolor: '#111827', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <StorageIcon sx={{ color: '#38bdf8', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {workspaces[0]?.name || 'Pan-Cancer WES Cohort'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                {workspaces[0]?.description || 'Somatic mutation calling across 200 tumor-normal pairs.'}
              </Typography>
            </Box>
          </Box>
          <Button variant="contained" startIcon={<CloudUploadIcon />} sx={{ bgcolor: '#38bdf8', color: '#090d16', fontWeight: 700 }}>
            Upload Dataset
          </Button>
        </Box>

        {/* Sub Navigation */}
        <Tabs
          value={subTab}
          onChange={(_, v) => setSubTab(v)}
          sx={{ mt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <Tab icon={<FolderIcon sx={{ fontSize: 18 }} />} iconPosition="start" label={`Datasets (${datasets.length})`} value="datasets" />
          <Tab icon={<CodeIcon sx={{ fontSize: 18 }} />} iconPosition="start" label={`Code Snippets (${snippets.length})`} value="snippets" />
          <Tab icon={<HubIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Pipelines (3)" value="pipelines" />
          <Tab icon={<DescriptionIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Collaborative Paper Draft" value="papers" />
        </Tabs>
      </Card>

      {/* Datasets View */}
      {subTab === 'datasets' && (
        <Card sx={{ p: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ '& th': { color: '#94a3b8', fontWeight: 700, borderColor: 'rgba(255, 255, 255, 0.06)' } }}>
                  <TableCell>DATASET NAME</TableCell>
                  <TableCell>FORMAT</TableCell>
                  <TableCell>STORAGE URI</TableCell>
                  <TableCell>SIZE</TableCell>
                  <TableCell>REGISTERED</TableCell>
                  <TableCell align="right">ACTION</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {datasets.map((d) => (
                  <TableRow key={d.id} sx={{ '& td': { borderColor: 'rgba(255, 255, 255, 0.04)' } }}>
                    <TableCell sx={{ fontWeight: 600, color: '#f8fafc' }}>
                      {d.name}
                    </TableCell>
                    <TableCell>
                      <Chip label={d.format} size="small" color={d.format === 'BAM' ? 'info' : d.format === 'FASTQ' ? 'success' : 'secondary'} />
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#a5b4fc' }}>
                      {d.storage_uri}
                    </TableCell>
                    <TableCell sx={{ color: '#cbd5e1' }}>
                      {formatBytes(d.file_size_bytes)}
                    </TableCell>
                    <TableCell sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                      {d.created_at}
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="outlined" sx={{ fontSize: '0.75rem' }}>
                        Attach to Run
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Snippets View */}
      {subTab === 'snippets' && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
          {snippets.map((sn) => (
            <Card key={sn.id} sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#38bdf8' }}>
                  {sn.title}
                </Typography>
                <Chip label={sn.language} size="small" sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)' }} />
              </Box>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                {sn.description}
              </Typography>
              <Box sx={{ p: 1.5, bgcolor: '#030712', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.8rem', color: '#38bdf8', overflowX: 'auto' }}>
                {sn.code}
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {/* Pipelines Subtab */}
      {subTab === 'pipelines' && (
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            3 Active Workspace Pipelines
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
            Pipelines cloned or forked into this project workspace.
          </Typography>
          <Stack spacing={1.5} sx={{ maxWidth: 600, mx: 'auto', textAlign: 'left' }}>
            <Box sx={{ p: 2, bgcolor: '#1e293b', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>GATK4 Germline SNPs & Indels</Typography>
              <Chip label="Nextflow DSL2" size="small" color="primary" />
            </Box>
            <Box sx={{ p: 2, bgcolor: '#1e293b', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>nf-core/rnaseq</Typography>
              <Chip label="Nextflow DSL2" size="small" color="primary" />
            </Box>
          </Stack>
        </Card>
      )}

      {/* Collaborative Paper Draft Subtab */}
      {subTab === 'papers' && (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Methods Draft: Whole Exome Sequencing in Glioblastoma
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
            Collaborative markdown draft shared with Dr. Maria Garcia (Wellcome Sanger).
          </Typography>
          <Box sx={{ p: 2.5, bgcolor: '#0b0f19', borderRadius: 2, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.8 }}>
              "Paired-end exome sequencing libraries were aligned to the GRCh38 human reference genome using BWA-MEM2 (v2.2.1). Duplicate reads were marked using Picard Tools. Germline short variant discovery was performed following GATK4 Best Practices (v4.5.0) using HaplotypeCaller in ERC GVCF mode..."
            </Typography>
          </Box>
        </Card>
      )}
    </Box>
  );
};
