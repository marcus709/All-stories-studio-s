declare namespace JSX {
  interface IntrinsicElements {
    'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      url: string;
      className?: string;
      'loading-anim'?: boolean;
      'events-target'?: string;
    };
  }
}