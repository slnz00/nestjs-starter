import { OnModuleInit } from '@nestjs/common'
import Singleton from 'common/providers/singleton.provider/singleton'

export default abstract class SingletonProvider extends Singleton implements OnModuleInit {
  onModuleInit(): void {
    this.useInitialization()
  }
}
