import { Injectable } from '@nestjs/common';
import { EnvConfig } from './model/env.config';

@Injectable()
export class ConfigService {
    private envConfig: EnvConfig;

    constructor(rawEnvString: string) {
        const envString = rawEnvString!=='undefined' ? rawEnvString : 'dev';
        this.envConfig = require(`./environment/${envString}.environment`).environment;
    }

    get values(): EnvConfig {
        return this.envConfig ? this.envConfig : null;
    }
}
