import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.tsx';
import Studies from './Studies/Studies.tsx';
import Subject from './Studies/Subject.tsx';
import Topic from './Studies/Topic.tsx';
import Lesson from './Studies/Lesson/Lesson.tsx';
import Quiz from './Studies/Lesson/Quiz.tsx';
import Chat from './pages/Chat.tsx';
import Gallery from './pages/Gallery.tsx';
import Scorecard from './pages/Scorecard.tsx';
import Badges from './pages/Badges.tsx';
import Funfacts from './pages/Funfacts.tsx';
import Funfrendz from './pages/Funfrendz.tsx';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import './index.css';

library.add(fas);

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
 
  const { worker } = await import('./mocks/browser');
 
  // Start the worker and wait for it to be ready
  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js'
    }
  });
}

// Initialize the app only after mocking is enabled
enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/fundamentals" element={<Studies />} />
          <Route path="/fundamentals/:subject" element={<Subject />} />
          <Route path="/fundamentals/:subject/:topic" element={<Topic />} />
          <Route path="/fundamentals/:subject/:topic/:lesson" element={<Lesson />} />
          <Route path="/fundamentals/:subject/:topic/:lesson/quiz" element={<Quiz />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/scorecard" element={<Scorecard />} />
          <Route path="/badges" element={<Badges />} />
          <Route path="/funfacts" element={<Funfacts />} />
          <Route path="/funfrendz" element={<Funfrendz />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
});