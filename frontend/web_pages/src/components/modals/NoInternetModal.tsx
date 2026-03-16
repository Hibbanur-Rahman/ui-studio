"use client";

import React, { useEffect, useState } from "react";
import { WifiOff, RefreshCw, X } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const NoInternetModal = () => {
    const isOnline = useOnlineStatus();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!isOnline) {
            setShowModal(true);
        } else {
            // Add a small delay before hiding to ensure connection is stable
            const timer = setTimeout(() => {
                setShowModal(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isOnline]);

    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent
                showCloseButton={false}
                className="sm:max-w-md border-none bg-white rounded-3xl shadow-2xl p-0 overflow-hidden outline-none"
            >
                <div className="relative bg-[#5ca452]/5 p-8 flex flex-col items-center justify-center text-center">
                    <button
                        onClick={() => setShowModal(false)}
                        className="absolute right-4 top-4 p-2 rounded-full hover:bg-[#5ca452]/10 text-gray-400 hover:text-[#5ca452] transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="w-20 h-20 bg-[#5ca452]/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <WifiOff className="w-10 h-10 text-[#5ca452]" />
                    </div>

                    <DialogHeader className="space-y-3 flex flex-col items-center">
                        <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
                            Connection Lost
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 text-base leading-relaxed max-w-[280px] text-center">
                            It looks like you're offline. Please check your internet connection and try again.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-8 w-full px-4 pb-4">
                        <Button
                            onClick={handleRetry}
                            className="w-full h-12 bg-[#5ca452] hover:bg-[#4a8a42] text-white font-bold rounded-2xl transition-all shadow-lg shadow-[#5ca452]/20 flex items-center justify-center gap-2 group border-none"
                        >
                            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                            Retry Connection
                        </Button>
                        <p className="mt-4 text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                            The modal will close automatically once you're back online
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
