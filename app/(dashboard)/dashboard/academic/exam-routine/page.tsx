'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCreate, useDelete, useGetList, useUpdate } from '@/hooks/APIHooks';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';

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

const ExamRoutineDashboard = () => {
  const [editingRoutine, setEditingRoutine] = useState<ExamRoutine | null>(null);

  const {
    data: routines,
    isLoading,
    refetch,
  } = useGetList<ExamRoutine>('/exam-routine', 'examRoutines');
  const { mutateAsync: createRoutine } = useCreate<ExamRoutine>('/exam-routine', 'examRoutines');
  const { mutateAsync: updateRoutine } = useUpdate<ExamRoutine>('/exam-routine', 'examRoutines');
  const { mutateAsync: deleteRoutine } = useDelete('/exam-routine', 'examRoutines');

  const handleCreateRoutine = async (routineData: Omit<ExamRoutine, '_id'>) => {
    try {
      await createRoutine({
        body: routineData as unknown as ExamRoutine,
        callbacks: {
          onSuccess: () => {
            toast({ title: 'Success', description: 'Exam routine created successfully' });
            refetch();
          },
          onError: (error) => {
            toast({
              title: 'Error',
              description: error.message || 'Failed to create exam routine',
              variant: 'destructive',
            });
          },
        },
      });
    } catch (error) {
      console.error('Failed to create exam routine:', error);
    }
  };

  const handleUpdateRoutine = async (id: string, routineData: Omit<ExamRoutine, '_id'>) => {
    try {
      await updateRoutine({
        id,
        body: routineData,
        callbacks: {
          onSuccess: () => {
            toast({ title: 'Success', description: 'Exam routine updated successfully' });
            refetch();
            setEditingRoutine(null);
          },
          onError: (error) => {
            toast({
              title: 'Error',
              description: error.message || 'Failed to update exam routine',
              variant: 'destructive',
            });
          },
        },
      });
    } catch (error) {
      console.error('Failed to update exam routine:', error);
    }
  };

  const handleDeleteRoutine = async (id: string) => {
    try {
      await deleteRoutine({
        id,
        callbacks: {
          onSuccess: () => {
            toast({ title: 'Success', description: 'Exam routine deleted successfully' });
            refetch();
          },
          onError: (error) => {
            toast({
              title: 'Error',
              description: error.message || 'Failed to delete exam routine',
              variant: 'destructive',
            });
          },
        },
      });
    } catch (error) {
      console.error('Failed to delete exam routine:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Exam Routines Dashboard</h1>

      <AddRoutineModal onAddRoutine={handleCreateRoutine} />

      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>Exam Name</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {routines?.map((routine) => (
            <TableRow key={routine._id}>
              <TableCell>{routine.examName}</TableCell>
              <TableCell>{routine.className}</TableCell>
              <TableCell>{routine.subject}</TableCell>
              <TableCell>{new Date(routine.date).toLocaleDateString()}</TableCell>
              <TableCell>{`${routine.startTime} - ${routine.endTime}`}</TableCell>
              <TableCell>{routine.venue}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingRoutine(routine)}>
                    <FaEdit className="mr-2" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteRoutine(routine._id)}
                  >
                    <FaRegTrashAlt className="mr-2" /> Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingRoutine && (
        <EditRoutineModal
          routine={editingRoutine}
          onUpdateRoutine={handleUpdateRoutine}
          onClose={() => setEditingRoutine(null)}
        />
      )}
    </div>
  );
};

interface RoutineFormData {
  examName: string;
  className: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
}

const RoutineForm = ({
  initialData,
  onSubmit,
  submitText,
}: {
  initialData?: RoutineFormData;
  onSubmit: (data: RoutineFormData) => void;
  submitText: string;
}) => {
  const [formData, setFormData] = useState<RoutineFormData>(
    initialData || {
      examName: '',
      className: '',
      subject: '',
      date: '',
      startTime: '',
      endTime: '',
      venue: '',
    },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="examName">Exam Name</Label>
        <Input
          id="examName"
          name="examName"
          value={formData.examName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="className">Class Name</Label>
        <Input
          id="className"
          name="className"
          value={formData.className}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="startTime">Start Time</Label>
        <Input
          id="startTime"
          name="startTime"
          type="time"
          value={formData.startTime}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="endTime">End Time</Label>
        <Input
          id="endTime"
          name="endTime"
          type="time"
          value={formData.endTime}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="venue">Venue</Label>
        <Input id="venue" name="venue" value={formData.venue} onChange={handleChange} required />
      </div>
      <Button type="submit">{submitText}</Button>
    </form>
  );
};

const AddRoutineModal = ({
  onAddRoutine,
}: {
  onAddRoutine: (routineData: Omit<ExamRoutine, '_id'>) => Promise<void>;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add New Exam Routine</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Exam Routine</DialogTitle>
        </DialogHeader>
        <RoutineForm onSubmit={onAddRoutine} submitText="Add Routine" />
      </DialogContent>
    </Dialog>
  );
};

const EditRoutineModal = ({
  routine,
  onUpdateRoutine,
  onClose,
}: {
  routine: ExamRoutine;
  onUpdateRoutine: (id: string, routineData: Omit<ExamRoutine, '_id'>) => Promise<void>;
  onClose: () => void;
}) => {
  const handleSubmit = (data: RoutineFormData) => {
    onUpdateRoutine(routine._id, data);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Exam Routine</DialogTitle>
        </DialogHeader>
        <RoutineForm initialData={routine} onSubmit={handleSubmit} submitText="Update Routine" />
      </DialogContent>
    </Dialog>
  );
};

export default ExamRoutineDashboard;
