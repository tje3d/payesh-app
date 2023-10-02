// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }

  interface ZodFieldError {
    [key: string]: string[] | undefined
  }

  interface Document {
    startViewTransition?: (callback: () => Promise<unknown>) => {
      ready: Promise<any>
      updateCallbackDone: Promise<any>
    }
  }
}

export {}
