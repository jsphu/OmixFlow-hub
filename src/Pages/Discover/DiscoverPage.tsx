import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  IconButton,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import GitHubIcon from '@mui/icons-material/GitHub';
import HubIcon from '@mui/icons-material/Hub';
import TerminalIcon from '@mui/icons-material/Terminal';
import ChatIcon from '@mui/icons-material/Chat';
import ScienceIcon from '@mui/icons-material/Science';
import { api, WorkflowSummary, ComponentDetail } from '../../services/api';

const TOPIC_FILTERS = ['All', 'RNA-seq', 'WGS', 'Variant Calling', 'Single-Cell', 'Metagenomics', 'GATK4'];
const FORMAT_FILTERS = ['All', 'Nextflow DSL2', 'Snakemake', 'CWL'];

export const DiscoverPage: React.FC = () => {
  const [workflows, setWorkflows] = useState<WorkflowSummary[]>([]);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Discover:Item modal state
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowSummary | null>(null);
  const [activeDag, setActiveDag] = useState<any | null>(null);
  
  // Discover:Item:Item process modal state
  const [activeComponent, setActiveComponent] = useState<ComponentDetail | null>(null);
  const [componentComments, setComponentComments] = useState<string[]>([
    'Ensure JVM heap is capped to 85% of container RAM to avoid SIGKILL (137).',
    'Tested with GATK 4.5.0 on human chromosome 21 with identical concordance.',
  ]);
  const [newCompComment, setNewCompComment] = useState('');

  useEffect(() => {
    loadWorkflows();
  }, [selectedTopic, selectedFormat, searchQuery]);

  const loadWorkflows = async () => {
    const data = await api.getWorkflows(selectedTopic, selectedFormat, searchQuery);
    setWorkflows(data);
  };

  const handleStar = async (e: React.MouseEvent, slug: string) => {
    e.stopPropagation();
    const newCount = await api.starWorkflow(slug);
    setWorkflows(
      workflows.map((w) => (w.slug === slug ? { ...w, stars_count: newCount } : w))
    );
    if (activeWorkflow?.slug === slug) {
      setActiveWorkflow({ ...activeWorkflow, stars_count: newCount });
    }
  };

  const openWorkflowModal = async (wf: WorkflowSummary) => {
    setActiveWorkflow(wf);
    const dagData = await api.getWorkflowDag(wf.slug);
    setActiveDag(dagData);
  };

  const openProcessModal = async (compSummary: any) => {
    const detail = await api.getComponentDetail(compSummary.id || 'bwa');
    setActiveComponent(detail);
  };

  const handleAddProcessComment = () => {
    if (!newCompComment.trim()) return;
    setComponentComments([...componentComments, newCompComment.trim()]);
    setNewCompComment('');
  };

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto', p: { xs: 2, md: 3 } }}>
      {/* Header Banner */}
      <Box sx={{ mb: 4, textAlign: 'center', py: 2 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>
          Discover <span className="gradient-text">Bioinformatics Pipelines</span>
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#94a3b8', maxWidth: 640, mx: 'auto' }}>
          Decentralized pipeline registry indexed from GitHub, GitLab, and Zenodo. Explore, fork, inspect DAGs, or execute on your compute backend.
        </Typography>
      </Box>

      {/* Filter and Search Bar */}
      <Card sx={{ p: 2.5, mb: 4, bgcolor: 'rgba(17, 24, 39, 0.7)', backdropFilter: 'blur(12px)' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center', mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search pipelines by tool (samtools, bwa), assay (RNA-seq, WGS), or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Stack direction="row" spacing={1}>
            {FORMAT_FILTERS.map((fmt) => (
              <Chip
                key={fmt}
                label={fmt}
                clickable
                color={selectedFormat === fmt ? 'primary' : 'default'}
                onClick={() => setSelectedFormat(fmt)}
                sx={{ fontWeight: 600, fontSize: '0.8rem' }}
              />
            ))}
          </Stack>
        </Box>

        {/* Topic Pills */}
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {TOPIC_FILTERS.map((topic) => (
            <Chip
              key={topic}
              label={topic}
              clickable
              variant={selectedTopic === topic ? 'filled' : 'outlined'}
              color={selectedTopic === topic ? 'secondary' : 'default'}
              onClick={() => setSelectedTopic(topic)}
              size="small"
            />
          ))}
        </Stack>
      </Card>

      {/* Pipelines Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
        {workflows.map((wf) => (
          <Card
            key={wf.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              p: 2.5,
              '&:hover': { transform: 'translateY(-3px)' },
            }}
            onClick={() => openWorkflowModal(wf)}
          >
            <Box>
              {/* Header Badge */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Chip
                  label={wf.workflow_format}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(56, 189, 248, 0.12)',
                    color: '#38bdf8',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                  }}
                />
                <Button
                  size="small"
                  startIcon={<StarIcon sx={{ color: '#f59e0b', fontSize: 16 }} />}
                  onClick={(e) => handleStar(e, wf.slug)}
                  sx={{ color: '#f8fafc', fontWeight: 700, minWidth: 'auto', px: 1 }}
                >
                  {wf.stars_count}
                </Button>
              </Box>

              {/* Title & Description */}
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#f1f5f9', mb: 0.8 }}>
                {wf.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.5, mb: 2 }}>
                {wf.description.slice(0, 110)}...
              </Typography>

              {/* Topics */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mb: 2 }}>
                {wf.topics.slice(0, 3).map((topic) => (
                  <Chip
                    key={topic}
                    label={topic}
                    size="small"
                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', fontSize: '0.7rem', color: '#cbd5e1' }}
                  />
                ))}
              </Box>
            </Box>

            {/* Footer */}
            <Box sx={{ pt: 1.5, borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                {wf.latest_version_tag || 'v1.0.0'} • {wf.author_org?.name || 'Broad Institute'}
              </Typography>
              <Button size="small" variant="text" sx={{ color: '#38bdf8', fontWeight: 700 }}>
                Inspect DAG →
              </Button>
            </Box>
          </Card>
        ))}
      </Box>

      {/* =========================================================================
          DISCOVER:ITEM MODAL (PIPELINE DAG & REPRODUCIBILITY DETAILS)
          ========================================================================= */}
      <Dialog
        open={Boolean(activeWorkflow)}
        onClose={() => setActiveWorkflow(null)}
        maxWidth="lg"
        fullWidth
        slotProps={{ paper: { sx: { bgcolor: '#0b1120', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 3 } } }}
      >
        {activeWorkflow && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                    {activeWorkflow.name}
                  </Typography>
                  <Chip label={activeWorkflow.workflow_format} color="primary" size="small" sx={{ fontWeight: 700 }} />
                </Box>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  Maintained by {activeWorkflow.author_org?.name || 'Scientific Community'} • License: {activeWorkflow.license}
                </Typography>
              </Box>
              <IconButton onClick={() => setActiveWorkflow(null)} sx={{ color: '#94a3b8' }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              {/* Pipeline Description & External Links */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ color: '#cbd5e1', mb: 1.5 }}>
                  {activeWorkflow.description}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<GitHubIcon />}
                    component="a"
                    href={activeWorkflow.repository_url}
                    target="_blank"
                    sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: '#f8fafc' }}
                  >
                    View on GitHub
                  </Button>
                  {activeWorkflow.zenodo_doi && (
                    <Chip label={`DOI: ${activeWorkflow.zenodo_doi}`} sx={{ bgcolor: 'rgba(129, 140, 248, 0.15)', color: '#a5b4fc' }} />
                  )}
                  <Chip label={`★ ${activeWorkflow.stars_count} Stars`} sx={{ bgcolor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }} />
                </Stack>
              </Box>

              {/* ===================================================================
                  PIPELINE DAG CANVAS PREVIEW (CLICKABLE PROCESS NODES)
                  =================================================================== */}
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <HubIcon sx={{ color: '#38bdf8' }} /> Pipeline Architecture DAG
                <Typography variant="caption" sx={{ color: '#64748b', ml: 1 }}>
                  (Click any process node to view binaries, parameters, and peer comments)
                </Typography>
              </Typography>

              <Box
                sx={{
                  p: 3,
                  mb: 3,
                  bgcolor: '#0f172a',
                  borderRadius: 2,
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  position: 'relative',
                  overflowX: 'auto',
                }}
              >
                <Stack direction="row" spacing={4} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                  {(activeDag?.components || [
                    { id: 'bwa', name: 'BWA_MEM2', tool: 'bwa-mem2' },
                    { id: 'sort', name: 'SAMTOOLS_SORT', tool: 'samtools' },
                    { id: 'haplo', name: 'GATK_HAPLOTYPECALLER', tool: 'gatk4' },
                  ]).map((comp: any, idx: number, arr: any[]) => (
                    <React.Fragment key={comp.id || idx}>
                      <Card
                        sx={{
                          p: 2,
                          minWidth: 170,
                          textAlign: 'center',
                          bgcolor: '#1e293b',
                          borderColor: '#38bdf8',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            bgcolor: '#334155',
                            boxShadow: '0 0 16px rgba(56, 189, 248, 0.3)',
                          },
                        }}
                        onClick={() => openProcessModal(comp)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                          <ScienceIcon sx={{ fontSize: 16, color: '#38bdf8' }} />
                          <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 700 }}>
                            PROCESS {idx + 1}
                          </Typography>
                        </Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                          {comp.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.5 }}>
                          Binary: {comp.tool}
                        </Typography>
                      </Card>
                      {idx < arr.length - 1 && (
                        <Typography variant="h6" sx={{ color: '#38bdf8', fontWeight: 800 }}>
                          ➔
                        </Typography>
                      )}
                    </React.Fragment>
                  ))}
                </Stack>
              </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
              <Button startIcon={<ForkRightIcon />} variant="outlined" sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: '#cbd5e1' }}>
                Fork to Workspace
              </Button>
              <Stack direction="row" spacing={1.5}>
                <Button variant="contained" startIcon={<PlayArrowIcon />} sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}>
                  Run in OmixFlow Core
                </Button>
              </Stack>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* =========================================================================
          DISCOVER:ITEM:ITEM MODAL (PROCESS DEEP DIVE & PEER REVIEW THREAD)
          ========================================================================= */}
      <Dialog
        open={Boolean(activeComponent)}
        onClose={() => setActiveComponent(null)}
        maxWidth="md"
        fullWidth
        slotProps={{ paper: { sx: { bgcolor: '#090d16', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 3 } } }}
      >
        {activeComponent && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 700, letterSpacing: '0.05em' }}>
                  PROCESS DEEP DIVE (ITEM:ITEM)
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                  {activeComponent.name}
                </Typography>
              </Box>
              <IconButton onClick={() => setActiveComponent(null)} sx={{ color: '#94a3b8' }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              {/* Tool Specs & Container */}
              <Box sx={{ p: 2, mb: 2.5, bgcolor: '#111827', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 1.5 }}>
                  {activeComponent.description}
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>TOOL BINARY</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#38bdf8' }}>{activeComponent.tool_name} {activeComponent.tool_version}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>DIRECTIVES</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{activeComponent.directives?.cpus || 4} CPUs • {activeComponent.directives?.memory || '16GB RAM'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>BIOCONTAINER</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#a5b4fc', wordBreak: 'break-all' }}>
                      {activeComponent.container_image}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Execution Script Template */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TerminalIcon sx={{ fontSize: 18, color: '#38bdf8' }} /> Execution Script ({activeComponent.script_interpreter})
              </Typography>
              <Box sx={{ p: 2, mb: 2.5, bgcolor: '#030712', borderRadius: 2, fontFamily: 'monospace', fontSize: '0.85rem', color: '#38bdf8', overflowX: 'auto' }}>
                {activeComponent.script_template}
              </Box>

              {/* Channels (Inputs & Outputs) */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                I/O Channels ({activeComponent.ports?.length || 0})
              </Typography>
              <Stack spacing={1} sx={{ mb: 3 }}>
                {activeComponent.ports?.map((port) => (
                  <Box key={port.id} sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: '#111827', borderRadius: 1.5 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip label={port.port_type} size="small" color={port.port_type === 'INPUT' ? 'info' : 'success'} sx={{ height: 20, fontSize: '0.65rem' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{port.name}</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace' }}>{port.file_pattern || port.data_type}</Typography>
                  </Box>
                ))}
              </Stack>

              {/* Process-Level Peer Review Discourse */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1, color: '#818cf8' }}>
                <ChatIcon sx={{ fontSize: 18 }} /> Process Peer Review Discourse ({componentComments.length})
              </Typography>
              <Stack spacing={1.5} sx={{ mb: 2 }}>
                {componentComments.map((cmt, idx) => (
                  <Box key={idx} sx={{ p: 1.5, bgcolor: 'rgba(129, 140, 248, 0.06)', borderLeft: '3px solid #818cf8', borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ color: '#e2e8f0', fontSize: '0.85rem' }}>
                      {cmt}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Share a tuning tip or critique for this process..."
                  value={newCompComment}
                  onChange={(e) => setNewCompComment(e.target.value)}
                />
                <Button variant="contained" size="small" onClick={handleAddProcessComment}>
                  Post
                </Button>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};
