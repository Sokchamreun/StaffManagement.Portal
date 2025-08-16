import { Menubar } from 'primereact/menubar';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
    const router = useRouter();

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            command: () => router.push('/')
        },
        {
            label: 'Employees',
            icon: 'pi pi-fw pi-users',
            command: () => router.push('/employees')
        }
    ];

    const start = (
        <div className="flex align-items-center">
            <i className="pi pi-briefcase text-2xl mr-2"></i>
            <span className="font-bold text-xl">Staff Management</span>
        </div>
    );

    return (
        <div>
            <Menubar model={items} start={start} className="mb-3" />
            <main className="p-3">
                {children}
            </main>
        </div>
    );
}
