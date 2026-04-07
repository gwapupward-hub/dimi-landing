# Favicon & Link Sharing Configuration

This document describes the complete favicon and link-sharing setup for DIMI, including Open Graph tags, Twitter Cards, and dynamic metadata generation.

## Overview

DIMI now has a professional, branded link-sharing experience across all platforms:
- **Favicon**: Multi-format favicon with DIMI Green accent for all browsers and devices
- **Open Graph**: Dynamic metadata for Facebook, LinkedIn, and general link previews
- **Twitter Cards**: Optimized for Twitter/X with summary_large_image format
- **PWA Support**: Web manifest for installable app experience on mobile
- **Dynamic Metadata**: Per-page customization for rooms, profiles, and content pages

## Favicon Files

All favicon formats are hosted on CDN and referenced in `client/index.html`:

| Format | Size | Purpose | CDN URL |
|--------|------|---------|---------|
| favicon-32x32.png | 32×32 | Desktop browser tabs | https://d2xsxph8kpxj0f.cloudfront.net/.../favicon-32x32-*.png |
| favicon-16x16.png | 16×16 | Browser bookmarks | https://d2xsxph8kpxj0f.cloudfront.net/.../favicon-16x16-*.png |
| apple-touch-icon.png | 180×180 | iOS home screen | https://d2xsxph8kpxj0f.cloudfront.net/.../apple-touch-icon-180x180-*.png |
| android-chrome-192x192.png | 192×192 | Android home screen | https://d2xsxph8kpxj0f.cloudfront.net/.../android-chrome-192x192-*.png |
| android-chrome-512x512.png | 512×512 | Android splash screen | https://d2xsxph8kpxj0f.cloudfront.net/.../android-chrome-512x512-*.png |

### Favicon Implementation

The favicon links are in `client/index.html` `<head>`:

```html
<!-- Favicon -->
<link rel="icon" type="image/png" sizes="32x32" href="https://d2xsxph8kpxj0f.cloudfront.net/.../favicon-32x32-*.png">
<link rel="icon" type="image/png" sizes="16x16" href="https://d2xsxph8kpxj0f.cloudfront.net/.../favicon-16x16-*.png">
<link rel="apple-touch-icon" href="https://d2xsxph8kpxj0f.cloudfront.net/.../apple-touch-icon-180x180-*.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#080806">
```

## Web Manifest (PWA)

