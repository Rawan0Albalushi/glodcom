import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import MainLayout from '../Layouts/MainLayout';
import LiveCounter from '../Components/LiveCounter';

const GOVERNORATES = [
    { id: 'muscat', wilayas: ['muscat', 'muttrah', 'bawshar', 'seeb', 'amerat', 'qurayyat'] },
    { id: 'dhofar', wilayas: ['salalah', 'taqah', 'mirbat', 'rakhyut', 'thumrait'] },
    { id: 'musandam', wilayas: ['khasab', 'bukha', 'dibba', 'madha'] },
    { id: 'buraimi', wilayas: ['buraimi', 'mahdah', 'sunaynah'] },
    { id: 'dakhliyah', wilayas: ['nizwa', 'bahla', 'adam', 'hamra', 'manah', 'izki'] },
    { id: 'sharqiyah_north', wilayas: ['ibra', 'mudaybi', 'qabil', 'bidiyah', 'wadi_bani_khalid'] },
    { id: 'sharqiyah_south', wilayas: ['sur', 'jalan', 'kamil_wafi', 'masirah'] },
    { id: 'batinah_north', wilayas: ['sohar', 'shinas', 'liwa', 'saham', 'khabura', 'suwaiq'] },
    { id: 'batinah_south', wilayas: ['rustaq', 'awabi', 'nakhal', 'wadi_maawil', 'barka', 'musannah'] },
    { id: 'dhahirah', wilayas: ['ibri', 'yanqul', 'dhank'] },
    { id: 'wusta', wilayas: ['haima', 'duqm', 'mahout', 'jazir'] },
];

const MONTHLY_AMOUNTS = [10, 25, 50, 100];

