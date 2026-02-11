import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
                    <p className="text-center text-sm leading-loose text-muted-foreground">
                        Built with trust. Powered by Stellar.
                    </p>
                </div>
            </footer>
        </div>
    );
}
