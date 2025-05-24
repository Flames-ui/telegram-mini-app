// Type declarations for utility modules
declare module '../../utils/truncateText' {
  const truncateText: (text: string, maxLength: number) => string;
  export default truncateText;
}

declare module '../../utils/dominantColor' {
  const getDominantColor: (imageUrl: string) => Promise<string>;
  export default getDominantColor;
}
