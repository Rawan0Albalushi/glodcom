import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePage, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Lock, Loader2, Shield, Eye, EyeOff, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function AdminLogin() {
    const { t, i18n } = useTranslation();
    const { locale } = usePage().props;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (locale && i18n.language !== locale) {
            i18n.changeLanguage(locale);
        }
        document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = locale;
    }, [locale, i18n]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await axios.post('/admin/login', { username, password });
            
            if (response.data.success) {
                router.visit('/admin/dashboard');
            }
        } catch (err) {
            setError(t('admin.login.invalidCredentials'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gold-950 relative overflow-hidden flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-gold-900)_0%,_transparent_50%)] opacity-60" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--color-gold-800)_0%,_transparent_40%)] opacity-30" />
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C6963F' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                <Card>
                    <CardHeader className="text-center pb-2">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: 0.2 }}
                            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-700 shadow-lg shadow-gold-500/30 mb-4 mx-auto"
                        >
                            <Shield className="w-10 h-10 text-white" />
                        </motion.div>
                        <CardTitle className="text-3xl">
                            {t('admin.login.title')}
                        </CardTitle>
                        <p className="text-gold-400 mt-2">
                            {t('admin.login.subtitle')}
                        </p>
                    </CardHeader>
                    
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Username Field */}
                            <div className="space-y-3">
                                <Label htmlFor="username">
                                    {t('admin.login.username')}
                                </Label>
                                <div className="relative">
                                    <User className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-500" />
                                    <Input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder={t('admin.login.usernamePlaceholder')}
                                        className={cn("ps-11", error && "border-red-500")}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-3">
                                <Label htmlFor="password">
                                    {t('admin.login.password')}
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-500" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder={t('admin.login.passwordPlaceholder')}
                                        className={cn("ps-11 pe-11", error && "border-red-500")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute end-3 top-1/2 -translate-y-1/2 text-gold-500 hover:text-gold-400 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <motion.p 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-400 text-sm text-center"
                                >
                                    {error}
                                </motion.p>
                            )}

                            <Button
                                type="submit"
                                disabled={isSubmitting || !username || !password}
                                size="lg"
                                className="w-full"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {t('admin.login.submitting')}
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Lock className="w-5 h-5" />
                                        {t('admin.login.submit')}
                                    </span>
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <a 
                                href="/"
                                className="text-gold-500 hover:text-gold-400 text-sm transition-colors"
                            >
                                {t('admin.login.backToHome')}
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
