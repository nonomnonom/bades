import { useQuery } from '@apollo/client/react';
import { ListPlansDocument } from '~/generated-metadata/graphql';
import { isDefined } from 'shared/utils';

export const usePlans = () => {
  const { data, loading, error } = useQuery(ListPlansDocument);

  const isPlansLoaded = isDefined(data?.listPlans);

  const listPlans = () => {
    if (!data) throw new Error('plans tidak terdefinisi');
    return data.listPlans;
  };

  return { loading, error, isPlansLoaded, listPlans };
};
