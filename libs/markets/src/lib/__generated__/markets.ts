import * as Types from '@vegaprotocol/types';

import { gql } from '@apollo/client';
import { PriceConfigurationFragmentDoc, FutureFragmentDoc, PerpetualFragmentDoc, SpotFragmentDoc } from '../components/market-info/__generated__/MarketInfo';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type MarketFieldsFragment = { __typename?: 'Market', id: string, decimalPlaces: number, positionDecimalPlaces: number, tickSize: string, parentMarketID?: string | null, successorMarketID?: string | null, markPriceConfiguration: { __typename?: 'CompositePriceConfiguration', decayWeight: string, decayPower: number, cashAmount: string, SourceWeights?: Array<string> | null, SourceStalenessTolerance: Array<string>, CompositePriceType: Types.CompositePriceType, dataSourcesSpec?: Array<{ __typename?: 'DataSourceDefinition', sourceType: { __typename?: 'DataSourceDefinitionExternal', sourceType: { __typename?: 'DataSourceSpecConfiguration', signers?: Array<{ __typename?: 'Signer', signer: { __typename?: 'ETHAddress', address?: string | null } | { __typename?: 'PubKey', key?: string | null } }> | null, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } | { __typename?: 'EthCallSpec', abi?: Array<string> | null, address: string, args?: Array<string> | null, method: string, requiredConfirmations: number, normalisers?: Array<{ __typename?: 'Normaliser', name: string, expression: string }> | null, trigger: { __typename?: 'EthCallTrigger', trigger: { __typename?: 'EthTimeTrigger', initial?: any | null, every?: number | null, until?: any | null } }, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } } | { __typename?: 'DataSourceDefinitionInternal', sourceType: { __typename?: 'DataSourceSpecConfigurationTime', conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } | { __typename: 'DataSourceSpecConfigurationTimeTrigger', triggers: Array<{ __typename?: 'InternalTimeTrigger', initial?: number | null, every?: number | null } | null>, conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } } } | null> | null, dataSourcesSpecBinding?: Array<{ __typename?: 'SpecBindingForCompositePrice', priceSourceProperty: string } | null> | null }, fees: { __typename?: 'Fees', factors: { __typename?: 'FeeFactors', makerFee: string, infrastructureFee: string, liquidityFee: string }, liquidityFeeSettings?: { __typename?: 'LiquidityFeeSettings', feeConstant?: string | null, method: Types.LiquidityFeeMethod } | null }, tradableInstrument: { __typename?: 'TradableInstrument', instrument: { __typename?: 'Instrument', id: string, name: string, code: string, metadata: { __typename?: 'InstrumentMetadata', tags?: Array<string> | null }, product: { __typename?: 'Future', quoteName: string, settlementAsset: { __typename?: 'Asset', id: string, symbol: string, name: string, decimals: number, quantum: string }, dataSourceSpecForSettlementData: { __typename?: 'DataSourceSpec', id: string, data: { __typename?: 'DataSourceDefinition', sourceType: { __typename?: 'DataSourceDefinitionExternal', sourceType: { __typename?: 'DataSourceSpecConfiguration', signers?: Array<{ __typename?: 'Signer', signer: { __typename?: 'ETHAddress', address?: string | null } | { __typename?: 'PubKey', key?: string | null } }> | null, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } | { __typename?: 'EthCallSpec', abi?: Array<string> | null, address: string, args?: Array<string> | null, method: string, requiredConfirmations: number, normalisers?: Array<{ __typename?: 'Normaliser', name: string, expression: string }> | null, trigger: { __typename?: 'EthCallTrigger', trigger: { __typename?: 'EthTimeTrigger', initial?: any | null, every?: number | null, until?: any | null } }, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } } | { __typename?: 'DataSourceDefinitionInternal', sourceType: { __typename?: 'DataSourceSpecConfigurationTime', conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } | { __typename: 'DataSourceSpecConfigurationTimeTrigger', triggers: Array<{ __typename?: 'InternalTimeTrigger', initial?: number | null, every?: number | null } | null>, conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } } } }, dataSourceSpecForTradingTermination: { __typename?: 'DataSourceSpec', id: string, data: { __typename?: 'DataSourceDefinition', sourceType: { __typename?: 'DataSourceDefinitionExternal', sourceType: { __typename?: 'DataSourceSpecConfiguration', signers?: Array<{ __typename?: 'Signer', signer: { __typename?: 'ETHAddress', address?: string | null } | { __typename?: 'PubKey', key?: string | null } }> | null, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } | { __typename?: 'EthCallSpec', abi?: Array<string> | null, address: string, args?: Array<string> | null, method: string, requiredConfirmations: number, normalisers?: Array<{ __typename?: 'Normaliser', name: string, expression: string }> | null, trigger: { __typename?: 'EthCallTrigger', trigger: { __typename?: 'EthTimeTrigger', initial?: any | null, every?: number | null, until?: any | null } }, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } } | { __typename?: 'DataSourceDefinitionInternal', sourceType: { __typename?: 'DataSourceSpecConfigurationTime', conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } | { __typename: 'DataSourceSpecConfigurationTimeTrigger', triggers: Array<{ __typename?: 'InternalTimeTrigger', initial?: number | null, every?: number | null } | null>, conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } } } }, dataSourceSpecBinding: { __typename?: 'DataSourceSpecToFutureBinding', settlementDataProperty: string, tradingTerminationProperty: string } } | { __typename?: 'Perpetual', quoteName: string, fundingRateScalingFactor?: string | null, fundingRateLowerBound?: string | null, fundingRateUpperBound?: string | null, settlementAsset: { __typename?: 'Asset', id: string, symbol: string, name: string, decimals: number, quantum: string }, dataSourceSpecForSettlementData: { __typename?: 'DataSourceSpec', id: string, data: { __typename?: 'DataSourceDefinition', sourceType: { __typename?: 'DataSourceDefinitionExternal', sourceType: { __typename?: 'DataSourceSpecConfiguration', signers?: Array<{ __typename?: 'Signer', signer: { __typename?: 'ETHAddress', address?: string | null } | { __typename?: 'PubKey', key?: string | null } }> | null, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } | { __typename?: 'EthCallSpec', abi?: Array<string> | null, address: string, args?: Array<string> | null, method: string, requiredConfirmations: number, normalisers?: Array<{ __typename?: 'Normaliser', name: string, expression: string }> | null, trigger: { __typename?: 'EthCallTrigger', trigger: { __typename?: 'EthTimeTrigger', initial?: any | null, every?: number | null, until?: any | null } }, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } } | { __typename?: 'DataSourceDefinitionInternal', sourceType: { __typename?: 'DataSourceSpecConfigurationTime', conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } | { __typename: 'DataSourceSpecConfigurationTimeTrigger', triggers: Array<{ __typename?: 'InternalTimeTrigger', initial?: number | null, every?: number | null } | null>, conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } } } }, dataSourceSpecForSettlementSchedule: { __typename?: 'DataSourceSpec', id: string, data: { __typename?: 'DataSourceDefinition', sourceType: { __typename?: 'DataSourceDefinitionExternal', sourceType: { __typename?: 'DataSourceSpecConfiguration', signers?: Array<{ __typename?: 'Signer', signer: { __typename?: 'ETHAddress', address?: string | null } | { __typename?: 'PubKey', key?: string | null } }> | null, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } | { __typename?: 'EthCallSpec', abi?: Array<string> | null, address: string, args?: Array<string> | null, method: string, requiredConfirmations: number, normalisers?: Array<{ __typename?: 'Normaliser', name: string, expression: string }> | null, trigger: { __typename?: 'EthCallTrigger', trigger: { __typename?: 'EthTimeTrigger', initial?: any | null, every?: number | null, until?: any | null } }, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } } | { __typename?: 'DataSourceDefinitionInternal', sourceType: { __typename?: 'DataSourceSpecConfigurationTime', conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } | { __typename: 'DataSourceSpecConfigurationTimeTrigger', triggers: Array<{ __typename?: 'InternalTimeTrigger', initial?: number | null, every?: number | null } | null>, conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } } } }, dataSourceSpecBinding: { __typename?: 'DataSourceSpecPerpetualBinding', settlementDataProperty: string, settlementScheduleProperty: string }, internalCompositePriceConfig?: { __typename?: 'CompositePriceConfiguration', decayWeight: string, decayPower: number, cashAmount: string, SourceWeights?: Array<string> | null, SourceStalenessTolerance: Array<string>, CompositePriceType: Types.CompositePriceType, dataSourcesSpec?: Array<{ __typename?: 'DataSourceDefinition', sourceType: { __typename?: 'DataSourceDefinitionExternal', sourceType: { __typename?: 'DataSourceSpecConfiguration', signers?: Array<{ __typename?: 'Signer', signer: { __typename?: 'ETHAddress', address?: string | null } | { __typename?: 'PubKey', key?: string | null } }> | null, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } | { __typename?: 'EthCallSpec', abi?: Array<string> | null, address: string, args?: Array<string> | null, method: string, requiredConfirmations: number, normalisers?: Array<{ __typename?: 'Normaliser', name: string, expression: string }> | null, trigger: { __typename?: 'EthCallTrigger', trigger: { __typename?: 'EthTimeTrigger', initial?: any | null, every?: number | null, until?: any | null } }, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } } | { __typename?: 'DataSourceDefinitionInternal', sourceType: { __typename?: 'DataSourceSpecConfigurationTime', conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } | { __typename: 'DataSourceSpecConfigurationTimeTrigger', triggers: Array<{ __typename?: 'InternalTimeTrigger', initial?: number | null, every?: number | null } | null>, conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } } } | null> | null, dataSourcesSpecBinding?: Array<{ __typename?: 'SpecBindingForCompositePrice', priceSourceProperty: string } | null> | null } | null } | { __typename?: 'Spot', baseAsset: { __typename?: 'Asset', id: string, name: string, symbol: string, decimals: number, quantum: string, status: Types.AssetStatus, source: { __typename: 'BuiltinAsset' } | { __typename: 'ERC20', contractAddress: string, lifetimeLimit: string, withdrawThreshold: string } }, quoteAsset: { __typename?: 'Asset', id: string, name: string, symbol: string, decimals: number, quantum: string, status: Types.AssetStatus, source: { __typename: 'BuiltinAsset' } | { __typename: 'ERC20', contractAddress: string, lifetimeLimit: string, withdrawThreshold: string } } } } }, marketTimestamps: { __typename?: 'MarketTimestamps', proposed?: any | null, pending: any, open: any, close: any }, marketProposal?: { __typename?: 'BatchProposal', id?: string | null } | { __typename?: 'Proposal', id?: string | null } | null };

