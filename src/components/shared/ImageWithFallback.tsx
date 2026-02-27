import { memo, useState } from 'react';
import { Film } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string | null;
  alt: string;
  className?: string;
}

const ImageWithFallback = memo(function ImageWithFallback({
  src,
  alt,
  className = '',
}: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-gray-800 text-gray-600 ${className}`}>
        <Film size={32} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
});

export default ImageWithFallback;
