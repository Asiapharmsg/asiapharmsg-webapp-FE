import { useEffect, useState } from 'react';

// Shown whenever a product has no image, or the stored image URL does not load
// (e.g. the 154 catalogue rows whose files were never copied from the old
// vendor bucket). Keeps the storefront from rendering a broken-image icon.
export const PRODUCT_IMAGE_FALLBACK =
  (process.env.PUBLIC_URL || '') + '/assets/images/product/no-image.svg';

const ProductImage = ({ src, alt = '', className = 'img-fluid', ...rest }) => {
  const [failed, setFailed] = useState(false);

  // A new src deserves a fresh attempt (gallery slides, filtered grids).
  useEffect(() => {
    setFailed(false);
  }, [src]);

  const resolved = !failed && src ? src : PRODUCT_IMAGE_FALLBACK;

  return (
    <img
      {...rest}
      src={resolved}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
};

export default ProductImage;
