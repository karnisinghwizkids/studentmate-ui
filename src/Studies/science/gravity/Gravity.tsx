import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Video, FileText, Calendar, ChevronLeft, AlertCircle } from 'lucide-react';
import { getLessons } from '../../../api/client';
import { Breadcrumbs } from '../../../common/components/Breadcrumbs';
import { Button } from '../../../common/components/Button';
import MessageRenderer from '../../../common/components/MessageRenderer';

// ... (keep all interfaces unchanged)

function Gravity() {
  const [lessons, setLessons] = React.useState<Lesson[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    let mounted = true;

    const fetchLessons = async () => {
      try {
        const response = await getLessons();
        
        if (!mounted) return;

        if (!response?.data) {
          throw new Error('No data received from server');
        }

        // Filter gravity-related lessons
        const gravityLessons = response.data.filter(lesson => 
          lesson.title.toLowerCase().includes('gravity')
        );

        if (gravityLessons.length === 0) {
          setError('No gravity lessons found. Please check back later.');
        } else {
          setLessons(gravityLessons);
          setError(null);
        }
      } catch (err) {
        if (!mounted) return;
        
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'Failed to load gravity lessons. Please try again later.';
        
        setError(errorMessage);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchLessons();

    return () => {
      mounted = false;
    };
  }, []);

  // ... (keep the rest of the component code unchanged)
}

export default Gravity;