import { BaseConnector } from './base';

export abstract class InjectedConnector extends BaseConnector {
  constructor(private propertity: string) {
    super();
    const props = this.propertity?.split('.');
    if (!this.propertity || props.length > 2) {
      throw new Error('please input valid propertity');
    }
  }
  isReady(): boolean {
    if (typeof window !== 'undefined') {
      const props = this.propertity.split('.');
      if (props.length === 1) {
        return typeof (window as any)[props[0]] !== 'undefined';
      } else {
        return (
          typeof (window as any)[props[0]] !== 'undefined' && typeof (window as any)[props[0]][props[1]] !== 'undefined'
        );
      }
    }
    return false;
  }

  async requestAccounts(): Promise<string[]> {
    const provider = this.getProvider();
    if (!provider) {
      throw new Error(`${this.metadata.name} is not install!`);
    }
    const accounts = await provider.requestAccounts();
    const key = `${this.metadata.id}-request-accounts`;
    localStorage.setItem(key, JSON.stringify(accounts));
    return accounts;
  }

  async getAccounts(): Promise<string[]> {
    const provider = this.getProvider();
    if (!provider) {
      throw new Error(`${this.metadata.name} is not install!`);
    }
    let accounts = await provider.getAccounts();
    if (accounts.length === 0) {
      const key = `${this.metadata.id}-request-accounts`;
      const local = localStorage.getItem(key);
      if (local) {
        accounts = JSON.parse(local);
      }
    }
    return accounts;
  }
  async getPublicKey(): Promise<string> {
    const provider = this.getProvider();
    if (!provider) {
      throw new Error(`${this.metadata.name} is not install!`);
    }
    return provider.getPublicKey();
  }
  async signMessage(signStr: string, type?: 'ecdsa' | 'bip322-simple'): Promise<string> {
    const provider = this.getProvider();
    if (!provider) {
      throw new Error(`${this.metadata.name} is not install!`);
    }
    const addresses = await this.getAccounts();
    if (addresses.length === 0) {
      throw new Error(`${this.metadata.name} not connected!`);
    }
    return provider.signMessage(signStr, type);
  }
  on(event: string, handler: (data?: unknown) => void) {
    const provider = this.getProvider();
    if (!provider) {
      throw new Error(`${this.metadata.name} is not install!`);
    }
    return provider.on?.(event, handler);
  }
  removeListener(event: string, handler: (data?: unknown) => void) {
    const provider = this.getProvider();
    if (!provider) {
      throw new Error(`${this.metadata.name} is not install!`);
    }
    return provider.removeListener?.(event, handler);
  }

  getProvider() {
    if (this.isReady()) {
      const props = this.propertity.split('.');
      if (props.length === 1) {
        return (window as any)[props[0]];
      } else {
        return (window as any)[props[0]][props[1]];
      }
    }
  }

  async getNetwork(): Promise<'livenet' | 'testnet'> {
    const provider = this.getProvider();
    if (!provider) {
      throw new Error(`${this.metadata.name} is not install!`);
    }
    return provider.getNetwork();
  }
  async switchNetwork(network: 'livenet' | 'testnet'): Promise<void> {
    const provider = this.getProvider();
    if (!provider) {
      throw new Error(`${this.metadata.name} is not install!`);
    }
    return provider.switchNetwork(network);
  }

  async sendBitcoin(toAddress: string, satoshis: number, options?: { feeRate: number }): Promise<string> {
    const provider = this.getProvider();
    if (!provider) {
      throw new Error(`${this.metadata.name} is not install!`);
    }
    return provider.sendBitcoin(toAddress, satoshis, options);
  }

  disconnect() {
    const key = `${this.metadata.id}-request-accounts`;
    localStorage.removeItem(key);
  }
}
