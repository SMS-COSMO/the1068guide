const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * Reject browser requests whose Origin does not match this host.
 * SameSite=Lax already withholds the session cookie on cross-site POSTs;
 * this is a second check for state-changing API calls. Server-side fetches
 * omit Origin and are allowed.
 */
export default defineEventHandler((event) => {
  if (!UNSAFE_METHODS.has(event.method))
    return;

  const origin = getRequestHeader(event, 'origin');
  if (!origin)
    return;

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    throw createError({
      statusCode: 403,
      statusMessage: 'Invalid origin',
    });
  }

  const host = getRequestHost(event, { xForwardedHost: true });
  if (originHost !== host) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Cross-origin request rejected',
    });
  }
});
