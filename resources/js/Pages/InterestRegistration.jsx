import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { User, Phone, Mail, MapPin, Building, Coins, Tag, Loader2, Trophy, Sparkles, UserPlus } from 'lucide-react';
import MainLayout from '../Layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

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

    const handleGovernorateChange = (value) => {
        setFormData(prev => ({ ...prev, governorate: value, wilaya: '' }));
        setErrors(prev => ({ ...prev, governorate: '', wilaya: '' }));
    };

    const handleWilayaChange = (value) => {
        setFormData(prev => ({ ...prev, wilaya: value }));
        setErrors(prev => ({ ...prev, wilaya: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) newErrors.name = t('validation.required');
        if (!formData.phone.trim()) newErrors.phone = t('validation.required');
        if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
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
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: 0.2 }}
                            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-700 shadow-lg shadow-gold-500/30 mb-6"
                        >
                            <UserPlus className="w-10 h-10 text-white" />
                        </motion.div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                            <span className="gradient-text">{t('interest.title')}</span>
                        </h1>
                        <p className="text-xl text-gold-300 mb-2">
                            {t('interest.subtitle')}
                        </p>
                        <p className="text-gold-500 max-w-md mx-auto">
                            {t('interest.description')}
                        </p>
                    </motion.div>

                    {/* Form or Success Message */}
                    <AnimatePresence mode="wait">
                        {isSuccess ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <Card className="text-center">
                                    <CardContent className="pt-12 pb-10">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', delay: 0.2 }}
                                            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 shadow-lg shadow-gold-500/30 mb-6"
                                        >
                                            <Trophy className="w-12 h-12 text-white" />
                                        </motion.div>
                                        
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <h2 className="text-3xl font-bold text-gold-200 mb-4 flex items-center justify-center gap-2">
                                                <Sparkles className="w-6 h-6 text-gold-400" />
                                                {t('interest.success.title')}
                                            </h2>
                                            <p className="text-gold-400 text-lg mb-8 max-w-md mx-auto">
                                                {t('interest.success.message')}
                                            </p>
                                            <Button
                                                onClick={resetForm}
                                                size="lg"
                                                className="px-8"
                                            >
                                                {t('interest.success.button')}
                                            </Button>
                                        </motion.div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <Card className="p-2 md:p-4">
                                    <CardContent className="pt-6">
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                {/* Name */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="name">
                                                        {t('interest.form.name')} <span className="text-red-400">*</span>
                                                    </Label>
                                                    <div className="relative">
                                                        <User className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-500" />
                                                        <Input
                                                            id="name"
                                                            name="name"
                                                            value={formData.name}
                                                            onChange={handleInputChange}
                                                            placeholder={t('interest.form.namePlaceholder')}
                                                            className={cn("ps-11", errors.name && "border-red-500")}
                                                        />
                                                    </div>
                                                    {errors.name && (
                                                        <p className="text-red-400 text-sm">{errors.name}</p>
                                                    )}
                                                </div>

                                                {/* Phone */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="phone">
                                                        {t('interest.form.phone')} <span className="text-red-400">*</span>
                                                    </Label>
                                                    <div className="relative">
                                                        <Phone className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-500" />
                                                        <Input
                                                            id="phone"
                                                            name="phone"
                                                            type="tel"
                                                            value={formData.phone}
                                                            onChange={handleInputChange}
                                                            placeholder={t('interest.form.phonePlaceholder')}
                                                            className={cn("ps-11", errors.phone && "border-red-500")}
                                                            dir="ltr"
                                                        />
                                                    </div>
                                                    {errors.phone && (
                                                        <p className="text-red-400 text-sm">{errors.phone}</p>
                                                    )}
                                                </div>

                                                {/* Email */}
                                                <div className="md:col-span-2 space-y-3">
                                                    <Label htmlFor="email">
                                                        {t('interest.form.email')} <span className="text-gold-500 text-sm">({t('validation.optional')})</span>
                                                    </Label>
                                                    <div className="relative">
                                                        <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-500" />
                                                        <Input
                                                            id="email"
                                                            name="email"
                                                            type="email"
                                                            value={formData.email}
                                                            onChange={handleInputChange}
                                                            placeholder={t('interest.form.emailPlaceholder')}
                                                            className={cn("ps-11", errors.email && "border-red-500")}
                                                            dir="ltr"
                                                        />
                                                    </div>
                                                    {errors.email && (
                                                        <p className="text-red-400 text-sm">{errors.email}</p>
                                                    )}
                                                </div>

                                                {/* Governorate */}
                                                <div className="space-y-3">
                                                    <Label>
                                                        {t('interest.form.governorate')} <span className="text-red-400">*</span>
                                                    </Label>
                                                    <Select value={formData.governorate} onValueChange={handleGovernorateChange}>
                                                        <SelectTrigger className={cn(errors.governorate && "border-red-500")}>
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="w-4 h-4 text-gold-500" />
                                                                <SelectValue placeholder={t('interest.form.governoratePlaceholder')} />
                                                            </div>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {GOVERNORATES.map(gov => (
                                                                <SelectItem key={gov.id} value={gov.id}>
                                                                    {t(`governorates.${gov.id}`)}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.governorate && (
                                                        <p className="text-red-400 text-sm">{errors.governorate}</p>
                                                    )}
                                                </div>

                                                {/* Wilaya */}
                                                <div className="space-y-3">
                                                    <Label>
                                                        {t('interest.form.wilaya')} <span className="text-red-400">*</span>
                                                    </Label>
                                                    <Select 
                                                        value={formData.wilaya} 
                                                        onValueChange={handleWilayaChange}
                                                        disabled={!selectedGovernorate}
                                                    >
                                                        <SelectTrigger className={cn(errors.wilaya && "border-red-500")}>
                                                            <div className="flex items-center gap-2">
                                                                <Building className="w-4 h-4 text-gold-500" />
                                                                <SelectValue placeholder={t('interest.form.wilayaPlaceholder')} />
                                                            </div>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {selectedGovernorate?.wilayas.map(wilaya => (
                                                                <SelectItem key={wilaya} value={wilaya}>
                                                                    {t(`wilayas.${wilaya}`)}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.wilaya && (
                                                        <p className="text-red-400 text-sm">{errors.wilaya}</p>
                                                    )}
                                                </div>

                                                {/* Monthly Amount */}
                                                <div className="md:col-span-2 space-y-3">
                                                    <Label>
                                                        {t('interest.form.monthlyAmount')} <span className="text-red-400">*</span>
                                                    </Label>
                                                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                                        {MONTHLY_AMOUNTS.map(amount => (
                                                            <Button
                                                                key={amount}
                                                                type="button"
                                                                onClick={() => handleAmountSelect(amount)}
                                                                variant={selectedAmountType === amount ? "default" : "secondary"}
                                                                className={cn(
                                                                    "h-12",
                                                                    selectedAmountType === amount && "scale-105 shadow-lg"
                                                                )}
                                                            >
                                                                <Coins className="w-4 h-4 me-1" />
                                                                {t(`interest.amounts.${amount}`)}
                                                            </Button>
                                                        ))}
                                                        <Button
                                                            type="button"
                                                            onClick={() => handleAmountSelect('custom')}
                                                            variant={selectedAmountType === 'custom' ? "default" : "secondary"}
                                                            className={cn(
                                                                "col-span-2 md:col-span-1 h-12",
                                                                selectedAmountType === 'custom' && "scale-105 shadow-lg"
                                                            )}
                                                        >
                                                            {t('interest.amounts.custom')}
                                                        </Button>
                                                    </div>
                                                    
                                                    <AnimatePresence>
                                                        {selectedAmountType === 'custom' && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                            >
                                                                <Input
                                                                    type="number"
                                                                    value={customAmount}
                                                                    onChange={handleCustomAmountChange}
                                                                    placeholder={t('interest.form.monthlyAmountPlaceholder')}
                                                                    min="1"
                                                                />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                    
                                                    {errors.monthly_amount && (
                                                        <p className="text-red-400 text-sm">{errors.monthly_amount}</p>
                                                    )}
                                                </div>

                                                {/* Referral Code */}
                                                <div className="md:col-span-2 space-y-3">
                                                    <Label htmlFor="referral_code">
                                                        {t('interest.form.referralCode')}
                                                    </Label>
                                                    <div className="relative">
                                                        <Tag className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-500" />
                                                        <Input
                                                            id="referral_code"
                                                            name="referral_code"
                                                            value={formData.referral_code}
                                                            onChange={handleInputChange}
                                                            placeholder={t('interest.form.referralCodePlaceholder')}
                                                            className="ps-11"
                                                            dir="ltr"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Submit Button */}
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                size="xl"
                                                className="w-full pulse-glow"
                                            >
                                                {isSubmitting ? (
                                                    <span className="flex items-center gap-2">
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        {t('interest.form.submitting')}
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2">
                                                        <UserPlus className="w-5 h-5" />
                                                        {t('interest.form.submit')}
                                                    </span>
                                                )}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </MainLayout>
    );
}
