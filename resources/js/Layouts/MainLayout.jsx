import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import GoldBarsAnimation from '../Components/GoldBarsAnimation';

export default function MainLayout({ children }) {
    const { t, i18n } = useTranslation();
    const { locale } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (locale && i18n.language !== locale) {
            i18n.changeLanguage(locale);
        }
        document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = locale;
    }, [locale, i18n]);

    // Close mobile menu when clicking outside
    useEffect(() => {
        if (mobileMenuOpen) {
            const handleClickOutside = (e) => {
                if (!e.target.closest('nav')) {
                    setMobileMenuOpen(false);
                }
            };
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [mobileMenuOpen]);

    const toggleLanguage = () => {
        const newLocale = locale === 'ar' ? 'en' : 'ar';
        window.location.href = `/lang/${newLocale}`;
    };

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gold-900 via-gold-800 to-gold-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D8BC75' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            {/* Gold Bars Animation */}
            <GoldBarsAnimation />

            {/* Navigation */}
            <nav className="relative z-20 bg-gold-900/80 backdrop-blur-md border-b border-gold-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <img 
                                src="/images/goldcom-logo1.jpg" 
                                alt="Goldcom" 
                                className="h-10 w-auto rounded"
                            />
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex items-center gap-6">
                            <Link 
                                href="/" 
                                className="text-gold-200 hover:text-gold-400 transition-colors font-medium"
                            >
                                {t('nav.home')}
                            </Link>
                            <Link 
                                href="/simulator" 
                                className="text-gold-200 hover:text-gold-400 transition-colors font-medium"
                            >
                                {t('nav.simulator')}
                            </Link>
                            <button 
                                onClick={toggleLanguage}
                                className="px-4 py-2 bg-gold-600/20 hover:bg-gold-600/40 text-gold-300 rounded-lg transition-all border border-gold-600/30"
                            >
                                {t('nav.language')}
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg bg-gold-600/20 border border-gold-600/30 text-gold-300 hover:bg-gold-600/40 transition-all focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                            aria-label="Toggle menu"
                        >
                            <div className="w-5 h-4 relative flex flex-col justify-between">
                                <span 
                                    className={`w-full h-0.5 bg-gold-300 rounded-full transform transition-all duration-300 origin-center ${
                                        mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
                                    }`}
                                />
                                <span 
                                    className={`w-full h-0.5 bg-gold-300 rounded-full transition-all duration-200 ${
                                        mobileMenuOpen ? 'opacity-0 scale-0' : ''
                                    }`}
                                />
                                <span 
                                    className={`w-full h-0.5 bg-gold-300 rounded-full transform transition-all duration-300 origin-center ${
                                        mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                                    }`}
                                />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div 
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                        mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="bg-gold-900/95 backdrop-blur-lg border-t border-gold-700/30">
                        <div className="px-4 py-3 space-y-1">
                            <Link 
                                href="/"
                                onClick={closeMobileMenu}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gold-200 hover:text-gold-400 hover:bg-gold-700/30 transition-all font-medium group"
                            >
                                <svg className="w-5 h-5 text-gold-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                {t('nav.home')}
                            </Link>
                            <Link 
                                href="/simulator"
                                onClick={closeMobileMenu}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gold-200 hover:text-gold-400 hover:bg-gold-700/30 transition-all font-medium group"
                            >
                                <svg className="w-5 h-5 text-gold-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                {t('nav.simulator')}
                            </Link>
                            <div className="pt-2 pb-1">
                                <button 
                                    onClick={() => {
                                        toggleLanguage();
                                        closeMobileMenu();
                                    }}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gold-600/30 to-gold-500/30 hover:from-gold-600/50 hover:to-gold-500/50 text-gold-300 rounded-xl transition-all border border-gold-600/40 font-medium"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                    </svg>
                                    {t('nav.language')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="relative z-10">
                {children}
            </main>

            {/* Footer */}
            <footer className="relative z-10 bg-gold-900/90 border-t border-gold-700/50 py-6 mt-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-gold-400">
                        © {new Date().getFullYear()} {t('footer.goldcom')}. {t('footer.rights')}.
                    </p>
                </div>
            </footer>
        </div>
    );
}

