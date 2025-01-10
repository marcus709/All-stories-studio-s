export const PLATFORM_PREVIEW_STYLES = {
  kdp: {
    print: {
      '5x8': {
        width: '5in',
        height: '8in',
        margins: '0.5in',
        gutter: '0.125in',
        bleed: '0.125in',
      },
      '6x9': {
        width: '6in',
        height: '9in',
        margins: '0.5in',
        gutter: '0.125in',
        bleed: '0.125in',
      },
      '8.5x11': {
        width: '8.5in',
        height: '11in',
        margins: '0.5in',
        gutter: '0.125in',
        bleed: '0.125in',
      }
    },
    digital: {
      kindle: {
        width: '1024px',
        height: '1366px',
        margins: '25px',
        fontSize: '16px',
        lineHeight: '1.5',
      },
      ipad: {
        width: '768px',
        height: '1024px',
        margins: '20px',
        fontSize: '16px',
        lineHeight: '1.5',
      },
      phone: {
        width: '320px',
        height: '568px',
        margins: '15px',
        fontSize: '14px',
        lineHeight: '1.4',
      }
    }
  },
  ingramSpark: {
    print: {
      '5x8': {
        width: '5in',
        height: '8in',
        margins: '0.5in',
        gutter: '0.125in',
        bleed: '0.25in',
      },
      '6x9': {
        width: '6in',
        height: '9in',
        margins: '0.5in',
        gutter: '0.125in',
        bleed: '0.25in',
      },
      '8.5x8.5': {
        width: '8.5in',
        height: '8.5in',
        margins: '0.5in',
        gutter: '0.125in',
        bleed: '0.25in',
      }
    }
  }
};

// Default styles to use as fallback
const DEFAULT_STYLES = {
  width: '6in',
  height: '9in',
  margins: '0.5in',
  gutter: '0.125in',
  bleed: '0.125in',
  fontSize: '12pt',
  lineHeight: '1.5',
};

export const getPreviewStyles = (
  platform: 'kdp' | 'ingramSpark',
  format: 'print' | 'digital',
  size: string,
  deviceView: 'print' | 'kindle' | 'ipad' | 'phone'
) => {
  // Get platform styles or use kdp as default
  const platformStyles = PLATFORM_PREVIEW_STYLES[platform] || PLATFORM_PREVIEW_STYLES.kdp;
  
  // Get format styles or use print as default
  const formatStyles = platformStyles[format] || platformStyles.print;
  
  // For digital format, use device view as size
  const sizeKey = format === 'digital' ? deviceView : size;
  
  // Get specific size styles or use default size
  const baseStyles = (formatStyles && formatStyles[sizeKey]) || DEFAULT_STYLES;

  // Convert inches to pixels for display (assuming 96dpi)
  const inToPx = (value: string) => {
    if (value.endsWith('in')) {
      return `${parseFloat(value) * 96}px`;
    }
    return value;
  };

  const styles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    margin: '0 auto',
    position: 'relative',
    overflow: 'hidden',
    fontSize: format === 'digital' ? (
      deviceView === 'kindle' ? '16px' :
      deviceView === 'phone' ? '14px' :
      '16px'
    ) : baseStyles.fontSize,
    lineHeight: format === 'digital' ? (
      deviceView === 'kindle' ? '1.6' :
      deviceView === 'phone' ? '1.5' :
      '1.6'
    ) : baseStyles.lineHeight,
    padding: format === 'digital' ? (
      deviceView === 'kindle' ? '24px' :
      deviceView === 'phone' ? '16px' :
      '32px'
    ) : inToPx(baseStyles.margins),
  };

  // Add bleed indicator for print formats
  if (format === 'print' && baseStyles.bleed) {
    styles.outline = `${inToPx(baseStyles.bleed)} solid rgba(255, 0, 0, 0.1)`;
  }

  // Add gutter visualization for print formats
  if (format === 'print' && baseStyles.gutter) {
    styles.borderLeft = `${inToPx(baseStyles.gutter)} solid rgba(0, 0, 255, 0.1)`;
  }

  return styles;
};