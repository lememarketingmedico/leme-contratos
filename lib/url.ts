export function getPublicBaseUrl(request?: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;

  if (configuredUrl && !configuredUrl.includes('0.0.0.0')) {
    return configuredUrl.replace(/\/$/, '');
  }

  const forwardedHost = request?.headers.get('x-forwarded-host');
  const host = forwardedHost || request?.headers.get('host') || 'localhost:3000';
  const forwardedProto = request?.headers.get('x-forwarded-proto');
  const protocol = forwardedProto || (host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https');

  return `${protocol}://${host}`.replace(/\/$/, '');
}

export function publicUrl(path: string, request?: Request) {
  return new URL(path, getPublicBaseUrl(request));
}
