import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Chip,
  Divider,
} from '@mui/material';
import HubIcon from '@mui/icons-material/Hub';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BiotechIcon from '@mui/icons-material/Biotech';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { api, AuthResponse } from '../../services/api';

interface AuthPageProps {
  onLoginSuccess: (auth: AuthResponse) => void;
  onContinueAsGuest: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, onContinueAsGuest }) => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Sign In state
  const [loginUsername, setLoginUsername] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');

  // Sign Up state
  const [signupFirstName, setSignupFirstName] = useState<string>('');
  const [signupLastName, setSignupLastName] = useState<string>('');
  const [signupUsername, setSignupUsername] = useState<string>('');
  const [signupEmail, setSignupEmail] = useState<string>('');
  const [signupPassword, setSignupPassword] = useState<string>('');
  const [signupInstitution, setSignupInstitution] = useState<string>('');
  const [signupOrcid, setSignupOrcid] = useState<string>('');
  const [signupBio, setSignupBio] = useState<string>('');

  const handleLogin = async (e?: React.FormEvent, overrideUsername?: string, overridePassword?: string) => {
    if (e) e.preventDefault();
    const u = overrideUsername || loginUsername;
    const p = overridePassword || loginPassword;

    if (!u.trim() || !p.trim()) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const auth = await api.login(u.trim(), p);
      onLoginSuccess(auth);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupUsername.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setErrorMessage('Username, institutional email, and password are required.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const auth = await api.signup({
        username: signupUsername.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
        first_name: signupFirstName.trim(),
        last_name: signupLastName.trim(),
        institution: signupInstitution.trim() || 'Independent Researcher',
        orcid_id: signupOrcid.trim() || undefined,
        bio: signupBio.trim(),
      });
      onLoginSuccess(auth);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please check form fields.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: 'admin' | 'researcher') => {
    if (role === 'admin') {
      setLoginUsername('admin');
      setLoginPassword('AdminPass123!');
      handleLogin(undefined, 'admin', 'AdminPass123!');
    } else {
      setLoginUsername('researcher');
      setLoginPassword('SciencePass123!');
      handleLogin(undefined, 'researcher', 'SciencePass123!');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        bgcolor: '#090d16',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 4 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorative glow orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          left: '15%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, rgba(9, 13, 22, 0) 70%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10%',
          right: '15%',
          width: 550,
          height: 550,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(129, 140, 248, 0.1) 0%, rgba(9, 13, 22, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Container Card */}
      <Card
        sx={{
          maxWidth: 620,
          width: '100%',
          bgcolor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 4,
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(56, 189, 248, 0.1)',
          overflow: 'visible',
          zIndex: 1,
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4.5 } }}>
          {/* Header Brand */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 54,
                height: 54,
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 24px rgba(56, 189, 248, 0.5)',
                mb: 1.5,
              }}
            >
              <HubIcon sx={{ color: '#090d16', fontSize: 32 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 0.5 }}>
              Omix<span style={{ color: '#38bdf8' }}>Flow</span> <span style={{ color: '#818cf8' }}>Hub</span>
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', maxWidth: 440 }}>
              The open-science bioinformatics workbench. Federated pipelines, cloud DAG execution, and scientific community peer-review.
            </Typography>
          </Box>

          {/* Quick Login Test Accounts Widget */}
          <Box
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2.5,
              bgcolor: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AutoAwesomeIcon sx={{ fontSize: 18, color: '#38bdf8' }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Quick-Access Test Accounts
                </Typography>
              </Box>
              <Chip label="1-Click Login" size="small" sx={{ height: 20, fontSize: '0.68rem', bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }} />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
              <Card
                onClick={() => handleQuickLogin('admin')}
                sx={{
                  p: 1.5,
                  cursor: 'pointer',
                  bgcolor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#38bdf8',
                    boxShadow: '0 0 16px rgba(56, 189, 248, 0.25)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <SecurityIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                    Consortium Admin
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>
                  User: <code>admin</code> • Superuser / Staff
                </Typography>
                <Button
                  size="small"
                  variant="text"
                  endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                  sx={{ p: 0, mt: 0.8, fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600, textTransform: 'none' }}
                >
                  Log in as Admin
                </Button>
              </Card>

              <Card
                onClick={() => handleQuickLogin('researcher')}
                sx={{
                  p: 1.5,
                  cursor: 'pointer',
                  bgcolor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#818cf8',
                    boxShadow: '0 0 16px rgba(129, 140, 248, 0.25)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <BiotechIcon sx={{ fontSize: 16, color: '#34d399' }} />
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                    Elena Rostova
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>
                  User: <code>researcher</code> • Broad Institute
                </Typography>
                <Button
                  size="small"
                  variant="text"
                  endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                  sx={{ p: 0, mt: 0.8, fontSize: '0.75rem', color: '#818cf8', fontWeight: 600, textTransform: 'none' }}
                >
                  Log in as Researcher
                </Button>
              </Card>
            </Box>
          </Box>

          {/* Form Tabs */}
          <Tabs
            value={tabIndex}
            onChange={(_, val) => {
              setTabIndex(val);
              setErrorMessage(null);
            }}
            textColor="primary"
            indicatorColor="primary"
            variant="fullWidth"
            sx={{
              mb: 3,
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              '& .MuiTab-root': {
                fontWeight: 700,
                textTransform: 'none',
                fontSize: '0.9rem',
              },
            }}
          >
            <Tab label="Sign In" />
            <Tab label="Create Researcher Account" />
          </Tabs>

          {/* Error Banner */}
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              {errorMessage}
            </Alert>
          )}

          {/* TAB 0: Sign In Form */}
          {tabIndex === 0 && (
            <Box component="form" onSubmit={(e) => handleLogin(e)}>
              <TextField
                fullWidth
                label="Username or Institutional Email"
                variant="outlined"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="e.g. admin or researcher@omixflow.org"
                sx={{ mb: 2.5 }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: '#64748b', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                sx={{ mb: 3 }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SecurityIcon sx={{ color: '#64748b', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#64748b' }}>
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.4,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #1d4ed8 100%)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Sign In to OmixFlow'}
              </Button>
            </Box>
          )}

          {/* TAB 1: Sign Up Form */}
          {tabIndex === 1 && (
            <Box component="form" onSubmit={handleSignup}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  variant="outlined"
                  value={signupFirstName}
                  onChange={(e) => setSignupFirstName(e.target.value)}
                  placeholder="e.g. Elena"
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  variant="outlined"
                  value={signupLastName}
                  onChange={(e) => setSignupLastName(e.target.value)}
                  placeholder="e.g. Rostova"
                />
              </Box>

              <TextField
                fullWidth
                required
                label="Username"
                variant="outlined"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                placeholder="e.g. erostova"
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                required
                type="email"
                label="Academic / Institutional Email"
                variant="outlined"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="e.g. erostova@broadinstitute.org"
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                required
                type={showPassword ? 'text' : 'password'}
                label="Password"
                variant="outlined"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="••••••••"
                sx={{ mb: 2 }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#64748b' }}>
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                fullWidth
                label="Research Institution / Lab"
                variant="outlined"
                value={signupInstitution}
                onChange={(e) => setSignupInstitution(e.target.value)}
                placeholder="e.g. Broad Institute, EMBL-EBI, Sanger"
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="ORCID iD"
                variant="outlined"
                value={signupOrcid}
                onChange={(e) => setSignupOrcid(e.target.value)}
                placeholder="0000-0002-1825-0097"
                helperText="Enables verified peer review and pipeline DOI minting badge"
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                multiline
                rows={2}
                label="Scientific Domain & Focus (Short Bio)"
                variant="outlined"
                value={signupBio}
                onChange={(e) => setSignupBio(e.target.value)}
                placeholder="Computational biology, single-cell transcriptomics, WGS variant discovery..."
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.4,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Register Researcher Account'}
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

          {/* Continue as Guest option */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="text"
              onClick={onContinueAsGuest}
              sx={{
                color: '#94a3b8',
                fontSize: '0.85rem',
                textTransform: 'none',
                '&:hover': { color: '#e2e8f0' },
              }}
            >
              Explore OmixFlow Hub in Read-Only Guest Mode →
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Footer credits */}
      <Typography variant="caption" sx={{ color: '#475569', mt: 3 }}>
        OmixFlow Ecosystem • Open Source Bioinformatics Swiss Knife
      </Typography>
    </Box>
  );
};
