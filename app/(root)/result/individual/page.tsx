'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';

const IndividualResult = () => {
  const onSubmit = () => {};
  const form = useForm();
  return (
    <div>
      <h2 className="heading">individual Result</h2>
      <Form {...form}>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-4 items-end py-2 pb-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel className="text-xs ps-1">Student ID *</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-none py-6 border-e-0 placeholder:opacity-"
                      placeholder="Student ID *"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
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
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs ps-1">Select Academic Year*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none py-6 border-x-0 placeholder:opacity-25">
                        <SelectValue
                          placeholder="Select Academic Year*"
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
    </div>
  );
};

export default IndividualResult;
