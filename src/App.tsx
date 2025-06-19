
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Dashboard} from './pages/Dashboard';
import {QuestLog} from './pages/QuestLog';
import {Character} from './pages/Character';
import {History} from './pages/History';
import {Settings} from './pages/Settings';
import {Navbar} from './components/shared/Navbar';
import { PageWrapper } from './components/shared/PageWrapper';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={
              <PageWrapper>
                <Dashboard />
              </PageWrapper>
          }/>
          <Route path="/quests" element={
              <PageWrapper>
                <QuestLog />
              </PageWrapper>
          }/>
          <Route path="/character" element={
              <PageWrapper>
                <Character />
              </PageWrapper>
          }/>
          <Route path="/history" element={
              <PageWrapper>
                <History />
              </PageWrapper>
          }/>
          <Route path="/settings" element={
              <PageWrapper>
                <Settings />
              </PageWrapper>
          }/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
