import { http, HttpResponse, delay } from 'msw';
import { lessonsContents, topicsContents, lessonContents } from './data';

export const handlers = [
  http.get('/api/topics/:subject', async ({params}) => {
    await delay(500); // Simulate network latency

    const { subject } = params;
    
    const topics = topicsContents[subject as string];
    
    if (!topics) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({ topics });
  }),

  http.get('/api/lessons/:topic', async ({params}) => {
    await delay(500);

    const { topic } = params;
    
    const lessons = lessonsContents[topic as string];
  
    if (!lessons) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({ lessons });
  }),

  http.get('/api/lessons/:lessonId/content', async ({ params }) => {
    await delay(500);
    const { lessonId } = params;

    const content = lessonContents[lessonId as string];
    
    if (!content) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({ content });
  })
];