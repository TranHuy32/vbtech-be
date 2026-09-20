import { Global, Module } from '@nestjs/common';
import { WS_EMITTER } from '../constants';
import { wsEmitterProvider } from './ws-emiter';

/**
 * Only register once/ process
 */
@Global()
@Module({
  controllers: [],
  providers: [wsEmitterProvider],
  exports: [WS_EMITTER],
})
export class WsEmitterModule {}
