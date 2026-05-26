import { BaseWorkspaceEntity } from 'src/engine/sid-orm/base.workspace-entity';
import { type CustomWorkspaceEntity } from 'src/engine/sid-orm/custom.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type NoteWorkspaceEntity } from 'src/modules/note/standard-objects/note.workspace-entity';

export class NoteTargetWorkspaceEntity extends BaseWorkspaceEntity {
  note: EntityRelation<NoteWorkspaceEntity> | null;
  noteId: string | null;
  custom: EntityRelation<CustomWorkspaceEntity>;
}