The `client/public/site.webmanifest` file enables:
- **App Installation**: Users can install DIMI as a standalone app on mobile
- **Splash Screen**: Custom launch screen with DIMI branding
- **Theme Colors**: Dark background (#080806) with DIMI Green accent (#2EE62E)
- **Icons**: Multiple sizes for different device types
- **Maskable Icons**: Safe zone for adaptive icons on Android

### Manifest Features

```json
{
  "name": "DIMI — Where Music Gets Made Live",
  "short_name": "DIMI",
  "display": "standalone",
  "background_color": "#080806",
  "theme_color": "#2EE62E",
  "icons": [
    { "src": "...", "sizes": "192x192", "purpose": "any" },
    { "src": "...", "sizes": "512x512", "purpose": "any" },
    { "src": "...", "sizes": "192x192", "purpose": "maskable" },
    { "src": "...", "sizes": "512x512", "purpose": "maskable" }
  ]
}
```

## Open Graph Tags

Open Graph meta tags enable rich previews on Facebook, LinkedIn, and other platforms:

| Tag | Value | Purpose |
|-----|-------|---------|
| og:title | DIMI — Where Music Gets Made Live | Preview headline |
| og:description | Watch songs being made before anyone else... | Preview description |
| og:type | website | Content type |
| og:url | https://dimimusic.xyz | Canonical URL |
| og:image | CDN URL (512×512) | Preview image |
| og:image:width | 512 | Image dimensions |
| og:image:height | 512 | Image dimensions |
| og:image:type | image/png | Image format |

## Twitter Card Tags

Twitter Card tags optimize link previews on Twitter/X:

| Tag | Value | Purpose |
|-----|-------|---------|
| twitter:card | summary_large_image | Card type (large image) |
| twitter:title | DIMI — Where Music Gets Made Live | Tweet preview headline |
| twitter:description | Discover producers. Watch sessions live... | Tweet preview description |
| twitter:image | CDN URL (512×512) | Tweet preview image |
| twitter:image:alt | DIMI - Where Music Gets Made Live | Image alt text for accessibility |

## Dynamic Metadata

The `client/src/lib/metadata.ts` utility enables per-page metadata customization:

### Usage

```typescript
import { updateMetadata } from '@/lib/metadata';

// In a React component's useEffect:
useEffect(() => {
  updateMetadata({
    title: 'Browse Rooms — DIMI',
    description: 'Discover and join live music production sessions...',
    url: 'https://dimimusic.xyz/rooms',
  });
}, []);
```

### Available Functions

1. **updateMetadata(config)** - Update all meta tags for a page
2. **generateRoomMetadata(room)** - Generate metadata for a room/session page
3. **generateProfileMetadata(profile)** - Generate metadata for a profile page
4. **resetMetadata()** - Reset to default metadata

### Example: Room Page Metadata

```typescript
generateRoomMetadata({
  title: 'Dark Side of Midnight',
  genre: 'Trap / Soul',
  producer: 'PapiGwap',
  description: 'Watch PapiGwap create a new track live on DIMI...',
  roomId: '123',
});
```

## Implementation Details

### Pages with Dynamic Metadata

- **Home** (`/`) - Resets to default metadata
- **Rooms** (`/rooms`) - Custom title and description for browse page
- **Session** (`/session`) - Can be extended to use room-specific metadata
- **Discover** (`/discover`) - Uses default metadata

### How It Works

1. When a page mounts, `useEffect` calls `updateMetadata()` or `resetMetadata()`
2. The utility updates all `<meta>` tags in the document `<head>`
3. The page title is also updated via `document.title`
4. Social platforms crawl the updated tags and generate rich previews

## Testing Link Previews

### Twitter/X Card Validator
1. Visit https://cards-dev.twitter.com/validator
2. Enter your DIMI URL (e.g., https://dimimusic.xyz)
3. Verify the preview shows:
   - DIMI logo image
   - Correct title and description
   - "summary_large_image" card type

### Facebook Sharing Debugger
1. Visit https://developers.facebook.com/tools/debug/
2. Enter your DIMI URL
3. Verify the preview shows:
   - DIMI logo image
   - Correct title and description
   - Proper Open Graph tags

### iMessage Preview
1. Paste the DIMI URL in an iMessage
2. The preview should show:
   - DIMI logo
   - Title and description
   - Clickable link

## Updating Favicon & Images

### To Update the Favicon

1. **Generate new favicon formats** from your brand image:
   - Use an online tool like [favicon-generator.org](https://www.favicon-generator.org/)
   - Or use the `manus-upload-file --webdev` command to upload new images

2. **Upload to CDN**:
   ```bash
   manus-upload-file --webdev new-favicon-32x32.png new-favicon-16x16.png ...
   ```

3. **Update HTML head** in `client/index.html`:
   - Replace the CDN URLs in the favicon `<link>` tags
   - Update the `href` attributes with new CDN URLs

4. **Update web manifest** in `client/public/site.webmanifest`:
   - Replace the icon URLs in the `icons` array
   - Update both `"any"` and `"maskable"` purpose icons

5. **Update metadata utility** in `client/src/lib/metadata.ts`:
   - Update `DEFAULT_IMAGE` constant with new CDN URL

### To Update Preview Images

1. **Create a new preview image** (512×512 PNG with DIMI branding)
2. **Upload to CDN**:
   ```bash
   manus-upload-file --webdev new-preview-image.png
   ```
3. **Update HTML head** in `client/index.html`:
   - Replace `og:image` and `twitter:image` CDN URLs
4. **Update metadata utility** in `client/src/lib/metadata.ts`:
   - Update `DEFAULT_IMAGE` constant

## Best Practices

### Image Optimization
- **Size**: 512×512 pixels for optimal social media display
- **Format**: PNG with transparency for flexible backgrounds
- **Branding**: Include DIMI logo and DIMI Green accent (#2EE62E)
- **Padding**: 20-30px padding around logo to avoid cropping in circular avatars

### Metadata Writing
- **Titles**: Keep under 60 characters for optimal display
- **Descriptions**: Keep under 160 characters for optimal display
- **URLs**: Always use absolute URLs (https://dimimusic.xyz/...)
- **Images**: Use high-contrast images that work at small sizes

### Testing
- Test on multiple platforms (Twitter, Facebook, LinkedIn, iMessage)
- Test on mobile and desktop
- Clear browser cache when testing updates
- Use the platform's official validators

## Troubleshooting

### Favicon Not Showing
- Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- Verify CDN URLs are correct and accessible
- Check browser console for 404 errors
- Try a hard refresh (Ctrl+F5 or Cmd+Shift+R)

### Link Preview Not Updating
- Use platform's cache clearing tool (Twitter Card Validator, Facebook Debugger)
- Wait 24 hours for social platforms to re-crawl
- Verify meta tags are present in HTML source
- Check that URLs are publicly accessible (not behind login)

### Image Not Displaying in Preview
- Verify image URL is publicly accessible
- Check image dimensions are at least 200×200 pixels
- Ensure image format is supported (PNG, JPG, GIF)
- Verify image URL doesn't require authentication

## Files Modified

- `client/index.html` - Added favicon links and meta tags
- `client/public/site.webmanifest` - Created PWA manifest
- `client/src/lib/metadata.ts` - Created dynamic metadata utility
- `client/src/pages/Home.tsx` - Added metadata reset on mount
- `client/src/pages/Rooms.tsx` - Added custom metadata for browse page

## Next Steps

1. **Verify a Resend domain** (for email deliverability)
2. **Add room-specific metadata** to Session page
3. **Create profile pages** with dynamic metadata
4. **Monitor social sharing** metrics and adjust metadata as needed
