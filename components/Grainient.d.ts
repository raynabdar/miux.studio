import type { CSSProperties, HTMLAttributes } from 'react';

export interface GrainientProps extends HTMLAttributes<HTMLDivElement> {
  colors?: string[];
  type?: 'linear' | 'radial';
  angle?: number;
  bands?: number;
  softness?: number;
  flow?: number;
  scale?: number;
  speed?: number;
  silk?: number;
  grainAmount?: number;
  grainSize?: number;
  grainAnimated?: boolean;
  contrast?: number;
  saturation?: number;
  variation?: number;
  interactive?: boolean;
  stir?: number;
  clickSwirl?: boolean;
  intro?: boolean;
  lightMode?: boolean;
  dpr?: number;
  className?: string;
  style?: CSSProperties;
}

declare function Grainient(props: GrainientProps): React.ReactNode;
export default Grainient;
