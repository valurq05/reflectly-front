import { Component } from '@angular/core';
import { MetamaskService } from '../../core/services/metamask.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  walletAddress: string | null = null;
  subscriptionPrice = 0.01; 
  paymentAddress = '0x3776f676B96b90FbAAAC60B8e31fB989bd038Ea0'; 

  constructor(private metamaskService: MetamaskService) {}

  async connectWallet() {
    try {
      await this.metamaskService.connectWallet();
      this.walletAddress = await this.metamaskService.signer?.getAddress() || null;
    } catch (error) {
      console.error('Error al conectar MetaMask:', error);
    }
  }

  async paySubscription() {
    if (!this.walletAddress) {
      alert('Conecta tu billetera primero.');
      return;
    }

    try {
      const txHash = await this.metamaskService.sendPayment(this.paymentAddress, this.subscriptionPrice);
      console.log('Pago realizado, transacción:', txHash);
      alert(`Pago enviado. Hash: ${txHash}`);
    } catch (error) {
      console.error('Error en el pago:', error);
      alert('Error al procesar el pago.');
    }
  }
}