export default function InterestRegistration() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        governorate: '',
        wilaya: '',
        monthly_amount: '',
        referral_code: '',
    });

    const [selectedAmountType, setSelectedAmountType] = useState(null);
    const [customAmount, setCustomAmount] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const selectedGovernorate = GOVERNORATES.find(g => g.id === formData.governorate);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleAmountSelect = (amount) => {
        setSelectedAmountType(amount);
        if (amount !== 'custom') {
            setFormData(prev => ({ ...prev, monthly_amount: amount }));
            setCustomAmount('');
        } else {
            setFormData(prev => ({ ...prev, monthly_amount: customAmount }));
        }
        setErrors(prev => ({ ...prev, monthly_amount: '' }));
    };

    const handleCustomAmountChange = (e) => {
        const value = e.target.value;
        setCustomAmount(value);
        setFormData(prev => ({ ...prev, monthly_amount: value }));
        setErrors(prev => ({ ...prev, monthly_amount: '' }));
    };

    const handleGovernorateChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, governorate: value, wilaya: '' }));
        setErrors(prev => ({ ...prev, governorate: '', wilaya: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) newErrors.name = t('validation.required');
        if (!formData.phone.trim()) newErrors.phone = t('validation.required');
        if (!formData.email.trim()) {
            newErrors.email = t('validation.required');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('validation.email');
        }
        if (!formData.governorate) newErrors.governorate = t('validation.required');
        if (!formData.wilaya) newErrors.wilaya = t('validation.required');
        if (!formData.monthly_amount) newErrors.monthly_amount = t('validation.required');

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsSubmitting(true);
        
        try {
            const response = await axios.post('/api/interests', formData);
            
            if (response.data.success) {
                setIsSuccess(true);
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            phone: '',
            email: '',
            governorate: '',
            wilaya: '',
            monthly_amount: '',
            referral_code: '',
        });
        setSelectedAmountType(null);
        setCustomAmount('');
        setErrors({});
        setIsSuccess(false);
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
                            {t('interest.title')}
                        </h1>
                        <p className="text-xl text-gold-400 mb-2">
                            {t('interest.subtitle')}
                        </p>
                        <p className="text-gold-500">
                            {t('interest.description')}
                        </p>
                    </motion.div>

                    {/* Live Counter */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-10"
                    >
                        <LiveCounter />
                    </motion.div>

                    {/* Form or Success Message */}
                    <AnimatePresence mode="wait">
                        {isSuccess ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-gradient-to-br from-gold-800/50 to-gold-900/50 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-gold-600/30 text-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', delay: 0.2 }}
                                    className="text-8xl mb-6"
                                >
                                    🏆
                                </motion.div>
                                <h2 className="text-3xl font-bold text-gold-200 mb-4">
                                    {t('interest.success.title')}
                                </h2>
                                <p className="text-gold-400 text-lg mb-8">
                                    {t('interest.success.message')}
                                </p>
                                <button
                                    onClick={resetForm}
                                    className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg"
                                >
                                    {t('interest.success.button')}
                                </button>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                onSubmit={handleSubmit}
                                className="bg-gradient-to-br from-gold-800/50 to-gold-900/50 backdrop-blur-md rounded-3xl p-6 md:p-10 border border-gold-600/30 shadow-2xl"
                            >
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-gold-300 mb-2 font-medium">
                                            {t('interest.form.name')} *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder={t('interest.form.namePlaceholder')}
                                            className={`w-full px-4 py-3 bg-gold-900/50 border ${errors.name ? 'border-red-500' : 'border-gold-600/30'} rounded-xl text-gold-100 placeholder-gold-600 focus:outline-none focus:border-gold-400 transition-colors`}
                                        />
                                        {errors.name && (
                                            <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-gold-300 mb-2 font-medium">
                                            {t('interest.form.phone')} *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder={t('interest.form.phonePlaceholder')}
                                            className={`w-full px-4 py-3 bg-gold-900/50 border ${errors.phone ? 'border-red-500' : 'border-gold-600/30'} rounded-xl text-gold-100 placeholder-gold-600 focus:outline-none focus:border-gold-400 transition-colors`}
                                            dir="ltr"
                                        />
                                        {errors.phone && (
                                            <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="md:col-span-2">
                                        <label className="block text-gold-300 mb-2 font-medium">
                                            {t('interest.form.email')} *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder={t('interest.form.emailPlaceholder')}
                                            className={`w-full px-4 py-3 bg-gold-900/50 border ${errors.email ? 'border-red-500' : 'border-gold-600/30'} rounded-xl text-gold-100 placeholder-gold-600 focus:outline-none focus:border-gold-400 transition-colors`}
                                            dir="ltr"
                                        />
                                        {errors.email && (
                                            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Governorate */}
                                    <div>
                                        <label className="block text-gold-300 mb-2 font-medium">
                                            {t('interest.form.governorate')} *
                                        </label>
                                        <select
                                            name="governorate"
                                            value={formData.governorate}
                                            onChange={handleGovernorateChange}
                                            className={`w-full px-4 py-3 bg-gold-900/50 border ${errors.governorate ? 'border-red-500' : 'border-gold-600/30'} rounded-xl text-gold-100 focus:outline-none focus:border-gold-400 transition-colors appearance-none cursor-pointer`}
                                        >
                                            <option value="" className="bg-gold-900">{t('interest.form.governoratePlaceholder')}</option>
                                            {GOVERNORATES.map(gov => (
                                                <option key={gov.id} value={gov.id} className="bg-gold-900">
                                                    {t(`governorates.${gov.id}`)}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.governorate && (
                                            <p className="text-red-400 text-sm mt-1">{errors.governorate}</p>
                                        )}
                                    </div>

                                    {/* Wilaya */}
                                    <div>
                                        <label className="block text-gold-300 mb-2 font-medium">
                                            {t('interest.form.wilaya')} *
                                        </label>
                                        <select
                                            name="wilaya"
                                            value={formData.wilaya}
                                            onChange={handleInputChange}
                                            disabled={!selectedGovernorate}
                                            className={`w-full px-4 py-3 bg-gold-900/50 border ${errors.wilaya ? 'border-red-500' : 'border-gold-600/30'} rounded-xl text-gold-100 focus:outline-none focus:border-gold-400 transition-colors appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            <option value="" className="bg-gold-900">{t('interest.form.wilayaPlaceholder')}</option>
                                            {selectedGovernorate?.wilayas.map(wilaya => (
                                                <option key={wilaya} value={wilaya} className="bg-gold-900">
                                                    {wilaya.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.wilaya && (
                                            <p className="text-red-400 text-sm mt-1">{errors.wilaya}</p>
                                        )}
                                    </div>

                                    {/* Monthly Amount */}
                                    <div className="md:col-span-2">
                                        <label className="block text-gold-300 mb-3 font-medium">
                                            {t('interest.form.monthlyAmount')} *
                                        </label>
                                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                            {MONTHLY_AMOUNTS.map(amount => (
                                                <button
                                                    key={amount}
                                                    type="button"
                                                    onClick={() => handleAmountSelect(amount)}
                                                    className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                                                        selectedAmountType === amount
                                                            ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-lg scale-105'
                                                            : 'bg-gold-900/50 text-gold-300 border border-gold-600/30 hover:border-gold-500'
                                                    }`}
                                                >
                                                    {t(`interest.amounts.${amount}`)}
                                                </button>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => handleAmountSelect('custom')}
                                                className={`py-3 px-4 rounded-xl font-semibold transition-all col-span-2 md:col-span-1 ${
                                                    selectedAmountType === 'custom'
                                                        ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-lg scale-105'
                                                        : 'bg-gold-900/50 text-gold-300 border border-gold-600/30 hover:border-gold-500'
                                                }`}
                                            >
                                                {t('interest.amounts.custom')}
                                            </button>
                                        </div>
                                        
                                        {selectedAmountType === 'custom' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="mt-3"
                                            >
                                                <input
                                                    type="number"
                                                    value={customAmount}
                                                    onChange={handleCustomAmountChange}
                                                    placeholder={t('interest.form.monthlyAmountPlaceholder')}
                                                    className="w-full px-4 py-3 bg-gold-900/50 border border-gold-600/30 rounded-xl text-gold-100 placeholder-gold-600 focus:outline-none focus:border-gold-400 transition-colors"
                                                    min="1"
                                                />
                                            </motion.div>
                                        )}
                                        
                                        {errors.monthly_amount && (
                                            <p className="text-red-400 text-sm mt-2">{errors.monthly_amount}</p>
                                        )}
                                    </div>

                                    {/* Referral Code */}
                                    <div className="md:col-span-2">
                                        <label className="block text-gold-300 mb-2 font-medium">
                                            {t('interest.form.referralCode')}
                                        </label>
                                        <input
                                            type="text"
                                            name="referral_code"
                                            value={formData.referral_code}
                                            onChange={handleInputChange}
                                            placeholder={t('interest.form.referralCodePlaceholder')}
                                            className="w-full px-4 py-3 bg-gold-900/50 border border-gold-600/30 rounded-xl text-gold-100 placeholder-gold-600 focus:outline-none focus:border-gold-400 transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full mt-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white font-bold text-lg rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed pulse-glow"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            {t('interest.form.submitting')}
                                        </span>
                                    ) : (
                                        t('interest.form.submit')
                                    )}
                                </motion.button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </MainLayout>
    );
}

