'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';

import { useForm } from 'react-hook-form';

const SectionWiseResult = () => {
  const onSubmit = () => {};
  const form = useForm();

  const students = [
    {
      SL: 1,
      Photo: '/videos/2.jpg',
      StudentID: 'S1234',
      RollNo: 'R001',
      Name: 'John Doe',
      TotalMarks: 450,
      GPA: 4.0,
      Grade: 'A+',
    },
    {
      SL: 2,
      Photo: '/videos/3.jpg',
      StudentID: 'S1235',
      RollNo: 'R002',
      Name: 'Jane Smith',
      TotalMarks: 430,
      GPA: 3.8,
      Grade: 'A',
    },
    // Add more student objects as needed
  ];

  return (
    <div className="pb-6">
      <h2 className="heading">Section Wise Result</h2>
      <Form {...form}>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-5 items-end py-4 pb-6">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs ps-1">Select Exam Name*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none py-6 placeholder:opacity-25">
                        <SelectValue
                          placeholder="Select Exam Name*"
                          className="placeholder:opacity-25 rounded-none "
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="half-yearly-exam">Half Yearly Exam</SelectItem>
                      <SelectItem value="annual-exam">Annual Exam</SelectItem>
                      <SelectItem value="pre-test-exam">Pre-Test Exam</SelectItem>
                      <SelectItem value="test-exam">Test Exam</SelectItem>
                      <SelectItem value="2nd-assessment-exam">2nd Assessment Exam</SelectItem>
                      <SelectItem value="final-exam">Final Exam</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="class"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs ps-1">Select Class*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none border-x-0 py-6 placeholder:opacity-25">
                        <SelectValue
                          placeholder="Select Class*"
                          className="placeholder:opacity-25 rounded-none "
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Play</SelectItem>
                      <SelectItem value="2">Nursery</SelectItem>
                      <SelectItem value="3">KG</SelectItem>
                      <SelectItem value="4">One</SelectItem>
                      <SelectItem value="5">Two</SelectItem>
                      <SelectItem value="6">Three</SelectItem>
                      <SelectItem value="7">Four</SelectItem>
                      <SelectItem value="8">Five</SelectItem>
                      <SelectItem value="9">Six</SelectItem>
                      <SelectItem value="10">Seven</SelectItem>
                      <SelectItem value="11">Eight</SelectItem>
                      <SelectItem value="12">Nine</SelectItem>
                      <SelectItem value="13">Ten</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs ps-1">Select Academic Year*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none py-6  placeholder:opacity-25">
                        <SelectValue
                          placeholder="Select Academic Year*"
                          className="placeholder:opacity-25"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">N/A</SelectItem>
                      <SelectItem value="2">Morning</SelectItem>
                      <SelectItem value="3">Day</SelectItem>
                      <SelectItem value="4">Lotus Play Mor</SelectItem>
                      <SelectItem value="5">Lotus Play Day</SelectItem>
                      <SelectItem value="6">Rose Play Day</SelectItem>
                      <SelectItem value="7">Rose Play Mor</SelectItem>
                      <SelectItem value="8">Maloti Mor Nur</SelectItem>
                      <SelectItem value="9">Sunflower Day Nur</SelectItem>
                      <SelectItem value="10">Lily KG Mor</SelectItem>
                      <SelectItem value="11">Bela Day KG</SelectItem>
                      <SelectItem value="12">Bokul One</SelectItem>
                      <SelectItem value="13">Day Daffodil</SelectItem>
                      <SelectItem value="14">Day Crimson</SelectItem>
                      <SelectItem value="15">Morning Crimson</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs ps-1">Select Section*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none py-6 border-x-0 placeholder:opacity-25">
                        <SelectValue
                          placeholder="Select Section*"
                          className="placeholder:opacity-25"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="2018">2018</SelectItem>
                      <SelectItem value="2019">2019</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <Button className="rounded-none py-[25px] placeholder:opacity-25" type="submit">
              Search
            </Button>
          </div>
        </form>
      </Form>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border ">
        <thead className="text-lg font-normal text-white bg-secondary_school dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              SL
            </th>
            <th scope="col" className="px-6 py-3">
              Photo
            </th>
            <th scope="col" className="px-6 py-3">
              Student ID
            </th>
            <th scope="col" className="px-6 py-3">
              Roll No
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Total Marks
            </th>
            <th scope="col" className="px-6 py-3">
              GPA
            </th>
            <th scope="col" className="px-6 py-3">
              Grade
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr
              key={index}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="px-6 py-4">{student.SL}</td>
              <td className="px-6 py-4">
                <Image
                  className="w-10 h-10 rounded-full object-cover"
                  src={student.Photo}
                  alt={student.Name}
                  width={50}
                  height={50}
                  priority
                />
              </td>
              <td className="px-6 py-4">{student.StudentID}</td>
              <td className="px-6 py-4">{student.RollNo}</td>
              <td className="px-6 py-4">{student.Name}</td>
              <td className="px-6 py-4">{student.TotalMarks}</td>
              <td className="px-6 py-4">{student.GPA}</td>
              <td className="px-6 py-4">{student.Grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SectionWiseResult;
