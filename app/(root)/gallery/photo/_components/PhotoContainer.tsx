/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useImageUpload } from '@/app/(dashboard)/hooks/useImageUpload';
import ImageSkeleton from '@/components/shared/skeleton/ImageSkeleton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetList } from '@/hooks/APIHooks';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaRegTrashAlt } from 'react-icons/fa';

interface Photo {
  _id: string;
  title: string;
  image: string;
}

const PhotoContainer = () => {
  const pathName = usePathname();
  const { data: photos, isLoading } = useGetList<Photo>('/photo', 'photos');

  return (
    <section className="">
      <h2 className="heading">Photo Gallery</h2>

      {/* --- Admin Button --- */}
      {pathName.includes('dashboard') && (
        <div className=" mt-10 w-full flex items-center justify-center  lg:px-0 sm:px-6 px-4 gap-8">
          <Button className="shadow-xl drop-shadow-xl bg-blue-700 py-8 px-8 text-lg  rounded-sm text-white ">
            Add Photos
          </Button>
          <Button className="shadow-xl bg-red-600 drop-shadow-xl  py-8 px-8 text-lg  rounded-sm text-white ">
            Delete Multiple Photos
          </Button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-x-4 gap-y-6 pt-10 pb-6 px-6">
        {!isLoading &&
          photos?.map((photo, idx) => (
            <div
              className=" shadow-lg overflow-hidden w-full border relative border-primary_school/10 "
              key={idx}
            >
              {isLoading ? (
                <ImageSkeleton className="h-72 w-full object-cover relative" />
              ) : (
                <Image
                  width={300}
                  height={300}
                  className="h-72 w-full object-cover relative"
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${photo.image}`}
                  alt={`${photo.title} ${idx}`}
                  priority
                ></Image>
              )}
              <h4 className="py-3 px-6 font-semibold text-xl">{photo.title}</h4>

              {/* --- Admin Button --- */}
              {pathName.includes('dashboard') && (
                <div className="mt-10 absolute right-1 -top-8  flex flex-col gap-y-2 bg-white p-3 rounded-lg">
                  <EditModal data={photo} />
                  <DeleteModal data={photo} />
                </div>
              )}
            </div>
          ))}
      </div>
      {/* pagination  */}
      {/* <div className="flex items-center justify-center py-10 lg:px-0 sm:px-6 px-4">
        <div className=" w-full  flex items-center justify-between border-t border-gray-200">
          <div className="flex items-center pt-3 text-gray-600 hover:text-indigo-700 cursor-pointer">
            <svg
              width="14"
              height="8"
              viewBox="0 0 14 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.1665 4H12.8332"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1.1665 4L4.49984 7.33333"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1.1665 4.00002L4.49984 0.666687"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-sm ml-3 font-medium leading-none ">Previous</p>
          </div>
          <div className="sm:flex hidden">
            <p className="text-sm font-medium leading-none cursor-pointer text-indigo-700 border-t border-indigo-400 pt-3 mr-4 px-2">
              1
            </p>
            <p className="text-sm font-medium leading-none cursor-pointer text-gray-600 hover:text-indigo-700 border-t border-transparent hover:border-indigo-400 pt-3 mr-4 px-2">
              2
            </p>
            <p className="text-sm font-medium leading-none cursor-pointer text-gray-600 hover:text-indigo-700 border-t border-transparent hover:border-indigo-400 pt-3 mr-4 px-2">
              3
            </p>
            <p className="text-sm font-medium leading-none cursor-pointer text-gray-600 hover:text-indigo-700 border-t border-transparent hover:border-indigo-400 pt-3 mr-4 px-2">
              4
            </p>
            <p className="text-sm font-medium leading-none cursor-pointer text-gray-600 hover:text-indigo-700 border-t border-transparent hover:border-indigo-400 pt-3 mr-4 px-2">
              5
            </p>
            <p className="text-sm font-medium leading-none cursor-pointer text-gray-600 hover:text-indigo-700 border-t border-transparent hover:border-indigo-400 pt-3 mr-4 px-2">
              6
            </p>
            <p className="text-sm font-medium leading-none cursor-pointer text-gray-600 hover:text-indigo-700 border-t border-transparent hover:border-indigo-400 pt-3 mr-4 px-2">
              7
            </p>
            <p className="text-sm font-medium leading-none cursor-pointer text-gray-600 hover:text-indigo-700 border-t border-transparent hover:border-indigo-400 pt-3 mr-4 px-2">
              8
            </p>
          </div>
          <div className="flex items-center pt-3 text-gray-600 hover:text-indigo-700 cursor-pointer">
            <p className="text-sm font-medium leading-none mr-3">Next</p>
            <svg
              width="14"
              height="8"
              viewBox="0 0 14 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.1665 4H12.8332"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.5 7.33333L12.8333 4"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.5 0.666687L12.8333 4.00002"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div> */}
    </section>
  );
};

export default PhotoContainer;

export function EditModal({ data }: { data: any }) {
  const {
    previewUrl: govtPreviewUrl,

    error: govtError,
    handleFileChange: handleGovtFileChange,
  } = useImageUpload(data.url);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#43B74A] shadow-xl drop-shadow-xl px-5 py-3 rounded-sm text-white ">
          Replace
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-scroll max-h-[95vh]">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>

        {/* ----------------------------- Dialogue Content ------------------------------ */}

        <div>
          <Label htmlFor="glanceLogo" className="text-2xl">
            {/* Image for <strong>{data.name}</strong>{' '} */}
          </Label>
          <Input
            id="glanceLogo"
            type="file"
            accept="image/*"
            onChange={handleGovtFileChange}
            className="mt-2 font-semibold text-green-500"
          />
          {govtPreviewUrl && (
            <Image
              src={govtPreviewUrl}
              alt="Government Logo Preview"
              width={200}
              height={100}
              className="mt-2 object-cover rounded-lg w-full"
              priority
            />
          )}
          {govtError && <p className="text-red-500 text-sm mt-1">{govtError}</p>}

          {/* --- data name --- */}
          <div className="mt-10">
            <Label htmlFor="description" className="text-xl font-semibold text-gray-500">
              Photo Name :
            </Label>
            <input
              id="description"
              name="description"
              value={data.title}
              // onChange={handleInputChange}
              className="mt-2 w-full border border-gray-300 rounded-lg p-2 "
            />
          </div>
        </div>

        {/* ----------------------------- Dialogue Content ------------------------------ */}

        <DialogFooter>
          <Button
            type="submit"
            className="bg-[#43B74A] shadow-lg drop-shadow-lg w-full text-lg mt-5 "
          >
            Replace Photo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteModal({ data }: { data: any }) {
  const { previewUrl: govtPreviewUrl, error: govtError } = useImageUpload(data.url);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#FF0135] shadow-xl drop-shadow-xl px-5 py-3 rounded-sm text-white ">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-scroll max-h-[95vh]">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>

        {/* ----------------------------- Dialogue Content ------------------------------ */}

        <div>
          <Label htmlFor="glanceLogo" className="text-2xl">
            {/* Image for <strong>{data.name}</strong>{' '} */}
          </Label>
          {govtPreviewUrl && (
            <Image
              src={govtPreviewUrl}
              alt="Government Logo Preview"
              width={200}
              height={100}
              className="mt-2 object-cover rounded-lg w-full"
              priority
            />
          )}
          {govtError && <p className="text-red-500 text-sm mt-1">{govtError}</p>}

          {/* --- data name --- */}
        </div>

        {/* ----------------------------- Dialogue Content ------------------------------ */}

        <DialogFooter>
          <Button
            type="submit"
            className="bg-[#FF0135] text-white mt-5 text-lg w-full hover:text-white"
          >
            {' '}
            <FaRegTrashAlt /> Delete Photo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
