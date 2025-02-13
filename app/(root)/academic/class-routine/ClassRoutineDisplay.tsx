'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetList } from '@/hooks/APIHooks';
import { useMemo, useState } from 'react';

interface ClassRoutine {
  _id: string;
  className: string;
  section: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacherName: string;
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ClassRoutineDisplay = () => {
  const { data: routines, isLoading } = useGetList<ClassRoutine>('/class-routine', 'classRoutines');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const organizedRoutines = useMemo(() => {
    if (!routines) return {};

    const filteredRoutines = routines.filter(
      (routine) =>
        (!selectedClass || routine.className === selectedClass) &&
        (!selectedSection || routine.section === selectedSection),
    );

    return filteredRoutines.reduce(
      (acc, routine) => {
        if (!acc[routine.day]) {
          acc[routine.day] = [];
        }
        acc[routine.day].push(routine);
        return acc;
      },
      {} as Record<string, ClassRoutine[]>,
    );
  }, [routines, selectedClass, selectedSection]);

  const classes = useMemo(() => {
    if (!routines) return [];
    return Array.from(new Set(routines.map((routine) => routine.className)));
  }, [routines]);

  const sections = useMemo(() => {
    if (!routines || !selectedClass) return [];
    return Array.from(
      new Set(
        routines
          .filter((routine) => routine.className === selectedClass)
          .map((routine) => routine.section),
      ),
    );
  }, [routines, selectedClass]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Class Routine</h1>

      <div className="flex space-x-4 mb-6">
        <div className="w-1/2">
          <Label htmlFor="class-select">Class</Label>
          <Select
            value={selectedClass || ''}
            onValueChange={(value) => {
              setSelectedClass(value);
              setSelectedSection(null);
            }}
          >
            <SelectTrigger id="class-select">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="all">All Classes</SelectItem> */}
              {classes.map((className) => (
                <SelectItem key={className} value={className}>
                  {className}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-1/2">
          <Label htmlFor="section-select">Section</Label>
          <Select
            value={selectedSection || ''}
            onValueChange={(value) => setSelectedSection(value)}
            disabled={!selectedClass}
          >
            <SelectTrigger id="section-select">
              <SelectValue placeholder="Select a section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              {sections.map((section) => (
                <SelectItem key={section} value={section}>
                  {section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {days.map((day) => {
        const dayRoutines = organizedRoutines[day];
        if (!dayRoutines || dayRoutines.length === 0) return null;

        return (
          <div key={day} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{day}</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Teacher</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dayRoutines
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((routine) => (
                    <TableRow key={routine._id}>
                      <TableCell>
                        {routine.startTime} - {routine.endTime}
                      </TableCell>
                      <TableCell>{routine.className}</TableCell>
                      <TableCell>{routine.section}</TableCell>
                      <TableCell>{routine.subject}</TableCell>
                      <TableCell>{routine.teacherName}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        );
      })}
    </div>
  );
};

export default ClassRoutineDisplay;
