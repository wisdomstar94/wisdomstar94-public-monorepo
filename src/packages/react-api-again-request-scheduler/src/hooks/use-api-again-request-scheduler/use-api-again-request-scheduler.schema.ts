import { IUseIndexeddbManager } from "../../../../react-indexeddb-manager/src";

const getDefineSchemas = <DBNAME, STORENAME>(defineSchemas: IUseIndexeddbManager.DefineSchemas<DBNAME, STORENAME>) => defineSchemas;

export const defineSchemas = getDefineSchemas([
  {
    dbName: 'api_again_request' as const,
    version: 4,
    defineStores: [
      {
        storeName: 'api_again_request_list' as const,
        storekeyPath: 'key',
        isIfExistDeleteThenCreate: false,
        storeIndexItems: [
          { indexName: `key_unique`, keyPath: `key`, options: { unique: true } },
        ],
      },
      {
        storeName: 'api_again_request_list_hold' as const,
        storekeyPath: 'key',
        isIfExistDeleteThenCreate: false,
        storeIndexItems: [
          { indexName: `key_unique`, keyPath: `key`, options: { unique: true } },
        ],
      },
    ],
  },
]);

const _getDbVersion = <DBNAME, STORENAME>(defineSchemas: IUseIndexeddbManager.DefineSchemas<DBNAME, STORENAME>) => {
  return (dbName: DBNAME) => defineSchemas.find(x => x.dbName === dbName)?.version ?? 1;
};

export const getDbVersion = _getDbVersion(defineSchemas);