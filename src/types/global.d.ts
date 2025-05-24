
declare module 'html2canvas' {
  interface Html2CanvasOptions {
    useCORS?: boolean;
    allowTaint?: boolean;
    logging?: boolean;
    ignoreElements?: (element: HTMLElement) => boolean;
    [key: string]: any;
  }
  
  function html2canvas(element: HTMLElement, options?: Html2CanvasOptions): Promise<HTMLCanvasElement>;
  export default html2canvas;
}

declare module 'fabric' {
  export * from 'fabric/fabric-impl';
}
