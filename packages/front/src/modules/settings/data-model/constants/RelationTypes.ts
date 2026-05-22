import {
  type IconComponent,
  IllustrationIconOneToMany,
} from 'ui/display';
import { RelationType } from '~/generated-metadata/graphql';
import OneToManySvg from '@/settings/data-model/assets/OneToMany.svg';

export const RELATION_TYPES: Record<
  RelationType,
  {
    label: string;
    Icon: IconComponent;
    imageSrc: string;
    isImageFlipped?: boolean;
  }
> = {
  [RelationType.ONE_TO_MANY]: {
    label: 'Memiliki banyak',
    Icon: IllustrationIconOneToMany,
    imageSrc: OneToManySvg,
  },
  [RelationType.MANY_TO_ONE]: {
    label: 'Milik satu',
    Icon: IllustrationIconOneToMany,
    imageSrc: OneToManySvg,
    isImageFlipped: true,
  },
};
