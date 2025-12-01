import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Calculator, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import GoldBarsAnimation from '../Components/GoldBarsAnimation';

export default function MainLayout({ children }) {
    const { t, i18n } = useTranslation();
    const { locale } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        if (locale && i18n.language !== locale) {
            i18n.changeLanguage(locale);
        }
        document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = locale;
    }, [locale, i18n]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    const toggleLanguage = () => {
        const newLocale = locale === 'ar' ? 'en' : 'ar';
        window.location.href = `/lang/${newLocale}`;
    };

    const closeMobileMenu = () => setMobileMenuOpen(false);

    const navLinks = [
        { href: '/', label: t('nav.home'), icon: Home },
        { href: '/simulator', label: t('nav.simulator'), icon: Calculator },
    ];

    return (
        <div className="min-h-screen bg-gold-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Radial gradient overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-gold-900)_0%,_transparent_50%)] opacity-60" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--color-gold-800)_0%,_transparent_40%)] opacity-30" />
                
                {/* Subtle pattern */}
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C6963F' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            {/* Gold Bars Animation */}
            <GoldBarsAnimation />

            {/* Navigation */}
            <nav className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled ? "bg-gold-950/90 backdrop-blur-xl border-b border-gold-800/50 shadow-lg shadow-gold-950/50" : "bg-transparent"
            )}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <motion.img 
                                src="/images/goldcom-logo1.jpg" 
                                alt="Goldcom" 
                                className="h-10 md:h-12 w-auto rounded-xl shadow-lg ring-1 ring-gold-700/50 group-hover:ring-gold-500/70 transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            />
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex items-center gap-2">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.href}
                                    href={link.href}
                                >
                                    <Button 
                                        variant="ghost" 
                                        className="gap-2 text-gold-300 hover:text-gold-100"
                                    >
                                        <link.icon className="w-4 h-4" />
                                        {link.label}
                                    </Button>
                                </Link>
                            ))}
                            <div className="w-px h-8 bg-gold-700/50 mx-2" />
                            <Button 
                                onClick={toggleLanguage}
                                variant="outline"
                                size="sm"
                                className="gap-2"
                            >
                                <Globe className="w-4 h-4" />
                                {t('nav.language')}
                            </Button>
                        </div>

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden"
                            aria-label="Toggle menu"
                        >
                            <AnimatePresence mode="wait">
                                {mobileMenuOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu className="w-5 h-5" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeMobileMenu}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                        />
                        
                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: locale === 'ar' ? '-100%' : '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: locale === 'ar' ? '-100%' : '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className={cn(
                                "fixed top-0 bottom-0 z-50 w-72 bg-gold-950/95 backdrop-blur-xl border-gold-800/50 md:hidden",
                                locale === 'ar' ? 'left-0 border-r' : 'right-0 border-l'
                            )}
                        >
                            <div className="flex flex-col h-full">
                                {/* Menu Header */}
                                <div className="flex items-center justify-between p-4 border-b border-gold-800/50">
                                    <span className="text-gold-300 font-semibold">{t('nav.menu')}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={closeMobileMenu}
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>
                                
                                {/* Menu Links */}
                                <div className="flex-1 p-4 space-y-2">
                                    {navLinks.map((link, index) => (
                                        <motion.div
                                            key={link.href}
                                            initial={{ opacity: 0, x: locale === 'ar' ? -20 : 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Link 
                                                href={link.href}
                                                onClick={closeMobileMenu}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-start gap-3 h-12 text-gold-200 hover:text-gold-100 hover:bg-gold-800/30"
                                                >
                                                    <link.icon className="w-5 h-5 text-gold-400" />
                                                    {link.label}
                                                </Button>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                                
                                {/* Language Toggle */}
                                <div className="p-4 border-t border-gold-800/50">
                                    <Button 
                                        onClick={() => {
                                            toggleLanguage();
                                            closeMobileMenu();
                                        }}
                                        variant="outline"
                                        className="w-full gap-2"
                                    >
                                        <Globe className="w-5 h-5" />
                                        {t('nav.language')}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="relative z-10 pt-16 md:pt-20">
                {children}
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-gold-800/50 py-8 mt-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <img 
                                src="/images/goldcom-logo1.jpg" 
                                alt="Goldcom" 
                                className="h-8 w-auto rounded-lg opacity-70"
                            />
                            <span className="text-gold-500 text-sm">
                                © {new Date().getFullYear()} {t('footer.goldcom')}
                            </span>
                        </div>
                        <p className="text-gold-600 text-sm">
                            {t('footer.rights')}
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
