declare module "countapi-js" {
  interface Result {
    status: number;
    path: string;
    value: number;
  }

  interface CreateResult extends Result {
    namespace: string;
    key: string;
  }

  interface SetResult extends Result {
    old_value: number;
  }

  interface Stats {
    keys_created: number;
    keys_updated: number;
    requests: number;
    version: string;
  }

  interface KeyInfo {
    status: number;
    path: string;
    namespace: string;
    key: string;
    ttl: number;
    created: number;
    update_lowerbound: number;
    update_upperbound: number;
    enable_reset: boolean;
    value: number;
  }

  interface CreateOptions {
    /** Name of the key. */
    key?: string;

    /** Namespace to store the key. Defaults to `default`.*/
    namespace?: string;

    /** The initial value. Defaults to `0`. */
    value?: number;

    /** Allows the key to be resetted with `set`. Defaults to `false`. */
    enable_reset?: boolean;

    /** Restrict update to not subtract more than this number. This number must be negative or zero. Defaults to `-1`. */
    update_lowerbound?: number;

    /** Restrict update to not add more than this number. This number must be positive or zero. Defaults to `1`. */
    update_upperbound?: number;
  }

  /** A shorthand for update with amount=1. And useful if you don't want to create a key manually, since if you request a key that doesn't exists, a key with enable_reset=false, update_lowerbound=0 and update_upperbound=1 will be created automatically. */
  export function hit(key: string): Promise<Result>;

  /** A shorthand for update with amount=1. And useful if you don't want to create a key manually, since if you request a key that doesn't exists, a key with enable_reset=false, update_lowerbound=0 and update_upperbound=1 will be created automatically. */
  export function hit(namespace: string, key: string): Promise<Result>;

  /** Get the value of a key. */
  export function get(key: string): Promise<Result>;

  /** Get the value of a key. */
  export function get(namespace: string, key: string): Promise<Result>;

  /** Set the value of a key. */
  export function set(key: string, value: number): Promise<SetResult>;

  /** Set the value of a key. */
  export function set(
    namespace: string,
    key: string,
    value: number
  ): Promise<SetResult>;

  /** Updates a key with +/- amount. */
  export function update(key: string, amount: number): Promise<Result>;

  /** Updates a key with +/- amount. */
  export function update(
    namespace: string,
    key: string,
    amount: number
  ): Promise<Result>;

  /** Useful shorthand for hit using as namespace the current hostname. You may pass page to provide your own page identifier. If page is not provided it will be extracted from the current URL. */
  export function visits(page?: string): Promise<Result>;

  /** Useful shorthand for hit using as namespace the current hostname. You have to pass a event name. */
  export function event(name: string): Promise<Result>;

  /** Create a key. All parameters are optional. Note about expiration: Every time a key is updated its expiration is set to 6 months. So don't worry, if you still using it, it won't expire. */
  export function create(options?: CreateOptions): Promise<CreateResult>;

  /** Retrive information about a key. */
  export function info(key: string): Promise<KeyInfo>;

  /** Retrive information about a key. */
  export function info(namespace: string, key: string): Promise<KeyInfo>;

  /** Get some CountAPI stats. */
  export function stats(): Promise<Stats>;
}
