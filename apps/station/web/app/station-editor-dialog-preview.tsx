"use client";
import { useState, type ReactNode } from "react";
import { Button, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@system-builder/ui-core";
import { validDialogProperties, type ComponentProperties } from "@system-builder/station-composition";
/** Actual local overlay behavior; only inert authored presentation is persisted. */
export function EditorDialogPreview({ label, properties, children }: Readonly<{ label: string; properties?: ComponentProperties | undefined; children?: ReactNode }>) {
  const [open, setOpen] = useState(false);
  if (properties !== undefined && !validDialogProperties(properties)) throw new Error("Invalid admitted Dialog properties");
  const disabled = properties?.disabled ?? false;
  return <Dialog open={open && !disabled} onOpenChange={next => setOpen(next && !disabled)}>
    <DialogTrigger className="" disabled={disabled} render={<Button variant="outline" className="w-full min-w-0" aria-label={"Open " + label} title={label}><span className="truncate">{label}</span></Button>} />
    <DialogContent>
      <DialogTitle>{properties && validDialogProperties(properties) ? properties.title : "Dialog"}</DialogTitle>
      <DialogDescription>{properties && validDialogProperties(properties) ? properties.description : ""}</DialogDescription>
      <div data-slot="editor-dialog-body" className="flex min-w-0 flex-col gap-2">{children}</div>
      <DialogClose className="" render={<Button variant="outline" />}>Close dialog preview</DialogClose>
    </DialogContent>
  </Dialog>;
}
