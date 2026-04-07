/**
 * Metadata utility for dynamic Open Graph and Twitter Card generation
 * This allows each page to set custom metadata for social sharing
 */

export interface MetadataConfig {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  twitterHandle?: string;
}

const DEFAULT_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663267369814/NRkmTJ8GEcJfdTrHZf8aiP/android-chrome-512x512-7owhfFcmbTyeFPLypzRq5y.png';
const DEFAULT_TITLE = 'DIMI — Where Music Gets Made Live';
const DEFAULT_DESCRIPTION = 'Watch songs being made before anyone else hears them. Live studio sessions, real-time collaboration, and creator tipping — all in one platform.';
const DEFAULT_URL = 'https://dimimusic.xyz';
const TWITTER_HANDLE = '@_gwapspot';

/**
 * Update meta tags for Open Graph and Twitter Cards
 * Call this in useEffect on each page that needs custom metadata
 */
export function updateMetadata(config: MetadataConfig) {
  const title = config.title || DEFAULT_TITLE;
  const description = config.description || DEFAULT_DESCRIPTION;
  const image = config.image || DEFAULT_IMAGE;
  const imageAlt = config.imageAlt || 'DIMI - Where Music Gets Made Live';
  const url = config.url || DEFAULT_URL;
  const type = config.type || 'website';

  // Update page title
  document.title = title;

  // Update or create meta tags
  updateMetaTag('og:title', title, 'property');
  updateMetaTag('og:description', description, 'property');
  updateMetaTag('og:image', image, 'property');
  updateMetaTag('og:image:alt', imageAlt, 'property');
  updateMetaTag('og:url', url, 'property');
  updateMetaTag('og:type', type, 'property');

  updateMetaTag('twitter:title', title, 'name');
  updateMetaTag('twitter:description', description, 'name');
  updateMetaTag('twitter:image', image, 'name');
  updateMetaTag('twitter:image:alt', imageAlt, 'name');
  updateMetaTag('twitter:card', 'summary_large_image', 'name');

  if (config.twitterHandle) {
    updateMetaTag('twitter:creator', config.twitterHandle, 'name');
  }

  // Update description for general SEO
  updateMetaTag('description', description, 'name');
}

/**
 * Helper function to update or create a meta tag
 */
function updateMetaTag(
  nameOrProperty: string,
  content: string,
  type: 'name' | 'property'
) {
  const selector = type === 'property'
    ? `meta[property="${nameOrProperty}"]`
    : `meta[name="${nameOrProperty}"]`;

  let tag = document.querySelector(selector) as HTMLMetaElement;

  if (!tag) {
    tag = document.createElement('meta');
    if (type === 'property') {
      tag.setAttribute('property', nameOrProperty);
    } else {
      tag.setAttribute('name', nameOrProperty);
    }
    document.head.appendChild(tag);
  }

  tag.content = content;
}

/**
 * Generate metadata for a room/session page
 */
export function generateRoomMetadata(room: {
  title: string;
  genre?: string;
  producer?: string;
  description?: string;
  imageUrl?: string;
  roomId: string;
}) {
  const title = `${room.title}${room.genre ? ` • ${room.genre}` : ''} — DIMI`;
  const description = room.description || `Watch ${room.producer || 'this producer'} create music live on DIMI. Join the session, tip the creator, and discover new music.`;
  const url = `${DEFAULT_URL}/session?room=${room.roomId}`;
  const image = room.imageUrl || DEFAULT_IMAGE;

  return updateMetadata({
    title,
    description,
    image,
    imageAlt: room.title,
    url,
    type: 'website',
  });
}

/**
 * Generate metadata for a profile page
 */
export function generateProfileMetadata(profile: {
  name: string;
  bio?: string;
  genre?: string;
  avatarUrl?: string;
  handle: string;
}) {
  const title = `${profile.name}${profile.genre ? ` • ${profile.genre}` : ''} — DIMI`;
  const description = profile.bio || `Follow ${profile.name} on DIMI and watch their music creation process live.`;
  const url = `${DEFAULT_URL}/profile/${profile.handle}`;
  const image = profile.avatarUrl || DEFAULT_IMAGE;

  return updateMetadata({
    title,
    description,
    image,
    imageAlt: profile.name,
    url,
    type: 'profile',
    twitterHandle: TWITTER_HANDLE,
  });
}

/**
 * Reset metadata to defaults
 */
export function resetMetadata() {
  updateMetadata({});
}
