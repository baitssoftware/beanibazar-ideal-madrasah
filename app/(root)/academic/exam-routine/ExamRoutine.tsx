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

interface ExamRoutine {
  _id: string;
  examName: string;
  className: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
}

const ExamRoutine = () => {
  const { data: routines, isLoading } = useGetList<ExamRoutine>('/exam-routine', 'examRoutines');
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const filteredRoutines = useMemo(() => {
    if (!routines) return [];
    return routines.filter(
      (routine) =>
        (!selectedExam || routine?.examName === selectedExam) &&
        (!selectedClass || routine?.className === selectedClass),
    );
  }, [routines, selectedExam, selectedClass]);

  const exams = useMemo(() => {
    if (!routines) return [];
    return Array?.from(new Set(routines?.map((routine) => routine.examName)));
  }, [routines]);

  const classes = useMemo(() => {
    if (!routines) return [];
    return Array?.from(new Set(routines?.map((routine) => routine.className)));
  }, [routines]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Exam Routine</h1>

      <div className="flex space-x-4 mb-6">
        <div className="w-1/2">
          <Label htmlFor="exam-select">Exam</Label>
          <Select value={selectedExam || ''} onValueChange={(value) => setSelectedExam(value)}>
            <SelectTrigger id="exam-select">
              <SelectValue placeholder="Select an exam" />
            </SelectTrigger>
            <SelectContent>
              {exams?.map((exam) => (
                <SelectItem key={exam} value={exam}>
                  {exam}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-1/2">
          <Label htmlFor="class-select">Class</Label>
          <Select value={selectedClass || ''} onValueChange={(value) => setSelectedClass(value)}>
            <SelectTrigger id="class-select">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {classes?.map((className) => (
                <SelectItem key={className} value={className}>
                  {className}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Exam Name</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Venue</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRoutines
            ?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            ?.map((routine) => (
              <TableRow key={routine._id}>
                <TableCell>{routine.examName}</TableCell>
                <TableCell>{routine.className}</TableCell>
                <TableCell>{routine.subject}</TableCell>
                <TableCell>{new Date(routine.date).toLocaleDateString()}</TableCell>
                <TableCell>{`${routine.startTime} - ${routine.endTime}`}</TableCell>
                <TableCell>{routine.venue}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExamRoutine;
