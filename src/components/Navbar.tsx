import { Link, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';

export function Navbar() {
    const { userRole, setUserRole, currentUser, setCurrentUser } = useApp();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    const handleSignOut = () => {
        setUserRole(null);
        setCurrentUser(null);
    };

    const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
        <Link
            to={to}
            className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive(to) ? "text-primary font-semibold" : "text-muted-foreground"
            )}
        >
            {children}
        </Link>
    );

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Shield className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground">Trusty Work</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex md:items-center md:gap-6">
                    {userRole === 'employer' && (
                        <>
                            <NavLink to="/workers">Browse Workers</NavLink>
                            <NavLink to="/jobs">My Jobs</NavLink>
                            <NavLink to="/attestations">Attestations</NavLink>
                        </>
                    )}

                    {userRole === 'worker' && (
                        <>
                            <NavLink to="/profile">My Profile</NavLink>
                            <NavLink to="/jobs">Find Jobs</NavLink>
                            <NavLink to="/cv/generate">CV Generator</NavLink>
                        </>
                    )}

                    {userRole ? (
                        <div className="flex items-center gap-4 ml-4">
                            <div className="text-sm text-right hidden lg:block">
                                <p className="font-medium leading-none">{currentUser?.name}</p>
                                <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleSignOut}>
                                Sign Out
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <NavLink to="/">Home</NavLink>
                            <Button size="sm" asChild>
                                <Link to="/">Get Started</Link>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-muted-foreground"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden border-t p-4 space-y-4 bg-background animate-in slide-in-from-top-4">
                    {userRole === 'employer' && (
                        <div className="flex flex-col gap-3">
                            <Link to="/workers" onClick={() => setIsMenuOpen(false)}>Browse Workers</Link>
                            <Link to="/jobs" onClick={() => setIsMenuOpen(false)}>My Jobs</Link>
                            <Link to="/attestations" onClick={() => setIsMenuOpen(false)}>Attestations</Link>
                        </div>
                    )}

                    {userRole === 'worker' && (
                        <div className="flex flex-col gap-3">
                            <Link to="/profile" onClick={() => setIsMenuOpen(false)}>My Profile</Link>
                            <Link to="/jobs" onClick={() => setIsMenuOpen(false)}>Find Jobs</Link>
                            <Link to="/cv/generate" onClick={() => setIsMenuOpen(false)}>CV Generator</Link>
                        </div>
                    )}

                    <div className="pt-4 border-t">
                        {userRole ? (
                            <Button variant="destructive" className="w-full" onClick={() => { handleSignOut(); setIsMenuOpen(false); }}>
                                Sign Out
                            </Button>
                        ) : (
                            <Button className="w-full" asChild onClick={() => setIsMenuOpen(false)}>
                                <Link to="/">Get Started</Link>
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
