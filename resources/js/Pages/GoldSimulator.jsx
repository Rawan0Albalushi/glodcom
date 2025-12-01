import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Calculator, TrendingUp, Coins, PiggyBank, Sparkles, Loader2 } from 'lucide-react';
import MainLayout from '../Layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function GoldSimulator() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const [monthlyAmount, setMonthlyAmount] = useState('');
    const [isCalculating, setIsCalculating] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleCalculate = async (e) => {
        e.preventDefault();
        
        if (!monthlyAmount || parseFloat(monthlyAmount) <= 0) {
            setError(t('validation.required'));
            return;
        }

        setIsCalculating(true);
        setError('');

        try {
            const response = await axios.post('/api/gold/calculate', {
                monthly_amount: parseFloat(monthlyAmount),
                months: 1,
            });

            if (response.data.success) {
                setResult(response.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        } finally {
            setIsCalculating(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-OM', {
            style: 'currency',
            currency: 'OMR',
            minimumFractionDigits: 2,
        }).format(value);
    };

    return (
        <MainLayout>
            <div className="min-h-screen py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: 0.2 }}
                            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-700 shadow-lg shadow-gold-500/30 mb-6"
                        >
                            <Calculator className="w-10 h-10 text-white" />
                        </motion.div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                            <span className="gradient-text">{t('simulator.title')}</span>
                        </h1>
                        <p className="text-xl text-gold-300 mb-2">
                            {t('simulator.subtitle')}
                        </p>
                        <p className="text-gold-500 max-w-md mx-auto">
                            {t('simulator.description')}
                        </p>
                    </motion.div>

                    {/* Calculator Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="p-2 md:p-4 mb-8">
                            <CardContent className="pt-6">
                                <form onSubmit={handleCalculate} className="space-y-6">
                                    {/* Monthly Amount */}
                                    <div className="space-y-2">
                                        <Label htmlFor="monthlyAmount" className="text-base">
                                            {t('simulator.form.monthlyAmount')}
                                        </Label>
                                        <div className="relative">
                                            <Coins className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-500" />
                                            <Input
                                                id="monthlyAmount"
                                                type="number"
                                                value={monthlyAmount}
                                                onChange={(e) => {
                                                    setMonthlyAmount(e.target.value);
                                                    setError('');
                                                }}
                                                placeholder={t('simulator.form.monthlyAmountPlaceholder')}
                                                className={cn(
                                                    "ps-11 text-lg",
                                                    error && "border-red-500 focus:ring-red-500/50"
                                                )}
                                                min="1"
                                                step="0.01"
                                            />
                                        </div>
                                        {error && (
                                            <p className="text-red-400 text-sm">{error}</p>
                                        )}
                                    </div>

                                    {/* Calculate Button */}
                                    <Button
                                        type="submit"
                                        disabled={isCalculating}
                                        size="xl"
                                        className="w-full pulse-glow"
                                    >
                                        {isCalculating ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                {t('simulator.form.calculating')}
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <TrendingUp className="w-5 h-5" />
                                                {t('simulator.form.calculate')}
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Results */}
                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-6"
                            >
                                {/* Results Card */}
                                <Card className="border-gold-500/40 bg-gradient-to-br from-gold-800/40 to-gold-900/60">
                                    <CardHeader className="text-center pb-2">
                                        <CardTitle className="text-2xl md:text-3xl flex items-center justify-center gap-2">
                                            <Sparkles className="w-6 h-6 text-gold-400" />
                                            {t('simulator.results.title')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        {/* Gold Prices Info */}
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.05 }}
                                            className="flex flex-wrap justify-center gap-4 mb-8"
                                        >
                                            <Badge variant="secondary" className="px-4 py-2 text-sm">
                                                <span className="text-gold-400 me-2">{t('simulator.results.minPrice')}:</span>
                                                <span className="font-bold">{result.min_price} {t('simulator.results.currency')}</span>
                                            </Badge>
                                            <Badge variant="secondary" className="px-4 py-2 text-sm">
                                                <span className="text-gold-400 me-2">{t('simulator.results.maxPrice')}:</span>
                                                <span className="font-bold">{result.max_price} {t('simulator.results.currency')}</span>
                                            </Badge>
                                        </motion.div>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {/* Total Investment */}
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 }}
                                                className="bg-gold-900/50 rounded-2xl p-5 border border-gold-700/30"
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 rounded-lg bg-gold-700/30">
                                                        <PiggyBank className="w-5 h-5 text-gold-400" />
                                                    </div>
                                                    <p className="text-gold-400 text-sm">
                                                        {t('simulator.results.totalInvestment')}
                                                    </p>
                                                </div>
                                                <p className="text-2xl font-bold text-gold-100">
                                                    {formatCurrency(result.total_investment)}
                                                </p>
                                            </motion.div>

                                            {/* Gold Grams */}
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="bg-gold-900/50 rounded-2xl p-5 border border-gold-700/30"
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 rounded-lg bg-gold-700/30">
                                                        <Coins className="w-5 h-5 text-gold-400" />
                                                    </div>
                                                    <p className="text-gold-400 text-sm">
                                                        {t('simulator.results.goldGrams')}
                                                    </p>
                                                </div>
                                                <p className="text-2xl font-bold text-gold-100">
                                                    {result.gold_grams.toLocaleString('en')} g
                                                </p>
                                            </motion.div>

                                            {/* Current Value */}
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 }}
                                                className="bg-gold-900/50 rounded-2xl p-5 border border-gold-700/30"
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 rounded-lg bg-gold-700/30">
                                                        <TrendingUp className="w-5 h-5 text-gold-400" />
                                                    </div>
                                                    <p className="text-gold-400 text-sm">
                                                        {t('simulator.results.currentValue')}
                                                    </p>
                                                </div>
                                                <p className="text-2xl font-bold text-gold-100">
                                                    {formatCurrency(result.current_value)}
                                                </p>
                                            </motion.div>

                                            {/* Profit */}
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4 }}
                                                className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-2xl p-5 border border-green-500/30"
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 rounded-lg bg-green-700/30">
                                                        <Sparkles className="w-5 h-5 text-green-400" />
                                                    </div>
                                                    <p className="text-green-400 text-sm">
                                                        {t('simulator.results.profit')}
                                                    </p>
                                                </div>
                                                <p className="text-2xl font-bold text-green-300">
                                                    +{formatCurrency(result.profit)}
                                                </p>
                                                <Badge variant="success" className="mt-2">
                                                    +{result.profit_percentage}% {t('simulator.results.profitPercentage')}
                                                </Badge>
                                            </motion.div>
                                        </div>

                                        {/* Motivational Text */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="mt-8 text-center"
                                        >
                                            <p className="text-xl text-gold-300 font-medium gold-shimmer inline-block">
                                                {t('simulator.results.motivational')}
                                            </p>
                                        </motion.div>
                                    </CardContent>
                                </Card>

                                {/* Disclaimer */}
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-center text-gold-600 text-sm"
                                >
                                    {t('simulator.results.disclaimer')}
                                </motion.p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </MainLayout>
    );
}
