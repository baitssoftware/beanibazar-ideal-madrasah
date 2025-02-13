/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import SharedTable from '@/components/table/SharedTable';
import { FormControl } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useCreate, useDelete, useGetList, useUpdate } from '@/hooks/APIHooks';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useCallback } from 'react';
import { AddSliderModal } from './AddSliderForm';

// Base interface for slider data without ID
interface SliderDataBase {
  image: any;
  status: 'active' | 'inactive';
}

// Extended interface that includes ID (for responses from backend)
interface SliderData extends SliderDataBase {
  _id: string;
}

const EditableSlider: React.FC = () => {
  const { data: sliderData, isLoading } = useGetList<SliderData>('/slider', 'slider');
  const { mutateAsync: createSlider, isPending: isCreating } = useCreate('/slider', 'slider');
  const { mutateAsync: updateSlider, isPending: isUpdating } = useUpdate<SliderData>(
    '/slider',
    'slider',
  );
  const { mutateAsync: deleteSlider, isPending: isDeleting } = useDelete('/slider', 'slider');

  const handleStatusToggle = useCallback(
    async (slider: SliderData) => {
      try {
        const updatedStatus = slider.status === 'active' ? 'inactive' : 'active';

        await updateSlider({
          id: slider._id,
          body: { status: updatedStatus },
          callbacks: {
            onSuccess: () => {
              toast({
                title: 'Success',
                description: 'Slider status updated successfully',
              });
            },
            onError: () => {
              toast({
                title: 'Error',
                description: 'Failed to update slider status',
                variant: 'destructive',
              });
            },
          },
        });
      } catch (error) {
        console.error('Failed to update slider status:', error);
      }
    },
    [updateSlider],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteSlider({
          id,
          callbacks: {
            onSuccess: () => {
              toast({
                title: 'Success',
                description: 'Slider deleted successfully',
              });
            },
            onError: () => {
              toast({
                title: 'Error',
                description: 'Failed to delete slider',
                variant: 'destructive',
              });
            },
          },
        });
      } catch (error) {
        console.error('Failed to delete slider:', error);
      }
    },
    [deleteSlider],
  );

  const handleCreate = useCallback(
    async (newSlider: SliderDataBase) => {
      try {
        await createSlider({
          body: newSlider,
          callbacks: {
            onSuccess: (data) => {
              if (data) {
                toast({
                  title: 'Success',
                  description: 'Slider created successfully',
                });
              }
            },
            onError: () => {
              toast({
                title: 'Error',
                description: 'Failed to create slider',
                variant: 'destructive',
              });
            },
          },
        });
      } catch (error) {
        console.error('Failed to create slider:', error);
      }
    },
    [createSlider],
  );

  const columns = [
    {
      title: 'Slider Image',
      dataKey: 'imageUrl',
      row: (data: SliderData) => (
        <div className="flex gap-5 items-center">
          <Image
            className="w-16 h-12 object-cover"
            src={
              data?.image
                ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${data.image}`
                : 'https://placehold.co/100x100/e2e2db/red/png'
            }
            alt="Slider image"
            priority
            width={50}
            height={50}
          />
        </div>
      ),
    },
    {
      title: 'Status',
      dataKey: 'status',
      row: (data: SliderData) => (
        <FormControl>
          <Switch
            checked={data.status === 'active'}
            onCheckedChange={() => handleStatusToggle(data)}
            disabled={isUpdating}
          />
        </FormControl>
      ),
    },
    {
      title: 'Actions',
      dataKey: 'actions',
      row: (data: SliderData) => (
        <div className="flex gap-3">
          <button
            className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            onClick={() => handleDelete(data._id)}
            disabled={isDeleting}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5  p-3 bg-primary_school ">
      <div className="flex justify-end gap-4">
        <AddSliderModal onAdd={handleCreate} disabled={isCreating} />
      </div>
      <div>
        <SharedTable columns={columns} isLoading={isLoading} data={sliderData ? sliderData : []} />
      </div>
    </div>
  );
};

export default EditableSlider;
