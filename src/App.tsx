import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import { theme } from './theme';
import { Topbar } from './Shared/Topbar/Topbar';
import { FeedPage } from './Pages/Feed/FeedPage';
import { DiscoverPage } from './Pages/Discover/DiscoverPage';
import { WorkspacePage } from './Pages/Workspace/WorkspacePage';
import { ConferencesPage } from './Pages/Conferences/ConferencesPage';
import { AuthPage } from './Pages/Auth/AuthPage';
import { api, Author, AuthResponse } from './services/api';
import './index.css';

function App() {
  const [currentTab, setCurrentTab] = useState<'feed' | 'discover' | 'workspace' | 'conferences'>('feed');
  const [currentUser, setCurrentUser] = useState<Author | null>(null);
  const [currentProfile, setCurrentProfile] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(true);

  useEffect(() => {
    // Check if token exists in localStorage or query /auth/me/
    const token = api.getAuthToken();
    if (token) {
      api
        .getMe()
        .then((auth) => {
          if (auth && auth.user) {
            setCurrentUser(auth.user);
            setCurrentProfile(auth.profile);
            setUserRole(
              auth.is_superuser
                ? 'Consortium Director'
                : auth.is_staff
                ? 'Staff'
                : 'Researcher'
            );
          } else {
            api.clearAuthSession();
          }
          setInitializing(false);
        })
        .catch(() => {
          const storedUser = api.getStoredUser();
          if (storedUser) {
            setCurrentUser(storedUser);
            setCurrentProfile(api.getStoredProfile());
            setUserRole(localStorage.getItem('omixflow_role') || 'Researcher');
          }
          setInitializing(false);
        });
    } else {
      setInitializing(false);
    }
  }, []);

  const handleLoginSuccess = (auth: AuthResponse) => {
    setCurrentUser(auth.user);
    setCurrentProfile(auth.profile);
    setUserRole(
      auth.is_superuser
        ? 'Consortium Director'
        : auth.is_staff
        ? 'Staff'
        : 'Researcher'
    );
    setIsGuest(false);
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setCurrentProfile(null);
    setUserRole(null);
    setIsGuest(false);
  };

  const handleContinueAsGuest = () => {
    setIsGuest(true);
  };

  const handleOpenLogin = () => {
    setIsGuest(false);
    setCurrentUser(null);
  };

  if (initializing) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#090d16',
          }}
        >
          <CircularProgress sx={{ color: '#38bdf8' }} />
        </Box>
      </ThemeProvider>
    );
  }

  // If unauthenticated and not continuing in guest mode, show the AuthPage
  if (!currentUser && !isGuest) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthPage
          onLoginSuccess={handleLoginSuccess}
          onContinueAsGuest={handleContinueAsGuest}
        />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
        <Topbar
          currentTab={currentTab}
          onTabChange={(tab: string) => setCurrentTab(tab as 'feed' | 'discover' | 'workspace' | 'conferences')}
          currentUser={currentUser}
          currentProfile={currentProfile}
          userRole={userRole}
          onLogout={handleLogout}
          onOpenLogin={handleOpenLogin}
        />
        <Box component="main" sx={{ py: 3 }}>
          {currentTab === 'feed' && (
            <FeedPage onNavigateToPipeline={() => setCurrentTab('discover')} />
          )}
          {currentTab === 'discover' && <DiscoverPage />}
          {currentTab === 'workspace' && <WorkspacePage />}
          {currentTab === 'conferences' && <ConferencesPage />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;

