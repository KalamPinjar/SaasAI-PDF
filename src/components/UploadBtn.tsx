"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";

const UploadButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <Button className="font-semibold dark:text-white/75">Upload PDF</Button>
      </DialogTrigger>
      <DialogContent>adw</DialogContent>
    </Dialog>
  );
};

export default UploadButton;
