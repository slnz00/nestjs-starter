import { NotFoundException } from '@nestjs/common'
import { Entity } from 'common/types/entity.types'

export default class EntityNotFoundException extends NotFoundException {
  constructor(entityClass: ConstructorOf<Entity> | null, attrValue: string, attrName: string = 'id') {
    const entityName = entityClass ? entityClass.name : 'Unknown'
    const message = `Entity (${entityName}) does not exist with ${attrName}: ${attrValue}`
    super(message)
  }
}
