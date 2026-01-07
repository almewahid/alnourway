import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alnoorway.tareeqalnoor',
  appName: 'طريق النور',
  webDir: 'dist',
  server: {
    url: 'https://www.alnoorway.com',
    cleartext: true
  }
};

export default config;