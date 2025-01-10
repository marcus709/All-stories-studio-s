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

export const getPreviewStyles = (
  platform: 'kdp' | 'ingramSpark',
  format: 'print' | 'digital',
  size: string,
  deviceView: 'print' | 'kindle' | 'ipad' | 'phone'
) => {
  // Get base styles from platform/format/size
  const baseStyles = format === 'digital' 
    ? PLATFORM_PREVIEW_STYLES[platform][format][deviceView]
    : PLATFORM_PREVIEW_STYLES[platform][format][size];

  // Convert inches to pixels for display (assuming 96dpi)
  const inToPx = (value: string) => {
    if (value.endsWith('in')) {
      return `${parseFloat(value) * 96}px`;
    }
    return value;
  };

  // Apply device-specific modifications
  const styles: React.CSSProperties = {
    width: inToPx(baseStyles.width),
    height: inToPx(baseStyles.height),
    padding: inToPx(baseStyles.margins),
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    margin: '0 auto',
    position: 'relative',
    overflow: 'hidden',
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