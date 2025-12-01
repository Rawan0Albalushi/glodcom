import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePage, router, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { 
    Users, LogOut, Gift, Search, Download, ChevronLeft, ChevronRight,
    Globe, MapPin, Phone, Mail, Coins, Calendar, RefreshCw, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const GOVERNORATES = [
    'muscat', 'dhofar', 'musandam', 'buraimi', 'dakhliyah',
    'sharqiyah_north', 'sharqiyah_south', 'batinah_north',
    'batinah_south', 'dhahirah', 'wusta'
];

export default function AdminDashboard({ interests = [] }) {
    const { t, i18n } = useTranslation();
    const { locale } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGovernorate, setFilterGovernorate] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const itemsPerPage = 10;

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

    // Filter and search
    const filteredInterests = interests.filter(interest => {
        const matchesSearch = 
            interest.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            interest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            interest.phone?.includes(searchTerm);
        
        const matchesGovernorate = filterGovernorate === 'all' || interest.governorate === filterGovernorate;
        
        return matchesSearch && matchesGovernorate;
    });

    // Pagination
    const totalPages = Math.ceil(filteredInterests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedInterests = filteredInterests.slice(startIndex, startIndex + itemsPerPage);

    // Stats
    const totalAmount = interests.reduce((sum, i) => sum + parseFloat(i.monthly_amount || 0), 0);
    const governorateStats = interests.reduce((acc, i) => {
        acc[i.governorate] = (acc[i.governorate] || 0) + 1;
        return acc;
    }, {});

    const exportExcel = () => {
        const headers = [
            t('admin.table.name'),
            t('admin.table.contact') + ' (Email)',
            t('admin.table.contact') + ' (Phone)',
            t('admin.table.location') + ' (Governorate)',
            t('admin.table.location') + ' (Wilaya)',
            t('admin.table.amount'),
            t('admin.export.referralCode'),
            t('admin.table.date')
        ];
        
        const rows = filteredInterests.map(i => [
            i.name,
            i.email,
            i.phone,
            t(`governorates.${i.governorate}`),
            t(`wilayas.${i.wilaya}`),
            i.monthly_amount,
            i.referral_code || '',
            new Date(i.created_at).toLocaleDateString('en-US')
        ]);
        
        const wsData = [headers, ...rows];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        
        // Set column widths
        ws['!cols'] = [
            { wch: 25 }, // Name
            { wch: 30 }, // Email
            { wch: 15 }, // Phone
            { wch: 20 }, // Governorate
            { wch: 20 }, // Wilaya
            { wch: 15 }, // Amount
            { wch: 15 }, // Referral Code
            { wch: 15 }, // Date
        ];
        
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Registrations');
        
        XLSX.writeFile(wb, `goldcom-registrations-${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <div className="min-h-screen bg-gold-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-gold-900)_0%,_transparent_50%)] opacity-60" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--color-gold-800)_0%,_transparent_40%)] opacity-30" />
            </div>

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
                                {t('admin.dashboard.title')}
                            </h1>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Link href="/admin/draw">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Gift className="w-4 h-4" />
                                    <span className="hidden sm:inline">{t('admin.nav.draw')}</span>
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
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="p-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500 to-gold-700">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-gold-400 text-sm">{t('admin.stats.totalRegistered')}</p>
                                    <p className="text-2xl font-bold text-gold-200">{interests.length}</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="p-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500 to-gold-700">
                                    <Coins className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-gold-400 text-sm">{t('admin.stats.totalAmount')}</p>
                                    <p className="text-2xl font-bold text-gold-200">{totalAmount.toFixed(2)} {t('simulator.results.currency')}</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="p-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500 to-gold-700">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-gold-400 text-sm">{t('admin.stats.governorates')}</p>
                                    <p className="text-2xl font-bold text-gold-200">{Object.keys(governorateStats).length}</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-500" />
                                <Input
                                    placeholder={t('admin.dashboard.searchPlaceholder')}
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="ps-11"
                                />
                            </div>
                            
                            <Select 
                                value={filterGovernorate} 
                                onValueChange={(value) => {
                                    setFilterGovernorate(value);
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger className="w-full md:w-48">
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-4 h-4 text-gold-500" />
                                        <SelectValue placeholder={t('admin.dashboard.filterGovernorate')} />
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

                            <Button onClick={exportExcel} variant="outline" className="gap-2">
                                <Download className="w-4 h-4" />
                                {t('admin.dashboard.export')}
                            </Button>

                            <Button 
                                onClick={() => router.reload()} 
                                variant="ghost" 
                                size="icon"
                                title={t('admin.dashboard.refresh')}
                            >
                                <RefreshCw className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Count */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-gold-400 text-sm">
                        {t('admin.dashboard.showing')} {filteredInterests.length} {t('admin.dashboard.results')}
                    </p>
                </div>

                {/* Table */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gold-700/50">
                                    <th className="text-start p-4 text-gold-300 font-semibold">{t('admin.table.name')}</th>
                                    <th className="text-start p-4 text-gold-300 font-semibold hidden md:table-cell">{t('admin.table.contact')}</th>
                                    <th className="text-start p-4 text-gold-300 font-semibold hidden lg:table-cell">{t('admin.table.location')}</th>
                                    <th className="text-start p-4 text-gold-300 font-semibold">{t('admin.table.amount')}</th>
                                    <th className="text-start p-4 text-gold-300 font-semibold hidden sm:table-cell">{t('admin.table.date')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {paginatedInterests.map((interest, index) => (
                                        <motion.tr
                                            key={interest.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-gold-800/30 hover:bg-gold-800/20 transition-colors"
                                        >
                                            <td className="p-4">
                                                <div className="font-medium text-gold-200">{interest.name}</div>
                                                <div className="text-gold-500 text-sm md:hidden">{interest.phone}</div>
                                            </td>
                                            <td className="p-4 hidden md:table-cell">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-gold-300 text-sm flex items-center gap-1">
                                                        <Phone className="w-3 h-3" /> {interest.phone}
                                                    </span>
                                                    <span className="text-gold-500 text-sm flex items-center gap-1">
                                                        <Mail className="w-3 h-3" /> {interest.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 hidden lg:table-cell">
                                                <div className="flex flex-col gap-1">
                                                    <Badge variant="secondary" className="w-fit">
                                                        {t(`governorates.${interest.governorate}`)}
                                                    </Badge>
                                                    <span className="text-gold-500 text-sm">
                                                        {t(`wilayas.${interest.wilaya}`)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge className="bg-gold-600/20 text-gold-300 border-gold-600/30">
                                                    {interest.monthly_amount} {t('simulator.results.currency')}
                                                </Badge>
                                            </td>
                                            <td className="p-4 hidden sm:table-cell">
                                                <span className="text-gold-500 text-sm flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(interest.created_at).toLocaleDateString('en-US')}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>

                        {paginatedInterests.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="w-12 h-12 text-gold-600 mx-auto mb-4" />
                                <p className="text-gold-400">{t('admin.dashboard.noResults')}</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 p-4 border-t border-gold-800/30">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            
                            <span className="text-gold-400 text-sm px-4">
                                {currentPage} / {totalPages}
                            </span>
                            
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </Card>
            </main>
        </div>
    );
}

