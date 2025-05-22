// components/ui/modal.tsx
'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Button } from './button';

export const Modal = Dialog.Root;
export const ModalTrigger = Dialog.Trigger;

export function ModalContent({
    children,
    className = '',
    ...props
}: Dialog.DialogContentProps & { className?: string }) {
    return (
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content
                className={`fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-lg ${className}`}
                {...props}
            >
                {children}
            </Dialog.Content>
        </Dialog.Portal>
    );
}

export function ModalHeader({ children }: { children: React.ReactNode }) {
    return <div className="mb-4">{children}</div>;
}

export function ModalTitle({ children }: { children: React.ReactNode }) {
    return (
        <Dialog.Title className="text-lg font-semibold leading-none">
            {children}
        </Dialog.Title>
    );
}

export function ModalDescription({ children }: { children: React.ReactNode }) {
    return (
        <Dialog.Description className="text-sm text-gray-500">
            {children}
        </Dialog.Description>
    );
}

export function ModalFooter({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={`mt-6 flex justify-end ${className}`}>{children}</div>;
}

export function ModalClose({
    children,
    ...props
}: React.ComponentProps<typeof Dialog.Close>) {
    return (
        <Dialog.Close
            className="absolute top-3 right-3 rounded-full p-1 hover:bg-gray-200"
            {...props}
        >
            {children ?? <X className="h-4 w-4" />}
        </Dialog.Close>
    );
}
