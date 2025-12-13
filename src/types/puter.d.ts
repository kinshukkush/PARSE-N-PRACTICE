// Type declarations for Puter.js global object
// Puter.js is loaded via script tag in index.html

interface PuterAI {
  chat(
    prompt: string,
    imageUrl?: string | { model?: string; temperature?: number; max_tokens?: number; stream?: boolean; tools?: any[] },
    options?: { model?: string; temperature?: number; max_tokens?: number; stream?: boolean; tools?: any[] }
  ): Promise<any>;
  
  txt2img(
    prompt: string,
    options?: { model?: string }
  ): Promise<HTMLImageElement>;
  
  txt2speech(
    text: string,
    options?: { provider?: string; model?: string }
  ): Promise<HTMLAudioElement>;
}

interface PuterAuth {
  isSignedIn(): Promise<boolean>;
  signIn(): Promise<void>;
  signOut(): Promise<void>;
}

interface Puter {
  ai: PuterAI;
  auth: PuterAuth;
  print(content: any): void;
}

declare global {
  const puter: Puter;
}

export {};
