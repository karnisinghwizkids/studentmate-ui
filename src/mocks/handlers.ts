import { http, HttpResponse, delay } from 'msw';
import { lessons, topics, lessonContents } from './data';

export const handlers = [
  http.get('/api/topics/:subject', async ({params}) => {
    await delay(500); // Simulate network latency
    return HttpResponse.json({ topics });
  }),

  http.get('/api/lessons/:topic', async ({params}) => {
    await delay(500);
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