export type MarketsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MarketsQuery = { __typename?: 'Query', marketsConnection?: { __typename?: 'MarketConnection', edges: Array<{ __typename?: 'MarketEdge', node: { __typename?: 'Market', id: string, decimalPlaces: number, positionDecimalPlaces: number, tickSize: string, parentMarketID?: string | null, successorMarketID?: string | null, markPriceConfiguration: { __typename?: 'CompositePriceConfiguration', decayWeight: string, decayPower: number, cashAmount: string, SourceWeights?: Array<string> | null, SourceStalenessTolerance: Array<string>, CompositePriceType: Types.CompositePriceType, dataSourcesSpec?: Array<{ __typename?: 'DataSourceDefinition', sourceType: { __typename?: 'DataSourceDefinitionExternal', sourceType: { __typename?: 'DataSourceSpecConfiguration', signers?: Array<{ __typename?: 'Signer', signer: { __typename?: 'ETHAddress', address?: string | null } | { __typename?: 'PubKey', key?: string | null } }> | null, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } | { __typename?: 'EthCallSpec', abi?: Array<string> | null, address: string, args?: Array<string> | null, method: string, requiredConfirmations: number, normalisers?: Array<{ __typename?: 'Normaliser', name: string, expression: string }> | null, trigger: { __typename?: 'EthCallTrigger', trigger: { __typename?: 'EthTimeTrigger', initial?: any | null, every?: number | null, until?: any | null } }, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } } | { __typename?: 'DataSourceDefinitionInternal', sourceType: { __typename?: 'DataSourceSpecConfigurationTime', conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } | { __typename: 'DataSourceSpecConfigurationTimeTrigger', triggers: Array<{ __typename?: 'InternalTimeTrigger', initial?: number | null, every?: number | null } | null>, conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } } } | null> | null, dataSourcesSpecBinding?: Array<{ __typename?: 'SpecBindingForCompositePrice', priceSourceProperty: string } | null> | null }, fees: { __typename?: 'Fees', factors: { __typename?: 'FeeFactors', makerFee: string, infrastructureFee: string, liquidityFee: string }, liquidityFeeSettings?: { __typename?: 'LiquidityFeeSettings', feeConstant?: string | null, method: Types.LiquidityFeeMethod } | null }, tradableInstrument: { __typename?: 'TradableInstrument', instrument: { __typename?: 'Instrument', id: string, name: string, code: string, metadata: { __typename?: 'InstrumentMetadata', tags?: Array<string> | null }, product: { __typename?: 'Future', quoteName: string, settlementAsset: { __typename?: 'Asset', id: string, symbol: string, name: string, decimals: number, quantum: string }, dataSourceSpecForSettlementData: { __typename?: 'DataSourceSpec', id: string, data: { __typename?: 'DataSourceDefinition', sourceType: { __typename?: 'DataSourceDefinitionExternal', sourceType: { __typename?: 'DataSourceSpecConfiguration', signers?: Array<{ __typename?: 'Signer', signer: { __typename?: 'ETHAddress', address?: string | null } | { __typename?: 'PubKey', key?: string | null } }> | null, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } | { __typename?: 'EthCallSpec', abi?: Array<string> | null, address: string, args?: Array<string> | null, method: string, requiredConfirmations: number, normalisers?: Array<{ __typename?: 'Normaliser', name: string, expression: string }> | null, trigger: { __typename?: 'EthCallTrigger', trigger: { __typename?: 'EthTimeTrigger', initial?: any | null, every?: number | null, until?: any | null } }, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } } | { __typename?: 'DataSourceDefinitionInternal', sourceType: { __typename?: 'DataSourceSpecConfigurationTime', conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } | { __typename: 'DataSourceSpecConfigurationTimeTrigger', triggers: Array<{ __typename?: 'InternalTimeTrigger', initial?: number | null, every?: number | null } | null>, conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } } } }, dataSourceSpecForTradingTermination: { __typename?: 'DataSourceSpec', id: string, data: { __typename?: 'DataSourceDefinition', sourceType: { __typename?: 'DataSourceDefinitionExternal', sourceType: { __typename?: 'DataSourceSpecConfiguration', signers?: Array<{ __typename?: 'Signer', signer: { __typename?: 'ETHAddress', address?: string | null } | { __typename?: 'PubKey', key?: string | null } }> | null, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } | { __typename?: 'EthCallSpec', abi?: Array<string> | null, address: string, args?: Array<string> | null, method: string, requiredConfirmations: number, normalisers?: Array<{ __typename?: 'Normaliser', name: string, expression: string }> | null, trigger: { __typename?: 'EthCallTrigger', trigger: { __typename?: 'EthTimeTrigger', initial?: any | null, every?: number | null, until?: any | null } }, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } } | { __typename?: 'DataSourceDefinitionInternal', sourceType: { __typename?: 'DataSourceSpecConfigurationTime', conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } | { __typename: 'DataSourceSpecConfigurationTimeTrigger', triggers: Array<{ __typename?: 'InternalTimeTrigger', initial?: number | null, every?: number | null } | null>, conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } } } }, dataSourceSpecBinding: { __typename?: 'DataSourceSpecToFutureBinding', settlementDataProperty: string, tradingTerminationProperty: string } } | { __typename?: 'Perpetual', quoteName: string, fundingRateScalingFactor?: string | null, fundingRateLowerBound?: string | null, fundingRateUpperBound?: string | null, settlementAsset: { __typename?: 'Asset', id: string, symbol: string, name: string, decimals: number, quantum: string }, dataSourceSpecForSettlementData: { __typename?: 'DataSourceSpec', id: string, data: { __typename?: 'DataSourceDefinition', sourceType: { __typename?: 'DataSourceDefinitionExternal', sourceType: { __typename?: 'DataSourceSpecConfiguration', signers?: Array<{ __typename?: 'Signer', signer: { __typename?: 'ETHAddress', address?: string | null } | { __typename?: 'PubKey', key?: string | null } }> | null, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } | { __typename?: 'EthCallSpec', abi?: Array<string> | null, address: string, args?: Array<string> | null, method: string, requiredConfirmations: number, normalisers?: Array<{ __typename?: 'Normaliser', name: string, expression: string }> | null, trigger: { __typename?: 'EthCallTrigger', trigger: { __typename?: 'EthTimeTrigger', initial?: any | null, every?: number | null, until?: any | null } }, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } } | { __typename?: 'DataSourceDefinitionInternal', sourceType: { __typename?: 'DataSourceSpecConfigurationTime', conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } | { __typename: 'DataSourceSpecConfigurationTimeTrigger', triggers: Array<{ __typename?: 'InternalTimeTrigger', initial?: number | null, every?: number | null } | null>, conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } } } }, dataSourceSpecForSettlementSchedule: { __typename?: 'DataSourceSpec', id: string, data: { __typename?: 'DataSourceDefinition', sourceType: { __typename?: 'DataSourceDefinitionExternal', sourceType: { __typename?: 'DataSourceSpecConfiguration', signers?: Array<{ __typename?: 'Signer', signer: { __typename?: 'ETHAddress', address?: string | null } | { __typename?: 'PubKey', key?: string | null } }> | null, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } | { __typename?: 'EthCallSpec', abi?: Array<string> | null, address: string, args?: Array<string> | null, method: string, requiredConfirmations: number, normalisers?: Array<{ __typename?: 'Normaliser', name: string, expression: string }> | null, trigger: { __typename?: 'EthCallTrigger', trigger: { __typename?: 'EthTimeTrigger', initial?: any | null, every?: number | null, until?: any | null } }, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } } | { __typename?: 'DataSourceDefinitionInternal', sourceType: { __typename?: 'DataSourceSpecConfigurationTime', conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } | { __typename: 'DataSourceSpecConfigurationTimeTrigger', triggers: Array<{ __typename?: 'InternalTimeTrigger', initial?: number | null, every?: number | null } | null>, conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } } } }, dataSourceSpecBinding: { __typename?: 'DataSourceSpecPerpetualBinding', settlementDataProperty: string, settlementScheduleProperty: string }, internalCompositePriceConfig?: { __typename?: 'CompositePriceConfiguration', decayWeight: string, decayPower: number, cashAmount: string, SourceWeights?: Array<string> | null, SourceStalenessTolerance: Array<string>, CompositePriceType: Types.CompositePriceType, dataSourcesSpec?: Array<{ __typename?: 'DataSourceDefinition', sourceType: { __typename?: 'DataSourceDefinitionExternal', sourceType: { __typename?: 'DataSourceSpecConfiguration', signers?: Array<{ __typename?: 'Signer', signer: { __typename?: 'ETHAddress', address?: string | null } | { __typename?: 'PubKey', key?: string | null } }> | null, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } | { __typename?: 'EthCallSpec', abi?: Array<string> | null, address: string, args?: Array<string> | null, method: string, requiredConfirmations: number, normalisers?: Array<{ __typename?: 'Normaliser', name: string, expression: string }> | null, trigger: { __typename?: 'EthCallTrigger', trigger: { __typename?: 'EthTimeTrigger', initial?: any | null, every?: number | null, until?: any | null } }, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } } | { __typename?: 'DataSourceDefinitionInternal', sourceType: { __typename?: 'DataSourceSpecConfigurationTime', conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } | { __typename: 'DataSourceSpecConfigurationTimeTrigger', triggers: Array<{ __typename?: 'InternalTimeTrigger', initial?: number | null, every?: number | null } | null>, conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } } } | null> | null, dataSourcesSpecBinding?: Array<{ __typename?: 'SpecBindingForCompositePrice', priceSourceProperty: string } | null> | null } | null } | { __typename?: 'Spot', baseAsset: { __typename?: 'Asset', id: string, name: string, symbol: string, decimals: number, quantum: string, status: Types.AssetStatus, source: { __typename: 'BuiltinAsset' } | { __typename: 'ERC20', contractAddress: string, lifetimeLimit: string, withdrawThreshold: string } }, quoteAsset: { __typename?: 'Asset', id: string, name: string, symbol: string, decimals: number, quantum: string, status: Types.AssetStatus, source: { __typename: 'BuiltinAsset' } | { __typename: 'ERC20', contractAddress: string, lifetimeLimit: string, withdrawThreshold: string } } } } }, marketTimestamps: { __typename?: 'MarketTimestamps', proposed?: any | null, pending: any, open: any, close: any }, marketProposal?: { __typename?: 'BatchProposal', id?: string | null } | { __typename?: 'Proposal', id?: string | null } | null } }> } | null };

