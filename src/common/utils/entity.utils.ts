import { Entity, ID } from 'common/types/entity.types'

export default class EntityUtils {
  static groupById<TEntity extends Entity>(
    entities: TEntity[],
    validateUniqueness: boolean = true
  ): Record<ID, TEntity> {
    return entities.reduce((result, entity) => {
      if (result[entity.id] && validateUniqueness) {
        const entityName = entity.constructor ? entity.constructor.name : 'unknown'
        throw new Error(`Entity (${entityName}) with id (${entity.id}) already exists`)
      }

      result[entity.id] = entity
      return result
    }, {} as Record<ID, TEntity>)
  }
}
