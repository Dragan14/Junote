const VARIANTS = {
  development: {
    name: "Junote Dev",
    bundleId: {
      ios: "com.vodno.junote.dev",
      android: "com.vodno.junote.dev",
    },
    environment: "development",
  },
  staging: {
    name: "Junote Staging",
    bundleId: {
      ios: "com.vodno.junote.staging",
      android: "com.vodno.junote.staging",
    },
    environment: "staging",
  },
  production: {
    name: "Junote",
    bundleId: {
      ios: "com.vodno.junote",
      android: "com.vodno.junote",
    },
    environment: "production",
  },
};

// Get the variant from environment variable or default to production
const getVariant = () => {
  const variantName = process.env.APP_VARIANT || "production";
  const selectedVariant = VARIANTS[variantName] || VARIANTS.production;

  console.log(`
    === BUILDING APP VARIANT ===
    Variant: ${variantName}
    App Name: ${selectedVariant.name}
    Bundle ID (iOS): ${selectedVariant.bundleId.ios}
    Bundle ID (Android): ${selectedVariant.bundleId.android}
    Environment: ${selectedVariant.environment}
    ========================
`);

  return selectedVariant;
};

const variant = getVariant();

module.exports = {
  expo: {
    name: variant.name,
    slug: variant.name,
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "junote",
    userInterfaceStyle: "automatic",
    owner: "dragan14",
    newArchEnabled: true,
    assetBundlePatterns: ["**/*"],
    ios: {
      bundleIdentifier: variant.bundleId.ios,
      supportsTablet: true,
      buildNumber: "1",
      config: {
        usesNonExemptEncryption: false,
      },
      infoPlist: {
        CFBundleDisplayName: variant.name,
      },
    },
    android: {
      package: variant.bundleId.android,
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/icon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/icon.png",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#232323",
          },
          imageWidth: 200,
          resizeMode: "contain",
        },
      ],
      "expo-font",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      environment: variant.environment,
    },
  },
};
