import * as DialogPrimivite from "@radix-ui/react-dialog";
import type React from "react";
import { Card } from "../ui/Card";
import Text from "../ui/Text";
import ButtonIcon from "../ui/ButtonIcon";
import XIcon from "../../assets/icons/x.svg?react";
import Divider from "../ui/Divider";

export const Dialog = DialogPrimivite.Root;
export const DialogTrigger = DialogPrimivite.Trigger;
export const DialogClose = DialogPrimivite.Close;

export function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimivite.Overlay>) {
  return (
    <DialogPrimivite.Overlay
      className={`
      fixed inset-0 z-50 bg-black/50
      backdrop-blur-sm
      data-[state=open]:animate-in
      data-[state=open]:fade-in-0 
      data-[state=closed]:animate-out
      data-[state=closed]:fade-out-0
    `}
      {...props}
    />
  );
}

export function DialogContent({
  className,
  ref,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimivite.Content>) {
  return (
    <DialogPrimivite.Portal>
      <DialogOverlay />
      <DialogPrimivite.Content
        ref={ref}
        className={`
        w-full max-w-[22rem] md:max-w-[28rem] p-4
        fixed left-[50%] top-[50%]
        z-[60] translate-x-[-50%] translate-y-[-50%]
        data-[state=open]:animate-in
        data-[state=open]:fade-in-0 
        data-[state=open]:slide-in-from-bottom-[48%]
        data-[state=closed]:animate-out
        data-[state=closed]:fade-out-0
        data-[state=closed]:slide-out-to-bottom-[48%]
        `}
        {...props}
      >
        <Card>{children}</Card>
      </DialogPrimivite.Content>
    </DialogPrimivite.Portal>
  );
}

export function DialogHeader({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <>
      <header
        className={`
          flex items-center justify-between py-5 px-7
        `}
        {...props}
      >
        <DialogPrimivite.Title>
          <Text variant="text-md-bold" className="flex-1 text-gray-200">
            {children}
          </Text>
        </DialogPrimivite.Title>
        <DialogClose asChild>
          <ButtonIcon className="p-0" icon={XIcon} variant="linkDefault" />
        </DialogClose>
      </header>
      <Divider />
    </>
  );
}

export function DialogBody({
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className="pt-7 pb-5" {...props}>
      {children}
    </div>
  );
}

export function DialogFooter({
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div {...props}>
      <Divider />
      <footer className="px-7 py-6">{children}</footer>
    </div>
  );
}
