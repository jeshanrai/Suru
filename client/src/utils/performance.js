// Performance monitoring utility
export const measurePerformance = () => {
    if (typeof window === 'undefined' || !window.performance) {
        return null;
    }

    const perfData = window.performance.getEntriesByType('navigation')[0];

    if (!perfData) return null;

    return {
        // Page load metrics
        dns: perfData.domainLookupEnd - perfData.domainLookupStart,
        tcp: perfData.connectEnd - perfData.connectStart,
        request: perfData.responseStart - perfData.requestStart,
        response: perfData.responseEnd - perfData.responseStart,
        dom: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        load: perfData.loadEventEnd - perfData.loadEventStart,
        total: perfData.loadEventEnd - perfData.fetchStart,

        // Formatted for display
        formatted: {
            total: `${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`,
            domReady: `${Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart)}ms`,
            firstPaint: getFirstPaint(),
        }
    };
};

const getFirstPaint = () => {
    const paintEntries = window.performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcp ? `${Math.round(fcp.startTime)}ms` : 'N/A';
};

// Log performance metrics to console (dev only)
export const logPerformance = () => {
    // Vite uses import.meta.env for environment variables
    if (import.meta.env.MODE === 'development') {
        setTimeout(() => {
            const metrics = measurePerformance();
            if (metrics) {
                console.group('⚡ Performance Metrics');
                console.log('Total Load Time:', metrics.formatted.total);
                console.log('DOM Ready:', metrics.formatted.domReady);
                console.log('First Contentful Paint:', metrics.formatted.firstPaint);
                console.groupEnd();
            }
        }, 0);
    }
};

// Report Web Vitals (placeholder for future implementation)
export const reportWebVitals = (onPerfEntry) => {
    console.log('Web Vitals reporting not yet configured');
};
