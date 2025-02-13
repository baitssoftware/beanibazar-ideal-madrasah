/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from '@/hooks/use-toast';
import { useCallback, useState } from 'react';
import { AiFillWarning } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import { AlertDialog, AlertDialogContent, AlertDialogTitle } from './ui/alert-dialog';
import { Button } from './ui/button';

interface DeleteActionProps {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  handleDeleteSubmit: Function;
}

const DeleteAction: React.FC<DeleteActionProps> = ({ handleDeleteSubmit }) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleDelete = useCallback(async () => {
    try {
      await handleDeleteSubmit();
      toast({
        variant: 'default',
        description: `Deleted Successfully!`,
      });
      setOpen(false);
    } catch (err: any) {
      for (const key of err.errors) {
        toast({
          variant: 'destructive',
          description: `${key?.attr} - ${key?.detail}`,
        });
      }
    }
  }, [handleDeleteSubmit]);

  return (
    <div>
      <AlertDialog open={open} onOpenChange={() => setOpen(!open)}>
        <div
          onClick={() => setOpen(!open)}
          className="cursor-pointer p-1 rounded-full flex items-center justify-center bg-black"
        >
          <TiDeleteOutline className="text-2xl text-red-500" />
        </div>
        <AlertDialogContent className="py-10">
          <AlertDialogTitle></AlertDialogTitle>
          <div>
            <div className="flex justify-center pb-3">
              <p>
                <AiFillWarning className="text-red-500 text-7xl" />
              </p>
            </div>
            <h3 className="text-4xl font-semibold text-center">Confirm Delete!</h3>
            <p className="text-center py-2">
              Are you sure you want to <br /> delete this file?
            </p>
          </div>
          <div className="flex justify-center gap-8">
            <Button
              className="bg-red-100 text-black"
              onClick={() => setOpen(false)}

              //   variant={"outlineBtn"}
            >
              Cancel
            </Button>
            <Button className="border" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteAction;
