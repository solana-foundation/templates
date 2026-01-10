# Assets Directory

This directory should contain your app's visual assets.

## Required Assets

You'll need to add the following image files:

### App Icons

- **icon.png** (1024x1024) - Main app icon
- **adaptive-icon.png** (1024x1024) - Android adaptive icon
- **favicon.png** (48x48) - Web favicon

### Splash Screen

- **splash.png** (1284x2778) - App splash screen with Phantom branding

### Social

- **og-image.png** (1200x630) - Social media preview image

## Generating Icons

You can generate all required icons from a single source image using:

```bash
npx expo-optimize
```

Or use an online tool like:

- [App Icon Generator](https://www.appicon.co/)
- [Expo Icon Generator](https://icon.kitchen/)

## Phantom Branding

When creating assets:

- Use Phantom's brand color: `#ab9ff2`
- Download official logo from: [Phantom Press Kit](https://phantom.app/press)
- Follow brand guidelines for proper logo usage
- Ensure dark theme compatibility

## Notes

- All icons should be PNG format
- Use transparent backgrounds for app icons
- Splash screen should have `#1a1a1a` background to match app theme
- Test icons on both iOS and Android devices
