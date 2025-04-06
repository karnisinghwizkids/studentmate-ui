import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStudentSummary, updateStudentPoints } from '../api/client';

interface StudentContextType {
  name: string;
  points: number;
  level: number;
  addPoints: (amount: number) => Promise<void>;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState('Loading...');
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const data = await getStudentSummary('1'); // Hardcoded student ID for demo
        setName(data.name);
        setPoints(data.points);
        setLevel(data.level);
      } catch (error) {
        console.error('Failed to load student data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudentData();
  }, []);

  const calculateLevel = (points: number) => {
    return Math.floor(points / 200) + 1;
  };

  const addPoints = async (amount: number) => {
    try {
      const newPoints = points + amount;
      const newLevel = calculateLevel(newPoints);
      
      // Update the server first
      await updateStudentPoints('1', newPoints);
      
      // If server update succeeds, update local state
      setPoints(newPoints);
      if (newLevel !== level) {
        setLevel(newLevel);
      }
    } catch (error) {
      console.error('Failed to update points:', error);
      throw error;
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-pink"></div>
    </div>;
  }

  return (
    <StudentContext.Provider value={{ name, points, level, addPoints }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
}