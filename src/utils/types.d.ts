// Type declarations for utility modules
declare module '../../utils/truncateText' {
  export const truncateText: (text: string, maxLength: number) => string;
}

declare module '../../utils/dominantColor' {
  export const getDominantColor: (imageUrl: string) => Promise<string>;
