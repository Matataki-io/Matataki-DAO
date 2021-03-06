import { JsonRpcProvider, WebSocketProvider } from '@ethersproject/providers';
import networks from '@/helpers/networks.json';
import i18n from '../i18n';

export class Providers {
  public rpc?: JsonRpcProvider;
  public ws?: WebSocketProvider;

  async setNetwork(chainId) {
    try {
      console.log('chainId', chainId);
      console.log('process.env.VUE_APP_CHAIN_ID', process.env.VUE_APP_CHAIN_ID);
      if (chainId.toString() !== process.env.VUE_APP_CHAIN_ID) {
        alert(i18n.t('pleaseToggleWalletNetwork'));
      }
      const rpcUrl: any = networks[chainId].rpcUrl;
      this.rpc = new JsonRpcProvider(rpcUrl);
      // const wsUrl: any = networks[chainId].wsUrl;
      // this.ws = wsUrl ? new WebSocketProvider(wsUrl) : undefined;
    } catch (e) {
      console.log('setNetwork error', e);
    }
  }
}

export default new Providers();
