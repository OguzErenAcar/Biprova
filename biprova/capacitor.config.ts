import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.biprova.app',
  appName: 'Biprova',
  webDir: 'out',
  server: {
    // Production'da Vercel URL'ini kullan:
    // url: 'https://biprova.vercel.app',
    // cleartext: false,

    // Dev için (aynı Wi-Fi'deyken):
    url: 'http://192.168.0.110:3000',
    cleartext: true,
  },
  plugins: {
    Geolocation: {
      // iOS: NSLocationWhenInUseUsageDescription
      // android/src/main/AndroidManifest.xml ile yönetilir
    },
  },
};

export default config;
