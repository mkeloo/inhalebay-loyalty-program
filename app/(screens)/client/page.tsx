import { ToastDemo } from '@/components/ToastDemo'
import React from 'react'

export default function ClientPage() {
    return (
        <div className="w-full h-screen flex justify-center items-start">
            <h1 className="text-4xl font-bold font-mono py-16">Client Page</h1>
            <div className='relative flex flex-col items-center'>
                <ToastDemo />
            </div>
        </div>
    )
}
