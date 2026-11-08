import { ConfigService } from '@nestjs/config';

export const configProvider = {
  provide: 'CONFIG',
  inject: [ConfigService],
  useFactory: (config: ConfigService): AppConfig => ({
    port: Number(config.get<string>('PORT', '3000')),
    database: {
      driver: config.get<string>('DATABASE_DRIVER', 'mongodb'),
      url: config.get<string>('DATABASE_URL', ''),
    },
  }),
};

export interface AppConfig {
  port: number;
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
}
