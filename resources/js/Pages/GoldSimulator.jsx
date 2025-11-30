import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import MainLayout from '../Layouts/MainLayout';

export default function GoldSimulator() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const [monthlyAmount, setMonthlyAmount] = useState('');
    const [months, setMonths] = useState(12);
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
                months: months,
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
        return new Intl.NumberFormat(isRTL ? 'ar-OM' : 'en-OM', {
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
                        className="text-center mb-10"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gold-200 mb-4">
                            {t('simulator.title')}
                        </h1>
                        <p className="text-xl text-gold-400 mb-2">
                            {t('simulator.subtitle')}
                        </p>
                        <p className="text-gold-500">
                            {t('simulator.description')}
                        </p>
                    </motion.div>

                    {/* Calculator Form */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-gradient-to-br from-gold-800/50 to-gold-900/50 backdrop-blur-md rounded-3xl p-6 md:p-10 border border-gold-600/30 shadow-2xl mb-8"
                    >
                        <form onSubmit={handleCalculate} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Monthly Amount */}
                                <div>
                                    <label className="block text-gold-300 mb-2 font-medium">
                                        {t('simulator.form.monthlyAmount')}
                                    </label>
                                    <input
                                        type="number"
                                        value={monthlyAmount}
                                        onChange={(e) => {
                                            setMonthlyAmount(e.target.value);
                                            setError('');
                                        }}
                                        placeholder={t('simulator.form.monthlyAmountPlaceholder')}
                                        className={`w-full px-4 py-4 bg-gold-900/50 border ${error ? 'border-red-500' : 'border-gold-600/30'} rounded-xl text-gold-100 placeholder-gold-600 focus:outline-none focus:border-gold-400 transition-colors text-lg`}
                                        min="1"
                                        step="0.01"
                                    />
                                    {error && (
                                        <p className="text-red-400 text-sm mt-1">{error}</p>
                                    )}
                                </div>

                                {/* Months */}
                                <div>
                                    <label className="block text-gold-300 mb-2 font-medium">
                                        {t('simulator.form.months')}
                                    </label>
                                    <select
                                        value={months}
                                        onChange={(e) => setMonths(parseInt(e.target.value))}
                                        className="w-full px-4 py-4 bg-gold-900/50 border border-gold-600/30 rounded-xl text-gold-100 focus:outline-none focus:border-gold-400 transition-colors text-lg appearance-none cursor-pointer"
                                    >
                                        {[3, 6, 12, 24, 36, 48, 60].map(m => (
                                            <option key={m} value={m} className="bg-gold-900">
                                                {m} {isRTL ? 'شهر' : 'months'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Calculate Button */}
                            <motion.button
                                type="submit"
                                disabled={isCalculating}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white font-bold text-lg rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed pulse-glow"
                            >
                                {isCalculating ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        {t('simulator.form.calculating')}
                                    </span>
                                ) : (
                                    t('simulator.form.calculate')
                                )}
                            </motion.button>
                        </form>
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
                                <div className="bg-gradient-to-br from-gold-700/40 to-gold-800/60 backdrop-blur-md rounded-3xl p-6 md:p-10 border border-gold-500/40 shadow-2xl">
                                    <h2 className="text-2xl font-bold text-gold-200 mb-6 text-center">
                                        {t('simulator.results.title')}
                                    </h2>

                                    {/* Gold Prices Info */}
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.05 }}
                                        className="flex justify-center gap-6 mb-6"
                                    >
                                        <div className="bg-gold-900/50 rounded-xl px-5 py-3 border border-gold-600/30 text-center">
                                            <p className="text-gold-400 text-xs mb-1">
                                                {t('simulator.results.minPrice')}
                                            </p>
                                            <p className="text-lg font-bold text-gold-200">
                                                {result.min_price} {isRTL ? 'ر.ع' : 'OMR'}
                                            </p>
                                        </div>
                                        <div className="bg-gold-900/50 rounded-xl px-5 py-3 border border-gold-600/30 text-center">
                                            <p className="text-gold-400 text-xs mb-1">
                                                {t('simulator.results.maxPrice')}
                                            </p>
                                            <p className="text-lg font-bold text-gold-200">
                                                {result.max_price} {isRTL ? 'ر.ع' : 'OMR'}
                                            </p>
                                        </div>
                                    </motion.div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Total Investment */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="bg-gold-900/50 rounded-2xl p-5 border border-gold-600/30"
                                        >
                                            <p className="text-gold-400 text-sm mb-1">
                                                {t('simulator.results.totalInvestment')}
                                            </p>
                                            <p className="text-2xl font-bold text-gold-200">
                                                {formatCurrency(result.total_investment)}
                                            </p>
                                        </motion.div>

                                        {/* Gold Grams */}
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="bg-gold-900/50 rounded-2xl p-5 border border-gold-600/30"
                                        >
                                            <p className="text-gold-400 text-sm mb-1">
                                                {t('simulator.results.goldGrams')}
                                            </p>
                                            <p className="text-2xl font-bold text-gold-200">
                                                {result.gold_grams.toLocaleString()} g
                                            </p>
                                        </motion.div>

                                        {/* Current Value */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="bg-gold-900/50 rounded-2xl p-5 border border-gold-600/30"
                                        >
                                            <p className="text-gold-400 text-sm mb-1">
                                                {t('simulator.results.currentValue')}
                                            </p>
                                            <p className="text-2xl font-bold text-gold-200">
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
                                            <p className="text-green-400 text-sm mb-1">
                                                {t('simulator.results.profit')}
                                            </p>
                                            <p className="text-2xl font-bold text-green-300">
                                                +{formatCurrency(result.profit)}
                                            </p>
                                            <p className="text-green-400 text-sm mt-1">
                                                ({result.profit_percentage}% {t('simulator.results.profitPercentage')})
                                            </p>
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
                                </div>

                                {/* Disclaimer */}
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-center text-gold-500 text-sm"
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

