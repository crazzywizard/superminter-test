/*
 *Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features*
 */
import {
  SuperMinterContract_Minted_loader,
  SuperMinterContract_Minted_handler
} from '../generated/src/Handlers.gen';

import { SuperMinter_MintedEntity, EventsSummaryEntity } from '../generated/src/Types.gen';

export const GLOBAL_EVENTS_SUMMARY_KEY = 'GlobalEventsSummary';

const INITIAL_EVENTS_SUMMARY: EventsSummaryEntity = {
  id: GLOBAL_EVENTS_SUMMARY_KEY,
  superMinter_MintedCount: BigInt(0)
};

SuperMinterContract_Minted_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

SuperMinterContract_Minted_handler(({ event, context }) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity = summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    superMinter_MintedCount: currentSummaryEntity.superMinter_MintedCount + BigInt(1)
  };

  const superMinter_MintedEntity: SuperMinter_MintedEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    edition: event.params.edition,
    tier: event.params.tier,
    scheduleNum: event.params.scheduleNum,
    transactionHash: event.transactionHash,
    blockNumber: event.blockNumber as any as bigint,
    timestamp: event.blockTimestamp as any as bigint,
    to: event.params.to,
    data_0: event.params.data[0],
    data_1: event.params.data[1],
    data_2: event.params.data[2],
    data_3: event.params.data[3],
    data_4: event.params.data[4],
    data_5: event.params.data[5],
    data_6: event.params.data[6],
    data_7: event.params.data[7],
    data_8: event.params.data[8],
    data_9: event.params.data[9],
    data_10: event.params.data[10],
    data_11: event.params.data[11],
    data_12: event.params.data[12],
    attributionId: event.params.attributionId,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.SuperMinter_Minted.set(superMinter_MintedEntity);
});
