'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetList } from '@/hooks/APIHooks';
import { Book, Calendar, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

type Teacher = {
  id: number;
  name: string;
  department: string;
  subject: string;
  email: string;
  phone: string;
  image: string;
  education: string;
  experience: string;
};

export default function TeacherListForUser() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const { data: teachers, isLoading } = useGetList<Teacher>('/teachers', 'teachers');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const filterTeachers = (department: string) => {
    return (
      teachers?.filter(
        (teacher) =>
          (department === 'All' || teacher.department === department) &&
          (teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())),
      ) || []
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">আমাদের শিক্ষকমণ্ডলী</h1>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="শিক্ষক বা বিষয় অনুসন্ধান করুন"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm mx-auto"
        />
      </div>

      <Tabs defaultValue="All" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {['All', 'Science', 'Arts', 'Commerce', 'General'].map((department) => (
            <TabsTrigger key={department} value={department}>
              {department === 'All' ? 'সকল' : department}
            </TabsTrigger>
          ))}
        </TabsList>

        {['All', 'Science', 'Arts', 'Commerce', 'General'].map((department) => (
          <TabsContent key={department} value={department}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterTeachers(department).map((teacher) => (
                <Card key={teacher.id} className="flex flex-col">
                  <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${teacher.image}`}
                        alt={teacher.name}
                      />
                      <AvatarFallback>
                        {teacher.name
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{teacher.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1 bg-blue-100">
                        <Book className="h-3 w-3 mr-1" />
                        {teacher.subject}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex items-center mt-2">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="text-sm">{teacher.email}</p>
                    </div>
                    <div className="flex items-center mt-2">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="text-sm">{teacher.phone}</p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          className="mt-4 text-sm text-primary hover:underline font-bold text-blue-400"
                          onClick={() => setSelectedTeacher(teacher)}
                        >
                          বিস্তারিত দেখুন
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>{selectedTeacher?.name || 'N/A'}</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          <Avatar className="h-24 w-24 mx-auto">
                            <AvatarImage
                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${teacher.image}`}
                              alt={selectedTeacher?.name}
                            />
                            <AvatarFallback>
                              {selectedTeacher?.name
                                ?.split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="mt-4 space-y-2">
                            <p>
                              <strong>বিভাগ:</strong> {selectedTeacher?.department || 'N/A'}
                            </p>
                            <p>
                              <strong>বিষয়:</strong> {selectedTeacher?.subject || 'N/A'}
                            </p>
                            <p>
                              <strong>ইমেইল:</strong> {selectedTeacher?.email || 'N/A'}
                            </p>
                            <p>
                              <strong>ফোন:</strong> {selectedTeacher?.phone || 'N/A'}
                            </p>
                            <p>
                              <strong>শিক্ষাগত যোগ্যতা:</strong>{' '}
                              {selectedTeacher?.education || 'N/A'}
                            </p>
                            <p className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>
                                <strong>অভিজ্ঞতা:</strong> {selectedTeacher?.experience || 'N/A'}
                              </span>
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
            {filterTeachers(department).length === 0 && (
              <p className="text-center text-muted-foreground mt-8">
                কোন শিক্ষক পাওয়া যায়নি। অনুগ্রহ করে আবার অনুসন্ধান করুন।
              </p>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
