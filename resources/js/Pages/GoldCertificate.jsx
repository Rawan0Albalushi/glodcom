import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Award, Download, RefreshCw } from 'lucide-react';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import MainLayout from '../Layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function GoldCertificate() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [scale, setScale] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const containerRef = useRef(null);
    const certificateRef = useRef(null);

    // Static certificate data
    const certificateData = {
        certificateId: 'GC-2025-847291',
        holderName: isRTL ? 'محمد أحمد العامري' : 'Mohammed Ahmed Al-Amri',
        barWeight: '10g',
        purity: '999.9 (24K)',
        serialNumber: 'PAMP-2025-584721',
        manufacturer: 'PAMP Suisse',
        purchasePrice: '155.00 OMR',
        issueDate: isRTL ? '٢ ديسمبر ٢٠٢٥' : 'December 2, 2025',
        storageLocation: isRTL ? 'مخزن جولدكم - مسقط، عُمان' : 'Goldcom Storage - Muscat, Oman',
        status: 'stored', // 'stored' or 'delivered'
    };

    const statusText = certificateData.status === 'stored' 
        ? (isRTL ? 'في المخزن' : 'In Storage')
        : (isRTL ? 'تم الاستلام' : 'Delivered');

    const dataRows = [
        { label: isRTL ? 'رقم الشهادة' : 'Certificate ID', value: certificateData.certificateId, icon: '📜' },
        { label: isRTL ? 'اسم المالك' : 'Holder Name', value: certificateData.holderName, icon: '👤' },
        { label: isRTL ? 'وزن السبيكة' : 'Bar Weight', value: certificateData.barWeight, icon: '⚖️' },
        { label: isRTL ? 'النقاوة' : 'Gold Purity', value: certificateData.purity, icon: '✨' },
        { label: isRTL ? 'الرقم التسلسلي' : 'Serial Number', value: certificateData.serialNumber, icon: '🔢', mono: true },
        { label: isRTL ? 'الشركة المصنعة' : 'Manufacturer', value: certificateData.manufacturer, icon: '🏭' },
        { label: isRTL ? 'سعر الشراء' : 'Purchase Price', value: certificateData.purchasePrice, icon: '💰' },
        { label: isRTL ? 'تاريخ الإصدار' : 'Issue Date', value: certificateData.issueDate, icon: '📅' },
        { label: isRTL ? 'تم تخزين الذهب في' : 'Gold Stored At', value: certificateData.storageLocation, icon: '🏦' },
        { label: isRTL ? 'الحالة' : 'Status', value: statusText, icon: certificateData.status === 'stored' ? '🔐' : '✅', status: certificateData.status },
    ];

    // Generate real scannable QR Code with certificate ID
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    
    useEffect(() => {
        const generateQRCode = async () => {
            try {
                // Generate QR code with just the certificate ID
                const qrDataUrl = await QRCode.toDataURL(certificateData.certificateId, {
                    width: 128,
                    margin: 1,
                    color: {
                        dark: '#F5D992',  // Gold color for the QR pattern
                        light: '#1A1410', // Dark background
                    },
                    errorCorrectionLevel: 'M',
                });
                
                setQrCodeUrl(qrDataUrl);
            } catch (err) {
                console.error('Error generating QR code:', err);
            }
        };
        
        generateQRCode();
    }, [certificateData.certificateId]);

    // Calculate scale and detect mobile
    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth - 32;
                const certificateWidth = 800;
                const newScale = Math.min(1, containerWidth / certificateWidth);
                setScale(newScale);
                setIsMobile(containerWidth < 500);
            }
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    const downloadCertificate = async () => {
        if (!certificateRef.current) return;
        
        setIsDownloading(true);
        try {
            // Wait for fonts to be ready
            await document.fonts.ready;
            
            // Store original transform
            const originalTransform = certificateRef.current.style.transform;
            
            // Reset scale to 1 for high quality capture
            certificateRef.current.style.transform = 'scale(1)';
            
            // Wait for rerender and fonts
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2,
                backgroundColor: '#0D0B09',
                useCORS: true,
                allowTaint: true,
                logging: false,
                width: 800,
                height: 880,
                letterRendering: true,
            });
            
            // Restore original transform
            certificateRef.current.style.transform = originalTransform;
            
            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `goldcom-certificate-${certificateData.certificateId}.png`;
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

    // Mobile Card View Component
    const MobileCertificateView = () => (
        <Card className="overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-gold-900/50 to-gold-950 p-4 text-center border-b border-gold-700/30">
                <img 
                    src="/images/Goldcom Logo - Wide Monochrome White.png" 
                    alt="Goldcom" 
                    className="h-10 w-auto mx-auto mb-3"
                />
                <h2 className="gradient-text text-lg font-bold">
                    {isRTL ? 'شهادة ملكية السبيكة الذهبية' : 'Gold Bar Certificate'}
                </h2>
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-2" />
            </div>

            {/* Data List */}
            <div className="p-3 space-y-0">
                {dataRows.map((row, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center justify-between py-3 ${
                            index !== dataRows.length - 1 ? 'border-b border-gold-800/50' : ''
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-base">{row.icon}</span>
                            <span className="text-gold-500 text-sm">{row.label}</span>
                        </div>
                        {row.status ? (
                            <span 
                                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                    row.status === 'stored' 
                                        ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40' 
                                        : 'bg-green-500/20 text-green-400 border border-green-500/40'
                                }`}
                            >
                                {row.value}
                            </span>
                        ) : (
                            <span 
                                className={`text-sm font-semibold ${row.mono ? 'text-gold-300 font-mono text-xs' : 'text-gold-200'}`}
                                style={{ maxWidth: '55%', textAlign: 'end' }}
                            >
                                {row.value}
                            </span>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Footer with QR Code */}
            <div className="bg-gold-950/50 p-4 border-t border-gold-800/30">
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <p className="text-gold-500 text-[9px] uppercase tracking-wider mb-1">
                            {isRTL ? 'التحقق الرقمي' : 'Digital Verification'}
                        </p>
                        <p className="text-gold-600 text-[10px]">
                            {isRTL 
                                ? 'هذه الشهادة صادرة من منصة جولدكم للادخار بالذهب'
                                : 'Issued by Goldcom Gold Savings Platform'
                            }
                        </p>
                    </div>
                    <div className="text-center">
                        <div 
                            className="p-2 rounded-lg border-2 border-gold-500"
                            style={{ 
                                background: 'linear-gradient(135deg, #1A1410, #0D0B09)',
                                boxShadow: '0 0 12px rgba(198, 150, 63, 0.2)'
                            }}
                        >
                            {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-12 h-12 block rounded" />}
                        </div>
                        <p className="text-gold-500 text-[7px] mt-1 font-medium">{isRTL ? 'امسح للتحقق' : 'Scan'}</p>
                    </div>
                </div>
            </div>
        </Card>
    );

    // Desktop Certificate View - Using inline styles for html2canvas compatibility
    const DesktopCertificateView = () => (
        <div 
            style={{ 
                width: `${800 * scale}px`,
                height: `${880 * scale}px`,
                margin: '0 auto',
            }}
        >
            <div
                ref={certificateRef}
                dir={isRTL ? 'rtl' : 'ltr'}
                style={{ 
                    width: '800px',
                    height: '880px',
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    fontFamily: isRTL ? '"Cairo", "Segoe UI", Tahoma, sans-serif' : '"Outfit", "Segoe UI", Tahoma, sans-serif',
                }}
            >
                {/* Certificate Background */}
                <div 
                    style={{ 
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(160deg, #1A1410 0%, #0D0B09 50%, #1A1410 100%)',
                    }}
                >
                    {/* Borders */}
                    <div style={{ position: 'absolute', inset: '8px', borderRadius: '12px', border: '1px solid rgba(198, 150, 63, 0.3)', boxShadow: 'inset 0 0 60px rgba(198, 150, 63, 0.05)' }} />
                    <div style={{ position: 'absolute', inset: '16px', borderRadius: '8px', border: '2px solid #C6963F' }} />
                    
                    {/* Corner decorations */}
                    <div style={{ position: 'absolute', top: '20px', left: '20px', width: '40px', height: '40px', borderTop: '3px solid #E8C55B', borderLeft: '3px solid #E8C55B', borderTopLeftRadius: '8px' }} />
                    <div style={{ position: 'absolute', top: '20px', right: '20px', width: '40px', height: '40px', borderTop: '3px solid #E8C55B', borderRight: '3px solid #E8C55B', borderTopRightRadius: '8px' }} />
                    <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '40px', height: '40px', borderBottom: '3px solid #E8C55B', borderLeft: '3px solid #E8C55B', borderBottomLeftRadius: '8px' }} />
                    <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '40px', height: '40px', borderBottom: '3px solid #E8C55B', borderRight: '3px solid #E8C55B', borderBottomRightRadius: '8px' }} />
                    
                    {/* Content */}
                    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', padding: '35px 50px' }}>
                        {/* Header */}
                        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                            <img src="/images/Goldcom Logo - Wide Monochrome White.png" alt="Goldcom" style={{ height: '50px', width: 'auto', margin: '0 auto 15px auto', display: 'block' }} />
                            <h1 style={{ 
                                color: '#E8C55B', 
                                fontSize: '24px', 
                                fontWeight: 700, 
                                letterSpacing: isRTL ? '0' : '2px', 
                                margin: '0 0 8px 0',
                                fontFamily: isRTL ? '"Cairo", "Segoe UI", Tahoma, sans-serif' : 'inherit',
                                direction: isRTL ? 'rtl' : 'ltr',
                            }}>
                                {isRTL ? 'شهادة ملكية السبيكة الذهبية' : 'GOLD BAR OWNERSHIP CERTIFICATE'}
                            </h1>
                            <div style={{ width: '120px', height: '2px', background: 'linear-gradient(90deg, transparent, #C6963F, transparent)', margin: '0 auto' }} />
                        </div>
                        
                        {/* Table */}
                        <div style={{ flex: 1, padding: '0 32px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                <tbody>
                                    {dataRows.map((row, index) => (
                                        <tr key={index} style={{ borderBottom: index === dataRows.length - 1 ? 'none' : '1px solid rgba(198, 150, 63, 0.2)' }}>
                                            <td style={{ padding: '14px 0', fontWeight: 500, width: '40%', color: '#A87B32' }}>{row.label}</td>
                                            <td style={{ padding: '14px 0', fontWeight: 600, textAlign: isRTL ? 'left' : 'right', fontFamily: row.mono ? 'monospace' : 'inherit', letterSpacing: row.mono ? '1px' : 'normal' }}>
                                                {row.status ? (
                                                    <span 
                                                        style={{
                                                            display: 'inline-block',
                                                            padding: '6px 14px',
                                                            borderRadius: '20px',
                                                            fontSize: '12px',
                                                            backgroundColor: row.status === 'stored' ? 'rgba(198, 150, 63, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                                                            color: row.status === 'stored' ? '#E8C55B' : '#4ADE80',
                                                            border: `1px solid ${row.status === 'stored' ? 'rgba(198, 150, 63, 0.4)' : 'rgba(34, 197, 94, 0.4)'}`,
                                                        }}
                                                    >
                                                        {row.value}
                                                    </span>
                                                ) : (
                                                    <span style={{ color: row.mono ? '#E8C55B' : '#F5D992' }}>{row.value}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Footer with QR Code */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', marginTop: '16px', borderTop: '1px solid rgba(198, 150, 63, 0.2)' }}>
                            <div style={{ flex: 1, paddingRight: isRTL ? '0' : '20px', paddingLeft: isRTL ? '20px' : '0' }}>
                                <p style={{ 
                                    color: '#C6963F', 
                                    fontSize: '10px', 
                                    textTransform: isRTL ? 'none' : 'uppercase', 
                                    letterSpacing: isRTL ? '0' : '1px', 
                                    marginBottom: '6px',
                                    fontFamily: isRTL ? '"Cairo", "Segoe UI", Tahoma, sans-serif' : 'inherit',
                                    direction: isRTL ? 'rtl' : 'ltr',
                                }}>
                                    {isRTL ? 'التحقق الرقمي' : 'Digital Verification'}
                                </p>
                                <p style={{ 
                                    color: '#7A5A28', 
                                    fontSize: '11px', 
                                    margin: 0,
                                    fontFamily: isRTL ? '"Cairo", "Segoe UI", Tahoma, sans-serif' : 'inherit',
                                    direction: isRTL ? 'rtl' : 'ltr',
                                }}>
                                    {isRTL ? 'هذه الشهادة صادرة من منصة جولدكم للادخار بالذهب' : 'This certificate is issued by Goldcom Gold Savings Platform'}
                                </p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div 
                                    style={{ 
                                        padding: '10px',
                                        borderRadius: '12px',
                                        border: '2px solid #C6963F',
                                        background: 'linear-gradient(135deg, #1A1410, #0D0B09)',
                                        boxShadow: '0 0 15px rgba(198, 150, 63, 0.2)'
                                    }}
                                >
                                        {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" style={{ width: '64px', height: '64px', display: 'block', borderRadius: '4px' }} />}
                                </div>
                                <p style={{ 
                                    color: '#C6963F', 
                                    fontSize: '9px', 
                                    marginTop: '6px', 
                                    fontWeight: 500,
                                    fontFamily: isRTL ? '"Cairo", "Segoe UI", Tahoma, sans-serif' : 'inherit',
                                    direction: isRTL ? 'rtl' : 'ltr',
                                }}>{isRTL ? 'امسح للتحقق' : 'Scan to verify'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <MainLayout>
            <div className="min-h-screen py-4 sm:py-6 md:py-8 px-3 sm:px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-6 sm:mb-8"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', delay: 0.2, duration: 0.8 }}
                            className="inline-flex items-center justify-center w-14 h-14 sm:w-20 md:w-24 sm:h-20 md:h-24 rounded-2xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-700 shadow-lg shadow-gold-500/40 mb-4 sm:mb-6"
                        >
                            <Award className="w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                        </motion.div>

                        <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
                            <span className="gradient-text">{t('certificate.title')}</span>
                        </h1>
                        <p className="text-sm sm:text-lg text-gold-300 mb-1">
                            {t('certificate.subtitle')}
                        </p>
                    </motion.div>

                    {/* Certificate Display */}
                            <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="space-y-4 sm:space-y-6"
                    >
                        <div ref={containerRef} className="py-2 sm:py-4">
                            {/* Show Mobile View on small screens, Desktop View on larger screens */}
                            {isMobile ? (
                                <MobileCertificateView />
                            ) : (
                                <DesktopCertificateView />
                            )}
                            
                            {!isMobile && scale < 1 && (
                                <p className="text-center text-gold-600 text-xs mt-2">
                                    {isRTL ? 'اضغط على تحميل للحصول على الشهادة بالحجم الكامل' : 'Tap download to get full-size certificate'}
                                </p>
                            )}
                                            </div>

                        {/* Download info for mobile */}
                        {isMobile && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center px-4"
                            >
                                <p className="text-gold-400 text-xs bg-gold-900/30 rounded-lg py-2 px-3 inline-block">
                                    {isRTL 
                                        ? '📱 اضغط على تحميل للحصول على الشهادة بدقة عالية'
                                        : '📱 Tap download to get high-quality certificate'
                                    }
                                </p>
                            </motion.div>
                        )}

                                {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-3 px-2 sm:px-4">
                                    <Button
                                        onClick={downloadCertificate}
                                        disabled={isDownloading}
                                        size="xl"
                                className="w-full sm:w-auto sm:min-w-[200px] text-sm sm:text-base pulse-glow"
                                    >
                                <span className="flex items-center justify-center gap-2">
                                            <Download className={`w-4 h-4 sm:w-5 sm:h-5 ${isDownloading ? 'animate-bounce' : ''}`} />
                                            {isDownloading ? t('certificate.downloading') : t('certificate.download')}
                                        </span>
                                    </Button>
                                    <Button
                                onClick={() => window.location.reload()}
                                        variant="secondary"
                                        size="xl"
                                className="w-full sm:w-auto sm:min-w-[200px] text-sm sm:text-base"
                                    >
                                <span className="flex items-center justify-center gap-2">
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
                            className="text-center text-gold-600 text-[10px] sm:text-sm px-4"
                                >
                                    {t('certificate.note')}
                                </motion.p>
                            </motion.div>
                </div>
            </div>
        </MainLayout>
    );
}
