/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
};

/**
 * ## Answer
 *
 */
export type Answer = {
  __typename?: 'Answer';
  answer?: Maybe<Scalars['String']>;
  answer_id: Scalars['Int'];
  question: Question;
  question_id: Scalars['Int'];
  user: User;
  user_id: Scalars['Int'];
};

/**
 * ## Option
 *
 */
export type Option = {
  __typename?: 'Option';
  answers: Array<Answer>;
  label: Scalars['String'];
  option_id: Scalars['Int'];
  question?: Maybe<Question>;
  question_id: Scalars['Int'];
  valid: Scalars['Boolean'];
};

/**
 * ## Poll
 *
 */
export type Poll = {
  __typename?: 'Poll';
  name: Scalars['String'];
  poll_id: Scalars['Int'];
  questions: Array<Question>;
  set_id: Scalars['Int'];
  slug: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  questions: Array<Question>;
  sets: Array<Set>;
  users: Array<User>;
};


export type QueryUsersArgs = {
  where?: InputMaybe<UserWhereInput>;
};

/**
 * ## Question
 *
 */
export type Question = {
  __typename?: 'Question';
  answers: Array<Answer>;
  intro_text: Scalars['String'];
  options: Array<Option>;
  outro_text: Scalars['String'];
  poll: Poll;
  poll_id: Scalars['Int'];
  question_id: Scalars['Int'];
};

/**
 * ## Set
 *
 */
export type Set = {
  __typename?: 'Set';
  name: Scalars['String'];
  polls: Array<Poll>;
  set_id: Scalars['Int'];
};

export type StringFilterInput = {
  contains?: InputMaybe<Scalars['String']>;
};

/**
 * ## User
 *
 * User is object that represent a user that start a quiz.
 * The most important thing about User is his email that is
 * unique identefier that is used to login and take part in
 * a quiz.
 *
 * The user model also have other data that is in database
 * like token and token_expiration time for user to login to the
 * take part in a quiz.
 *
 */
export type User = {
  __typename?: 'User';
  answers: Array<Answer>;
  email: Scalars['String'];
  token?: Maybe<Scalars['String']>;
  token_expiration: Scalars['DateTime'];
  user_id: Scalars['Int'];
};

export type UserWhereInput = {
  email?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<StringFilterInput>;
  user_id?: InputMaybe<Scalars['Int']>;
};

export type PollSetQueryVariables = Exact<{ [key: string]: never; }>;


export type PollSetQuery = { __typename?: 'Query', sets: Array<{ __typename?: 'Set', name: string, polls: Array<{ __typename?: 'Poll', name: string, questions: Array<{ __typename?: 'Question', question_id: number, intro_text: string, outro_text: string, options: Array<{ __typename?: 'Option', option_id: number, label: string, valid: boolean }> }> }> }> };


export const PollSetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PollSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"polls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"question_id"}},{"kind":"Field","name":{"kind":"Name","value":"intro_text"}},{"kind":"Field","name":{"kind":"Name","value":"outro_text"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"option_id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"valid"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<PollSetQuery, PollSetQueryVariables>;