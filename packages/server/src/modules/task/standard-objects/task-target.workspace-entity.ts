import { BaseWorkspaceEntity } from 'src/engine/sid-orm/base.workspace-entity';
import { type CustomWorkspaceEntity } from 'src/engine/sid-orm/custom.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type TaskWorkspaceEntity } from 'src/modules/task/standard-objects/task.workspace-entity';

export class TaskTargetWorkspaceEntity extends BaseWorkspaceEntity {
  task: EntityRelation<TaskWorkspaceEntity> | null;
  taskId: string | null;
  custom: EntityRelation<CustomWorkspaceEntity>;
}
