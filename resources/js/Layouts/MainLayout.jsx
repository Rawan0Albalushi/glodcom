import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import GoldBarsAnimation from '../Components/GoldBarsAnimation';

export default function MainLayout({ children }) {
    const { t, i18n } = useTranslation();
    const { locale } = usePage().props;

    useEffect(() => {
        if (locale && i18n.language !== locale) {
            i18n.changeLanguage(locale);
        }
        document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = locale;
    }, [locale, i18n]);

    const toggleLanguage = () => {
        const newLocale = locale === 'ar' ? 'en' : 'ar';
        window.location.href = `/lang/${newLocale}`;
    };

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

                        {/* Nav Links */}
                        <div className="flex items-center gap-6">
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

