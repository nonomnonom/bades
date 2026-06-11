type getImageAbsoluteURIProps = {
  imageUrl: string;
  baseUrl: string;
};

export const getImageAbsoluteURI = ({
  imageUrl,
  baseUrl,
}: getImageAbsoluteURIProps): string => {
  if (imageUrl.startsWith('https:') || imageUrl.startsWith('http:')) {
    return imageUrl;
  }

  // Path absolut (diawali '/') adalah static asset (mis. /bd.svg, /favicon.svg)
  // yang disajikan langsung dari public/ — BUKAN file yang dikelola oleh
  // file storage system. Jangan prepend /files/ agar tidak menghasilkan
  // URL /files/bd.svg yang 404 di production.
  if (imageUrl.startsWith('/')) {
    return new URL(imageUrl, baseUrl).toString();
  }

  return new URL(`/files/${imageUrl}`, baseUrl).toString();
};
