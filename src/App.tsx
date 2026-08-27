import React, { useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { Header } from './components/layout/Header';
import { QuickCaptureModal } from './components/common/QuickCaptureModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NewAreaModal } from './components/common/NewAreaModal';
import { PinLockScreen } from './components/common/PinLockScreen';
import { UserSetupModal } from './components/common/UserSetupModal';

// Views
import { HomeView } from './components/views/HomeView';
import { CalendarView } from './components/views/CalendarView';
import { TasksView } from './components/views/TasksView';
import { GoalsView } from './components/views/GoalsView';
import { HabitsView } from './components/views/HabitsView';
import { DailyLogView } from './components/views/DailyLogView';
import { HeatmapView } from './components/views/HeatmapView';
import { ProjectsView } from './components/views/ProjectsView';
import { ReviewsView } from './components/views/ReviewsView';
import { InboxView } from './components/views/InboxView';
import { SettingsView } from './components/views/SettingsView';

// Areas
import { AcademicsArea } from './components/areas/AcademicsArea';
import { GymArea } from './components/areas/GymArea';
import { CommunicationArea } from './components/areas/CommunicationArea';
import { NutritionArea } from './components/areas/NutritionArea';
import { CustomAreaView } from './components/areas/CustomAreaView';

export const App: React.FC = () => {
  const { currentView, userSettings } = useStore();
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    // Sync dark mode class on mount based on user settings
    if (userSettings.theme === 'dark' || (userSettings.theme as string) === 'pitch-obsidian') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [userSettings.theme]);

  // 1st Time User Setup (Username creation)
  const isAccountSetupNeeded = !userSettings.userName && !userSettings.hasCompletedTutorial;
  if (isAccountSetupNeeded) {
    return <UserSetupModal onCompleted={() => setIsLocked(false)} />;
  }

  // Passcode PIN Prompt on Startup (Only if pinEnabled is explicitly true)
  if (isLocked && userSettings.pinEnabled && userSettings.pinCode) {
    return <PinLockScreen onUnlocked={() => setIsLocked(false)} />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home': return <HomeView />;
      case 'calendar': return <CalendarView />;
      case 'tasks': return <TasksView />;
      case 'goals': return <GoalsView />;
      case 'habits': return <HabitsView />;
      case 'daily-log': return <DailyLogView />;
      case 'heatmap': return <HeatmapView />;
      case 'projects': return <ProjectsView />;
      case 'reviews': return <ReviewsView />;
      case 'inbox': return <InboxView />;
      case 'academics': return <AcademicsArea />;
      case 'gym': return <GymArea />;
      case 'communication': return <CommunicationArea />;
      case 'nutrition': return <NutritionArea />;
      case 'custom-area': return <CustomAreaView />;
      case 'settings': return <SettingsView />;
      default: return <HomeView />;
    }
  };

  return (
    <div className="flex h-screen bg-warm-bg dark:bg-warm-bg-dark text-primary-text dark:text-primary-text-dark font-sans overflow-hidden">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 pb-20 md:pb-8">
          {renderCurrentView()}
        </main>

        {/* Mobile Navigation */}
        <BottomNav />
      </div>

      {/* Global Modals */}
      <QuickCaptureModal />
      <GlobalSearchModal />
      <NewAreaModal />
    </div>
  );
};

export default App;
