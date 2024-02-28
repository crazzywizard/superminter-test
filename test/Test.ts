import assert = require("assert")
import { MockDb, SuperMinter } from "../generated/src/TestHelpers.gen";
import {
  EventsSummaryEntity,
  SuperMinter_MintedEntity,
} from "../generated/src/Types.gen";

import { Addresses } from "../generated/src/bindings/Ethers.bs";

import { GLOBAL_EVENTS_SUMMARY_KEY } from "../src/EventHandlers";


const MOCK_EVENTS_SUMMARY_ENTITY: EventsSummaryEntity = {
  id: GLOBAL_EVENTS_SUMMARY_KEY,
  superMinter_MintedCount: BigInt(0),
};

describe("SuperMinter contract Minted event tests", () => {
  // Create mock db
  const mockDbInitial = MockDb.createMockDb();

  // Add mock EventsSummaryEntity to mock db
  const mockDbFinal = mockDbInitial.entities.EventsSummary.set(
    MOCK_EVENTS_SUMMARY_ENTITY
  );

  // Creating mock SuperMinter contract Minted event
  const mockSuperMinterMintedEvent = SuperMinter.Minted.createMockEvent({
    edition: Addresses.defaultAddress,
    tier: 0n,
    scheduleNum: 0n,
    to: Addresses.defaultAddress,
    data: [0n, 0n, Addresses.defaultAddress, 0n, 0n, 0n, Addresses.defaultAddress, false, 0n, 0n, 0n, 0n, 0n],
    attributionId: 0n,
    mockEventData: {
      chainId: 1,
      blockNumber: 0,
      blockTimestamp: 0,
      blockHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      srcAddress: Addresses.defaultAddress,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      transactionIndex: 0,
      logIndex: 0,
    },
  });

  // Processing the event
  const mockDbUpdated = SuperMinter.Minted.processEvent({
    event: mockSuperMinterMintedEvent,
    mockDb: mockDbFinal,
  });

  it("SuperMinter_MintedEntity is created correctly", () => {
    // Getting the actual entity from the mock database
    let actualSuperMinterMintedEntity = mockDbUpdated.entities.SuperMinter_Minted.get(
      mockSuperMinterMintedEvent.transactionHash +
        mockSuperMinterMintedEvent.logIndex.toString()
    );

    // Creating the expected entity
    const expectedSuperMinterMintedEntity: SuperMinter_MintedEntity = {
      id:
        mockSuperMinterMintedEvent.transactionHash +
        mockSuperMinterMintedEvent.logIndex.toString(),
      edition: mockSuperMinterMintedEvent.params.edition,
      tier: mockSuperMinterMintedEvent.params.tier,
      scheduleNum: mockSuperMinterMintedEvent.params.scheduleNum,
      to: mockSuperMinterMintedEvent.params.to,
      data: mockSuperMinterMintedEvent.params.data,
      attributionId: mockSuperMinterMintedEvent.params.attributionId,
      eventsSummary: "GlobalEventsSummary",
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualSuperMinterMintedEntity, expectedSuperMinterMintedEntity, "Actual SuperMinterMintedEntity should be the same as the expectedSuperMinterMintedEntity");
  });

  it("EventsSummaryEntity is updated correctly", () => {
    // Getting the actual entity from the mock database
    let actualEventsSummaryEntity = mockDbUpdated.entities.EventsSummary.get(
      GLOBAL_EVENTS_SUMMARY_KEY
    );

    // Creating the expected entity
    const expectedEventsSummaryEntity: EventsSummaryEntity = {
      ...MOCK_EVENTS_SUMMARY_ENTITY,
      superMinter_MintedCount: MOCK_EVENTS_SUMMARY_ENTITY.superMinter_MintedCount + BigInt(1),
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualEventsSummaryEntity, expectedEventsSummaryEntity, "Actual SuperMinterMintedEntity should be the same as the expectedSuperMinterMintedEntity");
  });
});
