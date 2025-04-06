import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.tsx';
import Home from './Home/Home.tsx';
import Studies from './Studies/Studies.tsx';
import Subject from './Studies/Subject.tsx';
import Topic from './Studies/Topic.tsx';
import Lesson from './Studies/Lesson/Lesson.tsx';
import Chat from './pages/Chat.tsx';
import Gallery from './pages/Gallery.tsx';
import Scorecard from './pages/Scorecard.tsx';
import Badges from './pages/Badges.tsx';
import Funfacts from './pages/Funfacts.tsx';
import Funfrendz from './pages/Funfrendz.tsx';
import { StudentProvider } from './contexts/StudentContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StudentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="/fundamentals" element={<Studies />} />
            <Route path="/fundamentals/:subject" element={<Subject />} />
            <Route path="/fundamentals/:subject/:topic" element={<Topic />} />
            <Route path="/fundamentals/:subject/:topic/:lesson/*" element={<Lesson />}>
              <Route path="learn" element={null} />
              <Route path="master" element={null} />
              <Route path="evaluate" element={null} />
            </Route>
            <Route path="/chat" element={<Chat />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/scorecard" element={<Scorecard />} />
            <Route path="/badges" element={<Badges />} />
            <Route path="/funfacts" element={<Funfacts />} />
            <Route path="/funfrendz" element={<Funfrendz />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StudentProvider>
  </StrictMode>
);