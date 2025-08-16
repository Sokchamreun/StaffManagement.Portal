import { useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="p-4">
            <div className="grid">
                <div className="col-12">
                    <h1 className="text-center text-6xl text-primary mb-4">Staff Management Portal</h1>
                </div>
                
                <div className="col-12 md:col-6 md:col-offset-3">
                    <Card title="Employee Management" className="h-full">
                        <p className="m-0 mb-3">
                            Manage your employees with full CRUD operations including create, read, update, and delete functionality.
                        </p>
                        <Link href="/employees">
                            <Button 
                                label="Manage Employees" 
                                icon="pi pi-users" 
                                className="w-full"
                            />
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
}