'use client';
import { cn } from '@/lib/utils';
import { HTMLMotionProps, motion } from 'framer-motion';

export const GRADIENT_ANGLES = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
};

export type ProgressiveBlurProps = {
  direction?: keyof typeof GRADIENT_ANGLES;
  blurLayers?: number;
  className?: string;
  blurIntensity?: number;
} & HTMLMotionProps<'div'>;

export function ProgressiveBlur({
  direction = 'bottom',
  blurLayers = 6,
  className,
  blurIntensity = 0.25,
  ...props
}: ProgressiveBlurProps) {
  // Cap stacked backdrop-filter passes to 3 for silky-smooth 60fps mobile & desktop scrolling while keeping exact max blur
  const requestedLayers = Math.max(blurLayers, 2);
  const maxBlur = (requestedLayers - 1) * blurIntensity;
  const effectiveLayers = Math.min(requestedLayers - 1, 3);
  const segmentSize = 1 / (effectiveLayers + 2);
  const hasMotionProps = Object.keys(props).length > 0;

  return (
    <div
      className={cn('relative', className)}
      style={{ contain: 'layout paint style' }}
    >
      {Array.from({ length: effectiveLayers }).map((_, idx) => {
        const step = idx + 1;
        const angle = GRADIENT_ANGLES[direction];
        const gradientStops = [
          step * segmentSize,
          (step + 1) * segmentSize,
          (step + 2) * segmentSize,
          (step + 3) * segmentSize,
        ].map(
          (pos, posIndex) =>
            `rgba(20, 20, 20, ${posIndex === 1 || posIndex === 2 ? 1 : 0}) ${Math.min(pos, 1) * 100}%`
        );

        const gradient = `linear-gradient(${angle}deg, ${gradientStops.join(
          ', '
        )})`;
        const blurPx = (step / effectiveLayers) * maxBlur;

        const layerStyle = {
          maskImage: gradient,
          WebkitMaskImage: gradient,
          backdropFilter: `blur(${blurPx.toFixed(2)}px)`,
          WebkitBackdropFilter: `blur(${blurPx.toFixed(2)}px)`,
          transform: 'translateZ(0)',
        };

        if (hasMotionProps) {
          return (
            <motion.div
              key={step}
              className="pointer-events-none absolute inset-0 rounded-[inherit]"
              style={layerStyle}
              {...props}
            />
          );
        }

        return (
          <div
            key={step}
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={layerStyle}
          />
        );
      })}
    </div>
  );
}

export default ProgressiveBlur;