export const MarketFieldsFragmentDoc = gql`
    fragment MarketFields on Market {
  id
  decimalPlaces
  positionDecimalPlaces
  tickSize
  parentMarketID
  successorMarketID
  markPriceConfiguration {
    ...PriceConfiguration
  }
  fees {
    factors {
      makerFee
      infrastructureFee
      liquidityFee
    }
    liquidityFeeSettings {
      feeConstant
      method
    }
  }
  tradableInstrument {
    instrument {
      id
      name
      code
      metadata {
        tags
      }
      product {
        ... on Future {
          ...Future
        }
        ... on Perpetual {
          ...Perpetual
        }
        ... on Spot {
          ...Spot
        }
      }
    }
  }
  marketTimestamps {
    proposed
    pending
    open
    close
  }
  marketProposal {
    ... on Proposal {
      id
    }
    ... on BatchProposal {
      id
    }
  }
}
    ${PriceConfigurationFragmentDoc}
${FutureFragmentDoc}
${PerpetualFragmentDoc}
${SpotFragmentDoc}`;
export const MarketsDocument = gql`
    query Markets {
  marketsConnection {
    edges {
      node {
        ...MarketFields
      }
    }
  }
}
    ${MarketFieldsFragmentDoc}`;

/**
 * __useMarketsQuery__
 *
 * To run a query within a React component, call `useMarketsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMarketsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMarketsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMarketsQuery(baseOptions?: Apollo.QueryHookOptions<MarketsQuery, MarketsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MarketsQuery, MarketsQueryVariables>(MarketsDocument, options);
      }
export function useMarketsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MarketsQuery, MarketsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MarketsQuery, MarketsQueryVariables>(MarketsDocument, options);
        }
export type MarketsQueryHookResult = ReturnType<typeof useMarketsQuery>;
export type MarketsLazyQueryHookResult = ReturnType<typeof useMarketsLazyQuery>;
export type MarketsQueryResult = Apollo.QueryResult<MarketsQuery, MarketsQueryVariables>;