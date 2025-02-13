'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

interface FormValues {
  status: 'active' | 'inactive';
  image: FileList;
}

interface AddSliderModalProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAdd: any;
  disabled?: boolean;
}

export const AddSliderModal: React.FC<AddSliderModalProps> = ({ onAdd, disabled }) => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const formData = new FormData();
    formData.append('status', data.status);
    if (data.image && data.image.length > 0) {
      formData.append('image', data.image[0]);
    }

    try {
      await onAdd(formData);
      setOpen(false);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg"
        >
          Add Slider
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Slider</DialogTitle>
          <DialogDescription>Fill in the details to add a new slider.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={(value) => setValue('status', value as 'active' | 'inactive')}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              {...register('image', { required: 'Image is required' })}
            />
            {errors.image && <p className="text-xs text-red-500">{errors.image.message}</p>}
          </div>
          <Button type="submit" disabled={disabled} className="w-full">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
