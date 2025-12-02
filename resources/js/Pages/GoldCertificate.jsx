import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Sparkles, User, Calendar, Hash, RefreshCw, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import MainLayout from '../Layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

export default function GoldCertificate() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const [formData, setFormData] = useState({
        name: '',
        certificateNumber: '',
        goldGrams: '',
        issueDate: new Date().toISOString().split('T')[0],
    });

    const [showCertificate, setShowCertificate] = useState(false);
    const [generatedCertNumber, setGeneratedCertNumber] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);
    const certificateRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const generateCertificateNumber = () => {
        const prefix = 'GC';
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 900000) + 100000;
        setFormData(prev => ({ ...prev, certificateNumber: `${prefix}-${year}-${random}` }));
    };

    const handleGenerateCertificate = (e) => {
        e.preventDefault();
        if (formData.name && formData.goldGrams) {
            let certNumber = formData.certificateNumber;
            if (!certNumber) {
                const prefix = 'GC';
                const year = new Date().getFullYear();
                const random = Math.floor(Math.random() * 900000) + 100000;
                certNumber = `${prefix}-${year}-${random}`;
                setFormData(prev => ({ ...prev, certificateNumber: certNumber }));
            }
            setGeneratedCertNumber(certNumber);
            setShowCertificate(true);
        }
    };

    const resetForm = () => {
        setShowCertificate(false);
        setGeneratedCertNumber('');
        setFormData({
            name: '',
            certificateNumber: '',
            goldGrams: '',
            issueDate: new Date().toISOString().split('T')[0],
        });
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat(isRTL ? 'ar-OM' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    };

    const downloadCertificate = async () => {
        if (!certificateRef.current) {
            console.error('Certificate ref not found');
            return;
        }
        
        setIsDownloading(true);
        try {
            // Create a fixed-size clone for consistent download
            const fixedWidth = 800;
            const fixedHeight = 566; // A4 landscape ratio
            
            // Create container
            const container = document.createElement('div');
            container.style.cssText = `
                position: fixed;
                left: -9999px;
                top: 0;
                width: ${fixedWidth}px;
                height: ${fixedHeight}px;
                background: #1a1409;
                direction: ${isRTL ? 'rtl' : 'ltr'};
                font-family: system-ui, -apple-system, sans-serif;
            `;
            
            // Build certificate HTML with fixed sizes
            container.innerHTML = `
                <div style="position: absolute; inset: 0; background: linear-gradient(to bottom right, #1a1409, #2a1f0d, #1a1409);"></div>
                <div style="position: absolute; inset: 0; opacity: 0.03; background-image: url('data:image/svg+xml,%3Csvg width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 100 100\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M50 0L60 35H95L67.5 57.5L80 95L50 72.5L20 95L32.5 57.5L5 35H40L50 0Z\\' fill=\\'%23C6963F\\'/%3E%3C/svg%3E'); background-size: 40px 40px;"></div>
                <div style="position: absolute; inset: 12px; border-radius: 8px; border: 2px solid rgba(166, 118, 50, 0.5);"></div>
                
                <!-- Corners -->
                <div style="position: absolute; top: 16px; left: 16px; width: 30px; height: 30px;">
                    <div style="position: absolute; inset: 0; border-top: 3px solid #c6963f; border-left: 3px solid #c6963f; border-top-left-radius: 8px;"></div>
                    <span style="position: absolute; top: -4px; left: 4px; color: #e8c55e; font-size: 18px;">✦</span>
                </div>
                <div style="position: absolute; top: 16px; right: 16px; width: 30px; height: 30px;">
                    <div style="position: absolute; inset: 0; border-top: 3px solid #c6963f; border-right: 3px solid #c6963f; border-top-right-radius: 8px;"></div>
                    <span style="position: absolute; top: -4px; right: 4px; color: #e8c55e; font-size: 18px;">✦</span>
                </div>
                <div style="position: absolute; bottom: 16px; left: 16px; width: 30px; height: 30px;">
                    <div style="position: absolute; inset: 0; border-bottom: 3px solid #c6963f; border-left: 3px solid #c6963f; border-bottom-left-radius: 8px;"></div>
                    <span style="position: absolute; bottom: -4px; left: 4px; color: #e8c55e; font-size: 18px;">✦</span>
                </div>
                <div style="position: absolute; bottom: 16px; right: 16px; width: 30px; height: 30px;">
                    <div style="position: absolute; inset: 0; border-bottom: 3px solid #c6963f; border-right: 3px solid #c6963f; border-bottom-right-radius: 8px;"></div>
                    <span style="position: absolute; bottom: -4px; right: 4px; color: #e8c55e; font-size: 18px;">✦</span>
                </div>
                
                <!-- Content -->
                <div style="position: relative; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 40px 50px 30px 50px;">
                    <!-- Header -->
                    <div style="text-align: center;">
                        <div style="display: inline-flex; align-items: center; justify-content: center; width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(to bottom right, #e8c55e, #a67632); margin-bottom: 12px;">
                            <span style="color: white; font-size: 26px;">👑</span>
                        </div>
                        <h2 style="color: #c6963f; margin: 0 0 4px 0; font-size: 28px; font-weight: bold;">${t('certificate.certTitle')}</h2>
                        <p style="color: #e8c55e; margin: 0; font-size: 14px;">${t('certificate.certSubtitle')}</p>
                    </div>
                    
                    <!-- Body -->
                    <div style="text-align: center; flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 16px; width: 100%; max-width: 500px;">
                        <p style="color: #f7e3a3; margin: 0; font-size: 18px;">${t('certificate.certBody')}</p>
                        <div style="background: rgba(110, 72, 40, 0.3); border: 1px solid rgba(166, 118, 50, 0.3); border-radius: 12px; padding: 14px 24px;">
                            <p style="color: #c6963f; margin: 0; font-size: 32px; font-weight: bold;">${formData.name}</p>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                            <span style="color: #f7e3a3; font-size: 20px;">${t('certificate.certGoldAmount')}</span>
                            <span style="color: #fbf0c8; font-size: 24px; font-weight: bold;">${parseFloat(formData.goldGrams).toLocaleString()} ${t('certificate.grams')}</span>
                        </div>
                        <p style="color: #e8c55e; margin: 0; font-size: 13px;">${t('certificate.certDescription')}</p>
                    </div>
                    
                    <!-- Logo -->
                    <div style="text-align: center; margin-bottom: 16px;">
                        <img src="/images/Goldcom Logo - Monochrome White.png" alt="Goldcom" style="height: 70px; width: auto;" crossorigin="anonymous" />
                    </div>
                    
                    <!-- Footer -->
                    <div style="width: 100%; display: flex; justify-content: space-between; align-items: flex-end; padding: 0 20px;">
                        <div style="text-align: ${isRTL ? 'right' : 'left'};">
                            <p style="color: #a67632; margin: 0 0 2px 0; font-size: 11px;">${t('certificate.certNumber')}</p>
                            <p style="color: #f7e3a3; margin: 0; font-size: 13px; font-family: monospace;">${generatedCertNumber}</p>
                        </div>
                        <div style="text-align: ${isRTL ? 'left' : 'right'};">
                            <p style="color: #a67632; margin: 0 0 2px 0; font-size: 11px;">${t('certificate.certDate')}</p>
                            <p style="color: #f7e3a3; margin: 0; font-size: 13px;">${formatDate(formData.issueDate)}</p>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(container);
            
            // Wait for image to load
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const canvas = await html2canvas(container, {
                scale: 2,
                backgroundColor: '#1a1409',
                useCORS: true,
                allowTaint: true,
                logging: false,
                width: fixedWidth,
                height: fixedHeight,
            });
            
            document.body.removeChild(container);
            
            // Convert to blob and download
            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `goldcom-certificate-${generatedCertNumber || 'certificate'}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                }
                setIsDownloading(false);
            }, 'image/png', 1.0);
        } catch (error) {
            console.error('Error downloading certificate:', error);
            alert('حدث خطأ أثناء تحميل الشهادة. يرجى المحاولة مرة أخرى.');
            setIsDownloading(false);
        }
    };

    return (
        <MainLayout>
            <div className="min-h-screen py-4 sm:py-6 md:py-8 px-3 sm:px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-6 sm:mb-8 md:mb-10"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', delay: 0.2, duration: 0.8 }}
                            className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-700 shadow-lg shadow-gold-500/40 mb-4 sm:mb-6"
                        >
                            <Award className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" />
                        </motion.div>

                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-4">
                            <span className="gradient-text">{t('certificate.title')}</span>
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-gold-300 mb-1 sm:mb-2">
                            {t('certificate.subtitle')}
                        </p>
                        <p className="text-sm sm:text-base text-gold-500 max-w-md mx-auto px-2">
                            {t('certificate.description')}
                        </p>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {!showCertificate ? (
                            /* Form Section */
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <Card className="p-1 sm:p-2 md:p-4 max-w-2xl mx-auto">
                                    <CardContent className="pt-4 sm:pt-6">
                                        <form onSubmit={handleGenerateCertificate} className="space-y-4 sm:space-y-6">
                                            {/* Name */}
                                            <div className="space-y-2 sm:space-y-3">
                                                <Label htmlFor="name" className="text-sm sm:text-base">
                                                    {t('certificate.form.name')} <span className="text-red-400">*</span>
                                                </Label>
                                                <div className="relative">
                                                    <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gold-500" />
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        placeholder={t('certificate.form.namePlaceholder')}
                                                        className="ps-10 sm:ps-11 text-sm sm:text-base"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Gold Grams */}
                                            <div className="space-y-2 sm:space-y-3">
                                                <Label htmlFor="goldGrams" className="text-sm sm:text-base">
                                                    {t('certificate.form.goldGrams')} <span className="text-red-400">*</span>
                                                </Label>
                                                <div className="relative">
                                                    <Sparkles className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gold-500" />
                                                    <Input
                                                        id="goldGrams"
                                                        name="goldGrams"
                                                        type="number"
                                                        step="0.001"
                                                        min="0.001"
                                                        value={formData.goldGrams}
                                                        onChange={handleInputChange}
                                                        placeholder={t('certificate.form.goldGramsPlaceholder')}
                                                        className="ps-10 sm:ps-11 text-sm sm:text-base"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Certificate Number */}
                                            <div className="space-y-2 sm:space-y-3">
                                                <Label htmlFor="certificateNumber" className="text-sm sm:text-base">
                                                    {t('certificate.form.certificateNumber')}
                                                </Label>
                                                <div className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <Hash className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gold-500" />
                                                        <Input
                                                            id="certificateNumber"
                                                            name="certificateNumber"
                                                            value={formData.certificateNumber}
                                                            onChange={handleInputChange}
                                                            placeholder={t('certificate.form.certificateNumberPlaceholder')}
                                                            className="ps-10 sm:ps-11 text-sm sm:text-base"
                                                            dir="ltr"
                                                        />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        onClick={generateCertificateNumber}
                                                        className="shrink-0 px-3"
                                                    >
                                                        <RefreshCw className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <p className="text-gold-600 text-xs sm:text-sm">
                                                    {t('certificate.form.autoGenerate')}
                                                </p>
                                            </div>

                                            {/* Issue Date */}
                                            <div className="space-y-2 sm:space-y-3">
                                                <Label htmlFor="issueDate" className="text-sm sm:text-base">
                                                    {t('certificate.form.issueDate')}
                                                </Label>
                                                <div className="relative">
                                                    <Calendar className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gold-500" />
                                                    <Input
                                                        id="issueDate"
                                                        name="issueDate"
                                                        type="date"
                                                        value={formData.issueDate}
                                                        onChange={handleInputChange}
                                                        className="ps-10 sm:ps-11 text-sm sm:text-base"
                                                        dir="ltr"
                                                    />
                                                </div>
                                            </div>

                                            {/* Submit Button */}
                                            <Button
                                                type="submit"
                                                size="xl"
                                                className="w-full pulse-glow text-sm sm:text-base"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    {t('certificate.form.generate')}
                                                </span>
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ) : (
                            /* Certificate Display */
                            <motion.div
                                key="certificate"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="space-y-4 sm:space-y-6"
                            >
                                {/* Certificate */}
                                <div className="py-2 sm:py-4">
                                    <div
                                        ref={certificateRef}
                                        className="mx-auto w-full max-w-[800px] aspect-[1/1.2] sm:aspect-[1.2/1] md:aspect-[1.414/1] relative rounded-lg overflow-hidden"
                                        style={{ 
                                            direction: isRTL ? 'rtl' : 'ltr',
                                            backgroundColor: '#1a1409'
                                        }}
                                    >
                                        {/* Certificate Background */}
                                        <div 
                                            className="absolute inset-0"
                                            style={{
                                                background: 'linear-gradient(to bottom right, #1a1409, #2a1f0d, #1a1409)'
                                            }}
                                        />
                                        
                                        {/* Decorative Pattern Overlay */}
                                        <div 
                                            className="absolute inset-0"
                                            style={{
                                                opacity: 0.03,
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0L60 35H95L67.5 57.5L80 95L50 72.5L20 95L32.5 57.5L5 35H40L50 0Z' fill='%23C6963F'/%3E%3C/svg%3E")`,
                                                backgroundSize: '30px 30px',
                                            }}
                                        />

                                        {/* Ornate Border */}
                                        <div style={{ position: 'absolute', inset: '6px', borderRadius: '6px', border: '2px solid rgba(166, 118, 50, 0.5)' }} />

                                        {/* Corner Decorations */}
                                        <div style={{ position: 'absolute', top: '10px', left: '10px', width: '20px', height: '20px' }}>
                                            <div style={{ position: 'absolute', inset: 0, borderTop: '2px solid #c6963f', borderLeft: '2px solid #c6963f', borderTopLeftRadius: '6px' }} />
                                            <span style={{ position: 'absolute', top: '-3px', left: '2px', color: '#e8c55e', fontSize: '12px' }}>✦</span>
                                        </div>
                                        <div style={{ position: 'absolute', top: '10px', right: '10px', width: '20px', height: '20px' }}>
                                            <div style={{ position: 'absolute', inset: 0, borderTop: '2px solid #c6963f', borderRight: '2px solid #c6963f', borderTopRightRadius: '6px' }} />
                                            <span style={{ position: 'absolute', top: '-3px', right: '2px', color: '#e8c55e', fontSize: '12px' }}>✦</span>
                                        </div>
                                        <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '20px', height: '20px' }}>
                                            <div style={{ position: 'absolute', inset: 0, borderBottom: '2px solid #c6963f', borderLeft: '2px solid #c6963f', borderBottomLeftRadius: '6px' }} />
                                            <span style={{ position: 'absolute', bottom: '-3px', left: '2px', color: '#e8c55e', fontSize: '12px' }}>✦</span>
                                        </div>
                                        <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '20px', height: '20px' }}>
                                            <div style={{ position: 'absolute', inset: 0, borderBottom: '2px solid #c6963f', borderRight: '2px solid #c6963f', borderBottomRightRadius: '6px' }} />
                                            <span style={{ position: 'absolute', bottom: '-3px', right: '2px', color: '#e8c55e', fontSize: '12px' }}>✦</span>
                                        </div>

                                        {/* Certificate Content */}
                                        <div className="relative h-full flex flex-col items-center justify-between" style={{ padding: '28px 16px 20px 16px' }}>
                                            {/* Header */}
                                            <div className="text-center" style={{ marginBottom: '6px' }}>
                                                {/* Crown Icon */}
                                                <div 
                                                    className="inline-flex items-center justify-center rounded-full shadow-lg"
                                                    style={{ 
                                                        background: 'linear-gradient(to bottom right, #e8c55e, #a67632)',
                                                        width: '36px',
                                                        height: '36px',
                                                        marginBottom: '6px'
                                                    }}
                                                >
                                                    <span style={{ color: '#ffffff', fontSize: '18px' }}>👑</span>
                                                </div>
                                                
                                                {/* Title */}
                                                <div>
                                                    <h2 style={{ color: '#c6963f', marginBottom: '2px', fontSize: '16px', fontWeight: 'bold' }}>
                                                        {t('certificate.certTitle')}
                                                    </h2>
                                                    <p style={{ color: '#e8c55e', fontSize: '10px' }}>
                                                        {t('certificate.certSubtitle')}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Body */}
                                            <div className="text-center flex-1 flex flex-col justify-center w-full" style={{ gap: '6px', padding: '4px 0' }}>
                                                <p style={{ color: '#f7e3a3', fontSize: '12px' }}>
                                                    {t('certificate.certBody')}
                                                </p>
                                                
                                                {/* Name */}
                                                <div 
                                                    className="rounded-lg"
                                                    style={{ backgroundColor: 'rgba(110, 72, 40, 0.3)', border: '1px solid rgba(166, 118, 50, 0.3)', padding: '8px 12px' }}
                                                >
                                                    <p className="font-bold break-words" style={{ color: '#c6963f', fontSize: '18px' }}>
                                                        {formData.name}
                                                    </p>
                                                </div>

                                                {/* Gold Amount */}
                                                <div className="flex items-center justify-center" style={{ gap: '6px', fontSize: '14px' }}>
                                                    <span style={{ color: '#f7e3a3' }}>{t('certificate.certGoldAmount')}</span>
                                                    <span className="font-bold" style={{ color: '#fbf0c8', fontSize: '16px' }}>
                                                        {parseFloat(formData.goldGrams).toLocaleString()} {t('certificate.grams')}
                                                    </span>
                                                </div>

                                                <p style={{ color: '#e8c55e', fontSize: '9px' }}>
                                                    {t('certificate.certDescription')}
                                                </p>
                                            </div>

                                            {/* Logo */}
                                            <div className="flex flex-col items-center" style={{ marginBottom: '8px', marginTop: '4px' }}>
                                                <img 
                                                    src="/images/Goldcom Logo - Monochrome White.png" 
                                                    alt="Goldcom" 
                                                    style={{ height: '45px', width: 'auto' }}
                                                />
                                            </div>

                                            {/* Footer Info */}
                                            <div className="w-full flex justify-between items-end" style={{ gap: '12px', padding: '0 4px' }}>
                                                {/* Certificate Number */}
                                                <div style={{ textAlign: isRTL ? 'right' : 'left', flex: '1' }}>
                                                    <p style={{ color: '#a67632', marginBottom: '1px', fontSize: '8px' }}>{t('certificate.certNumber')}</p>
                                                    <p className="font-mono" style={{ color: '#f7e3a3', fontSize: '9px' }}>{generatedCertNumber}</p>
                                                </div>

                                                {/* Issue Date */}
                                                <div style={{ textAlign: isRTL ? 'left' : 'right', flex: '1' }}>
                                                    <p style={{ color: '#a67632', marginBottom: '1px', fontSize: '8px' }}>{t('certificate.certDate')}</p>
                                                    <p style={{ color: '#f7e3a3', fontSize: '9px' }}>{formatDate(formData.issueDate)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row justify-center gap-3 px-4">
                                    <Button
                                        onClick={downloadCertificate}
                                        disabled={isDownloading}
                                        size="xl"
                                        className="w-full sm:w-auto min-w-[200px] text-sm sm:text-base pulse-glow"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Download className={`w-4 h-4 sm:w-5 sm:h-5 ${isDownloading ? 'animate-bounce' : ''}`} />
                                            {isDownloading ? t('certificate.downloading') : t('certificate.download')}
                                        </span>
                                    </Button>
                                    <Button
                                        onClick={resetForm}
                                        variant="secondary"
                                        size="xl"
                                        className="w-full sm:w-auto min-w-[200px] text-sm sm:text-base"
                                    >
                                        <span className="flex items-center gap-2">
                                            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                                            {t('certificate.createNew')}
                                        </span>
                                    </Button>
                                </div>

                                {/* Note */}
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-center text-gold-600 text-xs sm:text-sm px-4"
                                >
                                    {t('certificate.note')}
                                </motion.p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </MainLayout>
    );
}
