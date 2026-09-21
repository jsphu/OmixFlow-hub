import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  TextField,
  Avatar,
  Chip,
  IconButton,
  Divider,
  Stack,
  Collapse,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import RepeatIcon from '@mui/icons-material/Repeat';
import ShareIcon from '@mui/icons-material/Share';
import SendIcon from '@mui/icons-material/Send';
import VerifiedIcon from '@mui/icons-material/Verified';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HubIcon from '@mui/icons-material/Hub';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EventIcon from '@mui/icons-material/Event';
import { api, PostItem, DiscussionComment, WorkflowSummary } from '../../services/api';

interface FeedPageProps {
  onNavigateToPipeline?: (slug: string) => void;
}

export const FeedPage: React.FC<FeedPageProps> = ({ onNavigateToPipeline }) => {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowSummary[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newDoi, setNewDoi] = useState('');
  const [selectedWf, setSelectedWf] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, DiscussionComment[]>>({});
  const [commentInput, setCommentInput] = useState('');

  useEffect(() => {
    loadFeed();
    api.getWorkflows().then(setWorkflows);
  }, [selectedTag]);

  const loadFeed = async () => {
    const data = await api.getPosts(selectedTag || undefined);
    setPosts(data);
  };

  const handleCreatePost = async () => {
    if (!newBody.trim()) return;
    const created = await api.createPost({
      title: newTitle.trim(),
      body_markdown: newBody.trim(),
      paper_doi: newDoi.trim() || undefined,
      linked_workflow: selectedWf || undefined,
      tags: selectedTag ? [selectedTag] : ['Bioinformatics', 'Genomics'],
    });
    setPosts([created, ...posts]);
    setNewTitle('');
    setNewBody('');
    setNewDoi('');
    setSelectedWf('');
  };

  const handleLike = async (postId: string) => {
    const res = await api.likePost(postId);
    setPosts(
      posts.map((p) =>
        p.id === postId ? { ...p, is_liked: res.liked, likes_count: res.likes_count } : p
      )
    );
  };

  const toggleComments = async (postId: string) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      return;
    }
    setExpandedPostId(postId);
    if (!commentsMap[postId]) {
      const comments = await api.getPostComments(postId);
      setCommentsMap((prev) => ({ ...prev, [postId]: comments }));
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!commentInput.trim()) return;
    const newComment = await api.addPostComment(postId, commentInput.trim());
    setCommentsMap((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));
    setPosts(
      posts.map((p) => (p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p))
    );
    setCommentInput('');
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' }, gap: 3 }}>
        {/* Main Feed Column */}
        <Box>
          {/* Post Composer Card */}
          <Card sx={{ mb: 3, p: 2.5, background: 'rgba(17, 24, 39, 0.85)', backdropFilter: 'blur(12px)' }}>
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
              Share Scientific Insights & Pipelines
            </Typography>
            <TextField
              fullWidth
              placeholder="Post title (e.g. Nextflow 24.04 Benchmark on RNA-seq replicates)"
              variant="outlined"
              size="small"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              sx={{ mb: 1.5 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Share benchmark results, pipeline updates, algorithm discussions, or LaTeX math (e.g. $$ \Delta G $$)..."
              variant="outlined"
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
              <TextField
                size="small"
                placeholder="Attach DOI (e.g. 10.1038/...)"
                value={newDoi}
                onChange={(e) => setNewDoi(e.target.value)}
                sx={{ width: 220 }}
              />
              <select
                value={selectedWf}
                onChange={(e) => setSelectedWf(e.target.value)}
                style={{
                  background: '#1e293b',
                  color: '#f8fafc',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              >
                <option value="">Link a Pipeline...</option>
                {workflows.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.workflow_format})
                  </option>
                ))}
              </select>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack direction="row" spacing={1}>
                {['#RNA-seq', '#GATK4', '#benchmarking', '#Nextflow'].map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    clickable
                    onClick={() => setNewBody((prev) => `${prev} ${tag}`)}
                    sx={{ bgcolor: 'rgba(56, 189, 248, 0.08)', color: '#38bdf8', fontSize: '0.75rem' }}
                  />
                ))}
              </Stack>
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={handleCreatePost}
                disabled={!newBody.trim()}
                sx={{ px: 3, background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)' }}
              >
                Publish Post
              </Button>
            </Box>
          </Card>

          {/* Active Tag Filter */}
          {selectedTag && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Filtering by topic:
              </Typography>
              <Chip
                label={selectedTag}
                color="primary"
                size="small"
                onDelete={() => setSelectedTag(null)}
              />
            </Box>
          )}

          {/* Feed Posts List */}
          <Stack spacing={2.5}>
            {posts.map((post) => (
              <Card key={post.id} sx={{ p: 2.5 }}>
                {/* Post Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: '#818cf8', fontWeight: 700, width: 42, height: 42 }}>
                      {post.author.first_name?.[0] || post.author.username[0].toUpperCase()}
                    </Avatar>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                          {post.author.first_name ? `${post.author.first_name} ${post.author.last_name}` : post.author.username}
                        </Typography>
                        {post.author.is_verified_researcher && (
                          <VerifiedIcon sx={{ fontSize: 15, color: '#38bdf8' }} />
                        )}
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          • {post.created_at}
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                        {post.author.institution || 'Computational Biologist'} {post.author.orcid_id && `• ORCID: ${post.author.orcid_id}`}
                      </Typography>
                    </Box>
                  </Box>

                  {post.paper_doi && (
                    <Chip
                      icon={<MenuBookIcon sx={{ fontSize: 14 }} />}
                      label={`DOI: ${post.paper_doi}`}
                      size="small"
                      component="a"
                      href={`https://doi.org/${post.paper_doi}`}
                      target="_blank"
                      clickable
                      sx={{ bgcolor: 'rgba(129, 140, 248, 0.1)', color: '#a5b4fc', border: '1px solid rgba(129, 140, 248, 0.2)' }}
                    />
                  )}
                </Box>

                {/* Post Content */}
                {post.title && (
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: '1.05rem', color: '#f1f5f9' }}>
                    {post.title}
                  </Typography>
                )}
                <Typography variant="body1" sx={{ color: '#cbd5e1', lineHeight: 1.6, mb: 2, whiteSpace: 'pre-line' }}>
                  {post.body_markdown}
                </Typography>

                {/* Embedded Pipeline Card */}
                {post.linked_workflow_details && (
                  <Card
                    sx={{
                      mb: 2,
                      p: 1.8,
                      background: 'rgba(30, 41, 59, 0.6)',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HubIcon sx={{ color: '#38bdf8', fontSize: 20 }} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#38bdf8' }}>
                            {post.linked_workflow_details.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                            {post.linked_workflow_details.description.slice(0, 80)}...
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => onNavigateToPipeline && onNavigateToPipeline(post.linked_workflow_details!.slug)}
                        sx={{ fontSize: '0.75rem', borderColor: '#38bdf8', color: '#38bdf8' }}
                      >
                        Explore DAG
                      </Button>
                    </Box>
                  </Card>
                )}

                {/* Tags */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 2 }}>
                  {post.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={`#${tag}`}
                      size="small"
                      clickable
                      onClick={() => setSelectedTag(tag)}
                      sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8', fontSize: '0.75rem' }}
                    />
                  ))}
                </Box>

                <Divider sx={{ my: 1.5 }} />

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Stack direction="row" spacing={3}>
                    <Button
                      size="small"
                      startIcon={post.is_liked ? <FavoriteIcon sx={{ color: '#f43f5e' }} /> : <FavoriteBorderIcon />}
                      onClick={() => handleLike(post.id)}
                      sx={{ color: post.is_liked ? '#f43f5e' : '#94a3b8', fontWeight: 600 }}
                    >
                      {post.likes_count}
                    </Button>
                    <Button
                      size="small"
                      startIcon={<ChatBubbleOutlinedIcon />}
                      onClick={() => toggleComments(post.id)}
                      sx={{ color: '#94a3b8', fontWeight: 600 }}
                    >
                      {post.comments_count} Comments
                    </Button>
                    <Button size="small" startIcon={<RepeatIcon />} sx={{ color: '#94a3b8' }}>
                      {post.reposts_count}
                    </Button>
                  </Stack>
                  <IconButton size="small" sx={{ color: '#64748b' }}>
                    <ShareIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* Expandable Comments Drawer */}
                <Collapse in={expandedPostId === post.id} timeout="auto" unmountOnExit>
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#94a3b8' }}>
                      Scientific Discussion ({commentsMap[post.id]?.length || 0})
                    </Typography>

                    {/* Comments List */}
                    <Stack spacing={1.5} sx={{ mb: 2 }}>
                      {commentsMap[post.id]?.map((comment) => (
                        <Box
                          key={comment.id}
                          sx={{
                            p: 1.5,
                            borderRadius: 1.5,
                            bgcolor: comment.highlighted_by_author ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                            borderLeft: comment.highlighted_by_author ? '3px solid #38bdf8' : 'none',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                              {comment.author.username}
                            </Typography>
                            {comment.highlighted_by_author && (
                              <Chip label="Author Highlight" size="small" sx={{ height: 18, fontSize: '0.65rem', bgcolor: '#38bdf8', color: '#090d16' }} />
                            )}
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              {comment.created_at}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                            {comment.content_markdown}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>

                    {/* Add Comment Input */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Write a peer review comment or question..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment(post.id);
                          }
                        }}
                      />
                      <Button variant="contained" size="small" onClick={() => handleAddComment(post.id)}>
                        Reply
                      </Button>
                    </Box>
                  </Box>
                </Collapse>
              </Card>
            ))}
          </Stack>
        </Box>

        {/* Right Sidebar: Trends & Radar */}
        <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
          <Stack spacing={3}>
            {/* Trending Topics */}
            <Card sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <TrendingUpIcon sx={{ color: '#38bdf8' }} /> Trending in OmixFlow
              </Typography>
              <Stack spacing={1}>
                {[
                  { topic: 'GATK4', count: '48 runs this week' },
                  { topic: 'RNA-seq', count: '124 pipelines active' },
                  { topic: 'BWA-MEM2', count: '34 discussions' },
                  { topic: 'Spatial Transcriptomics', count: 'Hot topic' },
                  { topic: 'Nextflow DSL2', count: '92 verified pipelines' },
                ].map((item) => (
                  <Box
                    key={item.topic}
                    sx={{
                      p: 1,
                      borderRadius: 1.5,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
                    }}
                    onClick={() => setSelectedTag(item.topic)}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#f8fafc' }}>
                      #{item.topic}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      {item.count}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Card>

            {/* Upcoming Bio Conferences Card */}
            <Card sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <EventIcon sx={{ color: '#818cf8' }} /> Conference Radar
              </Typography>
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#818cf8' }}>
                  ISMB 2027 • Geneva
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                  July 11–15, 2027 • Abstract deadline: Jan 28
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#818cf8' }}>
                  BOSC 2027 • Geneva
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                  July 16–17, 2027 • Nextflow & Galaxy workshops
                </Typography>
              </Box>
            </Card>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};
