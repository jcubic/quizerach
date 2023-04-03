/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context } from "./context"
import type { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  StringFilterInput: { // input type
    contains?: string | null; // String
  }
  UserWhereInput: { // input type
    email: string; // String!
    filter?: NexusGenInputs['StringFilterInput'] | null; // StringFilterInput
    user_id: number; // Int!
  }
}

export interface NexusGenEnums {
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
}

export interface NexusGenObjects {
  Answer: { // root type
    answer?: string | null; // String
    answer_id: number; // Int!
    question_id: number; // Int!
    user_id: number; // Int!
  }
  Option: { // root type
    label: string; // String!
    option_id: number; // Int!
    question_id: number; // Int!
    valid: boolean; // Boolean!
  }
  Poll: { // root type
    name: string; // String!
    poll_id: number; // Int!
    set_id: number; // Int!
    slug: string; // String!
  }
  Query: {};
  Question: { // root type
    intro_text: string; // String!
    outro_text: string; // String!
    poll_id: number; // Int!
    question_id: number; // Int!
  }
  Set: { // root type
    name: string; // String!
    set_id: number; // Int!
  }
  User: { // root type
    email: string; // String!
    token?: string | null; // String
    token_expiration: NexusGenScalars['DateTime']; // DateTime!
    user_id: number; // Int!
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars

export interface NexusGenFieldTypes {
  Answer: { // field return type
    answer: string | null; // String
    answer_id: number; // Int!
    question: NexusGenRootTypes['Question']; // Question!
    question_id: number; // Int!
    user: NexusGenRootTypes['User']; // User!
    user_id: number; // Int!
  }
  Option: { // field return type
    answers: NexusGenRootTypes['Answer'][]; // [Answer!]!
    label: string; // String!
    option_id: number; // Int!
    question: NexusGenRootTypes['Question'] | null; // Question
    question_id: number; // Int!
    valid: boolean; // Boolean!
  }
  Poll: { // field return type
    name: string; // String!
    poll_id: number; // Int!
    questions: NexusGenRootTypes['Question'][]; // [Question!]!
    set_id: number; // Int!
    slug: string; // String!
  }
  Query: { // field return type
    questions: NexusGenRootTypes['Question'][]; // [Question!]!
    sets: NexusGenRootTypes['Set'][]; // [Set!]!
    users: NexusGenRootTypes['User'][]; // [User!]!
  }
  Question: { // field return type
    answers: NexusGenRootTypes['Answer'][]; // [Answer!]!
    intro_text: string; // String!
    options: NexusGenRootTypes['Option'][]; // [Option!]!
    outro_text: string; // String!
    poll: NexusGenRootTypes['Poll']; // Poll!
    poll_id: number; // Int!
    question_id: number; // Int!
  }
  Set: { // field return type
    name: string; // String!
    polls: NexusGenRootTypes['Poll'][]; // [Poll!]!
    set_id: number; // Int!
  }
  User: { // field return type
    answers: NexusGenRootTypes['Answer'][]; // [Answer!]!
    email: string; // String!
    token: string | null; // String
    token_expiration: NexusGenScalars['DateTime']; // DateTime!
    user_id: number; // Int!
  }
}

export interface NexusGenFieldTypeNames {
  Answer: { // field return type name
    answer: 'String'
    answer_id: 'Int'
    question: 'Question'
    question_id: 'Int'
    user: 'User'
    user_id: 'Int'
  }
  Option: { // field return type name
    answers: 'Answer'
    label: 'String'
    option_id: 'Int'
    question: 'Question'
    question_id: 'Int'
    valid: 'Boolean'
  }
  Poll: { // field return type name
    name: 'String'
    poll_id: 'Int'
    questions: 'Question'
    set_id: 'Int'
    slug: 'String'
  }
  Query: { // field return type name
    questions: 'Question'
    sets: 'Set'
    users: 'User'
  }
  Question: { // field return type name
    answers: 'Answer'
    intro_text: 'String'
    options: 'Option'
    outro_text: 'String'
    poll: 'Poll'
    poll_id: 'Int'
    question_id: 'Int'
  }
  Set: { // field return type name
    name: 'String'
    polls: 'Poll'
    set_id: 'Int'
  }
  User: { // field return type name
    answers: 'Answer'
    email: 'String'
    token: 'String'
    token_expiration: 'DateTime'
    user_id: 'Int'
  }
}

export interface NexusGenArgTypes {
  Query: {
    users: { // args
      where?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}