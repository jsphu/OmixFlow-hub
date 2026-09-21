import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  InputBase,
  IconButton,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import HubIcon from '@mui/icons-material/Hub';
import ScienceIcon from '@mui/icons-material/Science';
import EventIcon from '@mui/icons-material/Event';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Author } from '../../services/api';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 10,
  backgroundColor: alpha(theme.palette.common.white, 0.05),
  border: '1px solid rgba(255, 255, 255, 0.1)',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.09),
    borderColor: theme.palette.primary.main,
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  width: '100%',
  maxWidth: 320,
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1.5),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    fontSize: '0.875rem',
  },
}));

interface TopbarProps {
  currentTab?: string;
  onTabChange?: (tab: string) => void;
  onSearch?: (q: string) => void;
  currentUser?: Author | null;
  currentProfile?: any | null;
  userRole?: string | null;
  onLogout?: () => void;
  onOpenLogin?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentTab = 'feed',
  onTabChange,
  onSearch,
  currentUser,
  currentProfile,
  userRole,
  onLogout,
  onOpenLogin,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const displayName = currentUser
    ? `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || currentUser.username
    : 'Guest Researcher';

  const initials = currentUser
    ? `${currentUser.first_name?.[0] || currentUser.username[0] || 'U'}${currentUser.last_name?.[0] || ''}`.toUpperCase()
    : 'GR';

  const institution = currentUser?.institution || currentProfile?.institution || 'Bioinformatics Community';
  const orcid = currentUser?.orcid_id || currentProfile?.orcid_id;

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'rgba(9, 13, 22, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: 'none',
        zIndex: 1100,
      }}
    >
      <Toolbar sx={{ minHeight: 68, px: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'space-between' }}>
        {/* Left: Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => onTabChange && onTabChange('feed')}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.4)',
            }}
          >
            <HubIcon sx={{ color: '#090d16', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              Omix<span style={{ color: '#38bdf8' }}>Flow</span> <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600 }}>HUB</span>
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
              Bioinformatics Swiss Knife
            </Typography>
          </Box>
        </Box>

        {/* Center: Search */}
        <Search>
          <SearchIconWrapper>
            <SearchIcon fontSize="small" />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search pipelines, tools, topics, DOIs..."
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </Search>

        {/* Navigation Tabs */}
        <Tabs
          value={currentTab}
          onChange={(_, val) => onTabChange && onTabChange(val)}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            minHeight: 48,
            '& .MuiTab-root': {
              minHeight: 48,
              fontSize: '0.875rem',
              fontWeight: 600,
              textTransform: 'none',
              px: 2,
              gap: 1,
            },
          }}
        >
          <Tab icon={<DynamicFeedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Feed" value="feed" />
          <Tab icon={<HubIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Discover" value="discover" />
          <Tab icon={<ScienceIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Workspace" value="workspace" />
          <Tab icon={<EventIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Conferences" value="conferences" />
        </Tabs>

        {/* Right: Core Backend Status & Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Core Backend API connected (:8000)">
            <Chip
              icon={<CheckCircleIcon sx={{ fontSize: 14, color: '#10b981 !important' }} />}
              label="Core v0.1 Online"
              size="small"
              sx={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                color: '#34d399',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            />
          </Tooltip>

          <IconButton sx={{ color: '#94a3b8' }}>
            <NotificationsNoneIcon fontSize="small" />
          </IconButton>

          {/* User profile card / Menu Trigger */}
          {currentUser ? (
            <Box
              onClick={handleMenuOpen}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                pl: 1,
                py: 0.5,
                pr: 1,
                borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                borderRadius: 2,
                transition: 'background 0.2s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.04)',
                },
              }}
            >
              <Avatar
                src={currentUser.avatar_url}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: userRole === 'Consortium Director' ? '#f59e0b' : '#38bdf8',
                  color: '#090d16',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                {initials}
              </Avatar>
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {displayName}
                  </Typography>
                  <VerifiedIcon sx={{ fontSize: 14, color: '#38bdf8' }} />
                </Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>
                  {institution}
                </Typography>
              </Box>
              <KeyboardArrowDownIcon sx={{ color: '#64748b', fontSize: 18 }} />
            </Box>
          ) : (
            <Button
              variant="outlined"
              size="small"
              onClick={onOpenLogin}
              sx={{
                borderColor: '#38bdf8',
                color: '#38bdf8',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#0284c7',
                  background: 'rgba(56, 189, 248, 0.1)',
                },
              }}
            >
              Sign In
            </Button>
          )}

          {/* User Profile Popover Menu */}
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1.5,
                  minWidth: 260,
                  bgcolor: 'rgba(15, 23, 42, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                  p: 1,
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                  {displayName}
                </Typography>
                {userRole && (
                  <Chip
                    label={userRole}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      bgcolor: userRole === 'Consortium Director' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                      color: userRole === 'Consortium Director' ? '#fbbf24' : '#38bdf8',
                    }}
                  />
                )}
              </Box>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                @{currentUser?.username}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
                {institution}
              </Typography>
              {orcid && (
                <Typography variant="caption" sx={{ color: '#38bdf8', display: 'block', fontFamily: 'monospace', mt: 0.5 }}>
                  ORCID: {orcid}
                </Typography>
              )}
            </Box>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 1 }} />

            <MenuItem
              onClick={() => {
                handleMenuClose();
                onLogout && onLogout();
              }}
              sx={{
                borderRadius: 1.5,
                color: '#f87171',
                '&:hover': {
                  bgcolor: 'rgba(239, 68, 68, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#f87171', minWidth: 32 }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                slotProps={{
                  primary: {
                    sx: { fontSize: '0.85rem', fontWeight: 600 },
                  },
                }}
                primary="Sign Out / Switch Account"
              />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};