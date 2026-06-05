import { Module } from '@nestjs/common';

import { TokenModule } from 'src/engine/core-modules/auth/token/token.module';
import { AddressGeocodeCreateManyPreQueryHook } from 'src/engine/core-modules/geo-map/query-hooks/address-geocode-create-many.pre-query-hook';
import { AddressGeocodeCreateOnePreQueryHook } from 'src/engine/core-modules/geo-map/query-hooks/address-geocode-create-one.pre-query-hook';
import { AddressGeocodeUpdateManyPreQueryHook } from 'src/engine/core-modules/geo-map/query-hooks/address-geocode-update-many.pre-query-hook';
import { AddressGeocodeUpdateOnePreQueryHook } from 'src/engine/core-modules/geo-map/query-hooks/address-geocode-update-one.pre-query-hook';
import { GeoMapResolver } from 'src/engine/core-modules/geo-map/resolver/geo-map.resolver';
import { AddressGeocodeOnSaveService } from 'src/engine/core-modules/geo-map/services/address-geocode-on-save.service';
import { GeoMapService } from 'src/engine/core-modules/geo-map/services/geo-map.service';
import { SecureHttpClientModule } from 'src/engine/core-modules/secure-http-client/secure-http-client.module';
import { WorkspaceManyOrAllFlatEntityMapsCacheModule } from 'src/engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module';
import { WorkspaceCacheStorageModule } from 'src/engine/workspace-cache-storage/workspace-cache-storage.module';

@Module({
  imports: [
    WorkspaceCacheStorageModule,
    TokenModule,
    SecureHttpClientModule,
    WorkspaceManyOrAllFlatEntityMapsCacheModule,
  ],
  providers: [
    GeoMapService,
    GeoMapResolver,
    AddressGeocodeOnSaveService,
    AddressGeocodeCreateOnePreQueryHook,
    AddressGeocodeCreateManyPreQueryHook,
    AddressGeocodeUpdateOnePreQueryHook,
    AddressGeocodeUpdateManyPreQueryHook,
  ],
  exports: [
    GeoMapService,
    AddressGeocodeOnSaveService,
    AddressGeocodeCreateOnePreQueryHook,
    AddressGeocodeCreateManyPreQueryHook,
    AddressGeocodeUpdateOnePreQueryHook,
    AddressGeocodeUpdateManyPreQueryHook,
  ],
})
export class GeoMapModule {}
