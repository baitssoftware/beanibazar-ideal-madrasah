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
import { useCreate, useDelete, useGetList, useUpdate } from '@/hooks/APIHooks';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';

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

const ClassRoutine = () => {
  const [editingRoutine, setEditingRoutine] = useState<ClassRoutine | null>(null);

  const {
    data: routines,
    isLoading,
    refetch,
  } = useGetList<ClassRoutine>('/class-routine', 'classRoutines');
  const { mutateAsync: createRoutine } = useCreate<ClassRoutine>('/class-routine', 'classRoutines');
  const { mutateAsync: updateRoutine } = useUpdate<ClassRoutine>('/class-routine', 'classRoutines');
  const { mutateAsync: deleteRoutine } = useDelete('/class-routine', 'classRoutines');

  const handleCreateRoutine = async (routineData: Omit<ClassRoutine, '_id'>) => {
    try {
      await createRoutine({
        body: routineData as unknown as ClassRoutine,
        callbacks: {
          onSuccess: () => {
            toast({ title: 'Success', description: 'Class routine created successfully' });
            refetch();
          },
          onError: (error) => {
            toast({
              title: 'Error',
              description: error.message || 'Failed to create class routine',
              variant: 'destructive',
            });
          },
        },
      });
    } catch (error) {
      console.error('Failed to create class routine:', error);
    }
  };

  const handleUpdateRoutine = async (id: string, routineData: Omit<ClassRoutine, '_id'>) => {
    try {
      await updateRoutine({
        id,
        body: routineData,
        callbacks: {
          onSuccess: () => {
            toast({ title: 'Success', description: 'Class routine updated successfully' });
            refetch();
            setEditingRoutine(null);
          },
          onError: (error) => {
            toast({
              title: 'Error',
              description: error.message || 'Failed to update class routine',
              variant: 'destructive',
            });
          },
        },
      });
    } catch (error) {
      console.error('Failed to update class routine:', error);
    }
  };

  const handleDeleteRoutine = async (id: string) => {
    try {
      await deleteRoutine({
        id,
        callbacks: {
          onSuccess: () => {
            toast({ title: 'Success', description: 'Class routine deleted successfully' });
            refetch();
          },
          onError: (error) => {
            toast({
              title: 'Error',
              description: error.message || 'Failed to delete class routine',
              variant: 'destructive',
            });
          },
        },
      });
    } catch (error) {
      console.error('Failed to delete class routine:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Class Routines</h1>

      <AddRoutineModal onAddRoutine={handleCreateRoutine} />

      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>Class</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Day</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Teacher</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {routines?.map((routine) => (
            <TableRow key={routine._id}>
              <TableCell>{routine.className}</TableCell>
              <TableCell>{routine.section}</TableCell>
              <TableCell>{routine.day}</TableCell>
              <TableCell>{`${routine.startTime} - ${routine.endTime}`}</TableCell>
              <TableCell>{routine.subject}</TableCell>
              <TableCell>{routine.teacherName}</TableCell>
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
  className: string;
  section: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacherName: string;
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
      className: '',
      section: '',
      day: '',
      startTime: '',
      endTime: '',
      subject: '',
      teacherName: '',
    },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <Label htmlFor="section">Section</Label>
        <Input
          id="section"
          name="section"
          value={formData.section}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="day">Day</Label>
        <Select name="day" value={formData.day} onValueChange={handleSelectChange('day')}>
          <SelectTrigger>
            <SelectValue placeholder="Select a day" />
          </SelectTrigger>
          <SelectContent>
            {days.map((day) => (
              <SelectItem key={day} value={day}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <Label htmlFor="teacherName">Teacher Name</Label>
        <Input
          id="teacherName"
          name="teacherName"
          value={formData.teacherName}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit">{submitText}</Button>
    </form>
  );
};

const AddRoutineModal = ({
  onAddRoutine,
}: {
  onAddRoutine: (routineData: Omit<ClassRoutine, '_id'>) => Promise<void>;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add New Routine</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Class Routine</DialogTitle>
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
  routine: ClassRoutine;
  onUpdateRoutine: (id: string, routineData: Omit<ClassRoutine, '_id'>) => Promise<void>;
  onClose: () => void;
}) => {
  const handleSubmit = (data: RoutineFormData) => {
    onUpdateRoutine(routine._id, data);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Class Routine</DialogTitle>
        </DialogHeader>
        <RoutineForm initialData={routine} onSubmit={handleSubmit} submitText="Update Routine" />
      </DialogContent>
    </Dialog>
  );
};

export default ClassRoutine;
