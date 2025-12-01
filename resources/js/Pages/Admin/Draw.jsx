import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePage, router, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
    Gift, LogOut, Users, Sparkles, RefreshCw, Trophy, 
    Globe, MapPin, Phone, Mail, Loader2, LayoutDashboard, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const GOVERNORATES = [
    'muscat', 'dhofar', 'musandam', 'buraimi', 'dakhliyah',
    'sharqiyah_north', 'sharqiyah_south', 'batinah_north',
    'batinah_south', 'dhahirah', 'wusta'
];

export default function AdminDraw({ interests = [] }) {
    const { t, i18n } = useTranslation();
    const { locale } = usePage().props;
    const [drawCount, setDrawCount] = useState(1);
    const [filterGovernorate, setFilterGovernorate] = useState('all');
    const [winners, setWinners] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        if (locale && i18n.language !== locale) {
            i18n.changeLanguage(locale);
        }
        document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = locale;
    }, [locale, i18n]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await axios.post('/admin/logout');
            router.visit('/admin');
        } catch (error) {
            console.error('Logout failed');
        } finally {
            setIsLoggingOut(false);
        }
    };

    const toggleLanguage = () => {
        const newLocale = locale === 'ar' ? 'en' : 'ar';
        window.location.href = `/lang/${newLocale}`;
    };

    const performDraw = async () => {
        setIsDrawing(true);
        setWinners([]);
        setShowConfetti(false);

        try {
            const response = await axios.post('/admin/draw', {
                count: drawCount,
                governorate: filterGovernorate === 'all' ? null : filterGovernorate,
            });

            if (response.data.success) {
                // Animate reveal with delay
                setTimeout(() => {
                    setWinners(response.data.winners);
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 5000);
                }, 1500);
            }
        } catch (error) {
            console.error('Draw failed:', error);
        } finally {
            setTimeout(() => setIsDrawing(false), 1500);
        }
    };

    const resetDraw = () => {
        setWinners([]);
        setShowConfetti(false);
    };

    // Get filtered count
    const filteredCount = filterGovernorate === 'all' 
        ? interests.length 
        : interests.filter(i => i.governorate === filterGovernorate).length;

    return (
        <div className="min-h-screen bg-gold-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-gold-900)_0%,_transparent_50%)] opacity-60" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--color-gold-800)_0%,_transparent_40%)] opacity-30" />
            </div>

            {/* Confetti Effect */}
            <AnimatePresence>
                {showConfetti && (
                    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden" dir="ltr">
                        {[...Array(50)].map((_, i) => (
                            <motion.div
                                key={i}
                                style={{ left: `${Math.random() * 100}%` }}
                                initial={{ 
                                    y: -20,
                                    rotate: 0,
                                    opacity: 1
                                }}
                                animate={{ 
                                    y: window.innerHeight + 20,
                                    rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                                    opacity: 0
                                }}
                                transition={{ 
                                    duration: 3 + Math.random() * 2,
                                    delay: Math.random() * 0.5,
                                    ease: "linear"
                                }}
                                className={cn(
                                    "absolute w-3 h-3 rounded-sm",
                                    i % 3 === 0 ? "bg-gold-400" : i % 3 === 1 ? "bg-gold-500" : "bg-gold-600"
                                )}
                            />
                        ))}
                    </div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="relative z-10 border-b border-gold-800/50 bg-gold-950/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link href="/">
                                <img 
                                    src="/images/goldcom-logo1.jpg" 
                                    alt="Goldcom" 
                                    className="h-10 w-auto rounded-xl shadow-lg ring-1 ring-gold-700/50"
                                />
                            </Link>
                            <h1 className="text-xl font-bold text-gold-200">
                                {t('admin.draw.title')}
                            </h1>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Link href="/admin/dashboard">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span className="hidden sm:inline">{t('admin.nav.dashboard')}</span>
                                </Button>
                            </Link>
                            <Button onClick={toggleLanguage} variant="ghost" size="sm" className="gap-2">
                                <Globe className="w-4 h-4" />
                                <span className="hidden sm:inline">{t('nav.language')}</span>
                            </Button>
                            <Button 
                                onClick={handleLogout} 
                                variant="ghost" 
                                size="sm" 
                                className="gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                disabled={isLoggingOut}
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">{t('admin.nav.logout')}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Draw Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="mb-8">
                        <CardHeader className="text-center pb-2">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', delay: 0.2 }}
                                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-700 shadow-lg shadow-gold-500/30 mb-4 mx-auto"
                            >
                                <Gift className="w-10 h-10 text-white" />
                            </motion.div>
                            <CardTitle className="text-3xl">
                                {t('admin.draw.subtitle')}
                            </CardTitle>
                            <p className="text-gold-400 mt-2">
                                {t('admin.draw.description')}
                            </p>
                        </CardHeader>
                        
                        <CardContent className="pt-6">
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-3">
                                    <Label>{t('admin.draw.winnersCount')}</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        max={filteredCount}
                                        value={drawCount}
                                        onChange={(e) => setDrawCount(Math.max(1, parseInt(e.target.value) || 1))}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label>{t('admin.draw.filterGovernorate')}</Label>
                                    <Select value={filterGovernorate} onValueChange={setFilterGovernorate}>
                                        <SelectTrigger>
                                            <div className="flex items-center gap-2">
                                                <Filter className="w-4 h-4 text-gold-500" />
                                                <SelectValue />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">{t('admin.dashboard.allGovernorates')}</SelectItem>
                                            {GOVERNORATES.map(gov => (
                                                <SelectItem key={gov} value={gov}>
                                                    {t(`governorates.${gov}`)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-gold-800/20 border border-gold-700/30 mb-6">
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-gold-400" />
                                    <span className="text-gold-300">{t('admin.draw.availableParticipants')}</span>
                                </div>
                                <Badge className="bg-gold-600/20 text-gold-300 border-gold-600/30 text-lg px-4">
                                    {filteredCount}
                                </Badge>
                            </div>

                            <div className="flex gap-4">
                                <Button 
                                    onClick={performDraw}
                                    disabled={isDrawing || filteredCount === 0}
                                    size="xl"
                                    className="flex-1 pulse-glow"
                                >
                                    {isDrawing ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            {t('admin.draw.drawing')}
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Sparkles className="w-5 h-5" />
                                            {t('admin.draw.startDraw')}
                                        </span>
                                    )}
                                </Button>

                                {winners.length > 0 && (
                                    <Button onClick={resetDraw} variant="outline" size="xl">
                                        <RefreshCw className="w-5 h-5" />
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Winners Display */}
                <AnimatePresence>
                    {winners.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card>
                                <CardHeader className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Trophy className="w-6 h-6 text-gold-400" />
                                        <CardTitle className="text-2xl">
                                            {t('admin.draw.winners')}
                                        </CardTitle>
                                        <Trophy className="w-6 h-6 text-gold-400" />
                                    </div>
                                    <p className="text-gold-400">
                                        {winners.length} {t('admin.draw.winnersSelected')}
                                    </p>
                                </CardHeader>
                                
                                <CardContent>
                                    <div className="space-y-4">
                                        {winners.map((winner, index) => (
                                            <motion.div
                                                key={winner.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="p-4 rounded-xl bg-gradient-to-r from-gold-800/30 to-gold-900/30 border border-gold-600/30"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 text-white font-bold text-xl shrink-0">
                                                        {index + 1}
                                                    </div>
                                                    
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-semibold text-gold-200 mb-2">
                                                            {winner.name}
                                                        </h3>
                                                        
                                                        <div className="grid sm:grid-cols-2 gap-2 text-sm">
                                                            <div className="flex items-center gap-2 text-gold-400">
                                                                <Phone className="w-4 h-4 shrink-0" />
                                                                <span dir="ltr">{winner.phone}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gold-400">
                                                                <Mail className="w-4 h-4 shrink-0" />
                                                                <span className="truncate">{winner.email}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gold-400">
                                                                <MapPin className="w-4 h-4 shrink-0" />
                                                                <span>{t(`governorates.${winner.governorate}`)} - {t(`wilayas.${winner.wilaya}`)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Empty State during drawing */}
                <AnimatePresence>
                    {isDrawing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 flex items-center justify-center bg-gold-950/80 backdrop-blur-sm"
                        >
                            <motion.div
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 360]
                                }}
                                transition={{ 
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-700 shadow-2xl shadow-gold-500/50 flex items-center justify-center"
                            >
                                <Gift className="w-12 h-12 text-white" />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

