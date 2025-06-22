declare module '@paystack/inline-js' {
  export default class PaystackPop {
    constructor();
    /**
     * Resumes a transaction using the access code
     */
    resumeTransaction(accessCode: string): void;
    
    /**
     * Setup and open payment popup
     */
    newTransaction(options: {
      key?: string;
      email: string;
      amount: number;
      ref?: string;
      currency?: string;
      plan?: string;
      quantity?: number;
      metadata?: Record<string, any>;
      onSuccess?: (transaction: any) => void;
      onCancel?: () => void;
    }): void;
  }
}
