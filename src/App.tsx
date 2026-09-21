import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from './theme';
import { Topbar } from './Shared/Topbar/Topbar';
import { FeedPage } from './Pages/Feed/FeedPage';
import { DiscoverPage } from './Pages/Discover/DiscoverPage';
import { WorkspacePage } from './Pages/Workspace/WorkspacePage';
import { ConferencesPage } from './Pages/Conferences/ConferencesPage';
import './index.css';

function App() {
  const [currentTab, setCurrentTab] = useState<'feed' | 'discover' | 'workspace' | 'conferences'>('feed');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
        <Topbar
          currentTab={currentTab}
          onTabChange={(tab: string) => setCurrentTab(tab as 'feed' | 'discover' | 'workspace' | 'conferences')}
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
