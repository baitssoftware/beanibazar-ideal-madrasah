'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useCreate, useDelete, useGetList, useUpdate } from '@/hooks/APIHooks';
import { toast } from '@/hooks/use-toast';
import { Edit, Eye, Lightbulb, PlusCircle, Target, Trash2, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';

// Type definition
interface MissionVisionItem {
  id?: string;
  type: 'mission' | 'vision';
  mainDescription?: string;
  points?: string[];
  icon?: string;
  title?: string;
  description?: string;
}

export default function MissionAndVisionManagement() {
  // Custom hooks for data management
  const { data: items, refetch } = useGetList<MissionVisionItem>(
    '/mission-vision',
    'mission-vision',
  );
  const { mutateAsync: createItem } = useCreate<MissionVisionItem>(
    '/mission-vision',
    'mission-vision',
  );
  const { mutateAsync: updateItem } = useUpdate<MissionVisionItem>(
    '/mission-vision',
    'mission-vision',
  );
  const { mutateAsync: deleteItem } = useDelete('/mission-vision', 'mission-vision');

  // State for filtering and managing items
  const [selectedTab, setSelectedTab] = useState<'mission' | 'vision'>('mission');
  const [filteredItems, setFilteredItems] = useState<MissionVisionItem[]>([]);
  const [editingItem, setEditingItem] = useState<MissionVisionItem | null>(null);

  // Filter items based on selected tab
  useEffect(() => {
    if (items) {
      setFilteredItems(items.filter((item) => item.type === selectedTab));
    }
  }, [items, selectedTab]);

  // Create a new item
  const handleCreateItem = async (formData: Partial<MissionVisionItem>) => {
    try {
      await createItem({
        body: {
          ...formData,
          type: selectedTab,
        } as MissionVisionItem,
        callbacks: {
          onSuccess: () => {
            toast({
              title: 'সফল',
              description: 'সফলভাবে যোগ করা হয়েছে',
            });
            refetch();
            setEditingItem(null);
          },
          onError: (error) => {
            toast({
              title: 'ত্রুটি',
              description: error.message || 'যোগ করতে ব্যর্থ হয়েছে',
              variant: 'destructive',
            });
          },
        },
      });
    } catch (error) {
      console.error('Failed to create item:', error);
    }
  };

  // Update an existing item
  const handleUpdateItem = async (id: string, formData: Partial<MissionVisionItem>) => {
    try {
      await updateItem({
        id,
        body: formData as MissionVisionItem,
        callbacks: {
          onSuccess: () => {
            toast({
              title: 'সফল',
              description: 'সফলভাবে আপডেট করা হয়েছে',
            });
            refetch();
            setEditingItem(null);
          },
          onError: (error) => {
            toast({
              title: 'ত্রুটি',
              description: error.message || 'আপডেট করতে ব্যর্থ হয়েছে',
              variant: 'destructive',
            });
          },
        },
      });
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  };

  // Delete an item
  const handleDeleteItem = async (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে আপনি এটি মুছে ফেলতে চান?')) {
      try {
        await deleteItem({
          id,
          callbacks: {
            onSuccess: () => {
              toast({
                title: 'সফল',
                description: 'সফলভাবে মুছে ফেলা হয়েছে',
              });
              refetch();
            },
            onError: (error) => {
              toast({
                title: 'ত্রুটি',
                description: error.message || 'মুছে ফেলতে ব্যর্থ হয়েছে',
                variant: 'destructive',
              });
            },
          },
        });
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  // Render component
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Mission and Vision Management</h1>

      <Tabs
        defaultValue="mission"
        value={selectedTab}
        onValueChange={(value) => setSelectedTab(value as 'mission' | 'vision')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 bg-green-100">
          <TabsTrigger value="mission">Mission</TabsTrigger>
          <TabsTrigger value="vision">Vision</TabsTrigger>
        </TabsList>

        <TabsContent value="mission">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Mission Management</CardTitle>
              <Button onClick={() => setEditingItem({ type: 'mission' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Mission
              </Button>
            </CardHeader>
            <CardContent>
              {filteredItems.map((item) => (
                <div key={item.id} className="mb-4">
                  <div className="flex justify-between items-center">
                    <p>{item.mainDescription}</p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => setEditingItem(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteItem(item.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {item.points && (
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                      {item.points.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vision">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Vision Management</CardTitle>
              <Button onClick={() => setEditingItem({ type: 'vision' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Vision
              </Button>
            </CardHeader>
            <CardContent>
              {filteredItems.map((item) => (
                <div key={item.id} className="mb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {item.icon && (
                        <div className="mr-4 text-primary">{getIconComponent(item.icon)}</div>
                      )}
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => setEditingItem(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteItem(item.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit/Create Modal */}
      {editingItem && (
        <MissionVisionModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={(id, formData) => {
            if (id) {
              return handleUpdateItem(id, formData); // Update item
            } else {
              return handleCreateItem(formData); // Create item
            }
          }}
        />
      )}
    </div>
  );
}

// Helper function to render icon
function getIconComponent(iconName: string) {
  const IconComponents = {
    Lightbulb: <Lightbulb className="h-6 w-6" />,
    Users: <Users className="h-6 w-6" />,
    Target: <Target className="h-6 w-6" />,
    Eye: <Eye className="h-6 w-6" />,
  };

  return IconComponents[iconName as keyof typeof IconComponents] || null;
}

// Modal for Creating/Editing Items
function MissionVisionModal({
  item,
  onClose,
  onSave,
}: {
  item: MissionVisionItem;
  onClose: () => void;
  onSave: (id: string | undefined, data: Partial<MissionVisionItem>) => Promise<void>;
}) {
  const [formData, setFormData] = useState<Partial<MissionVisionItem>>(item);
  const [newPoint, setNewPoint] = useState<string>('');
  const iconOptions = ['Lightbulb', 'Users', 'Target', 'Eye'];

  const handleSubmit = () => {
    const submitData = { ...formData };
    onSave(item.id, submitData);
  };

  const addPoint = () => {
    if (newPoint.trim()) {
      setFormData((prev) => ({
        ...prev,
        points: [...(prev.points || []), newPoint.trim()],
      }));
      setNewPoint('');
    }
  };

  const removePoint = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      points: prev.points?.filter((_, index) => index !== indexToRemove),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {item.id ? 'Edit' : 'Add'} {item.type === 'mission' ? 'Mission' : 'Vision'}
        </h2>

        {item.type === 'mission' ? (
          <>
            <div className="mb-4">
              <Label>Mission Description</Label>
              <Textarea
                value={formData.mainDescription || ''}
                onChange={(e) => setFormData({ ...formData, mainDescription: e.target.value })}
                placeholder="Enter mission description"
                className="mt-2"
              />
            </div>

            <div className="mb-4">
              <Label>Mission Points</Label>
              <div className="flex mt-2">
                <Input
                  value={newPoint}
                  onChange={(e) => setNewPoint(e.target.value)}
                  placeholder="Enter a new point"
                  className="mr-2"
                />
                <Button onClick={addPoint} variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add
                </Button>
              </div>

              {formData.points && formData.points.length > 0 && (
                <div className="mt-4">
                  <Label>Current Points</Label>
                  <ul className="space-y-2 mt-2">
                    {formData.points.map((point, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center bg-gray-100 p-2 rounded"
                      >
                        <span>{point}</span>
                        <Button variant="ghost" size="icon" onClick={() => removePoint(index)}>
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="mb-4">
              <Label>Icon</Label>
              <Select
                value={formData.icon || ''}
                onValueChange={(value) => setFormData({ ...formData, icon: value })}
              >
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      {icon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <Label>Title</Label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter title"
                className="mt-2"
              />
            </div>

            <div className="mb-4">
              <Label>Description</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
                className="mt-2"
              />
            </div>
          </>
        )}

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </div>
    </div>
  );
}
