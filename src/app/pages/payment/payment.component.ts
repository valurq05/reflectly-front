import { Component } from '@angular/core';
import { MetamaskService } from '../../core/services/metamask.service';
import { LevelGas } from '../../core/model/common.model';
import { ethers } from 'ethers';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  Fees: any={}
  walletAddress: string | null = null;
  subscriptionPrice = 0.01; 
  paymentAddress = '0x7059340F1c684b88DEa3538314735f7d27dfE55B'; 
  selectedGasOption: LevelGas = "average";
  constructor(private metamaskService: MetamaskService) {}
  ngOnInit(){
    this.getGasFee()

  }

  async connectWallet() {
    try {
      await this.metamaskService.connectWallet();
      this.walletAddress = await this.metamaskService.signer?.getAddress() || null;
    } catch (error) {
      console.error('Error al conectar MetaMask:', error);
    }
  }

  async getGasFee(){
    this.Fees= await this.metamaskService.getGasPrices()
    console.log(this.Fees)
  }

  async paySubscription(gas:LevelGas) {
    if (!this.walletAddress) {
      alert('Conecta tu billetera primero.');
      return;
    }

    try {
      const txHash = await this.metamaskService.sendPayment(this.paymentAddress, this.subscriptionPrice, gas);
      console.log('Pago realizado, transacción:', txHash);
      alert(`Pago enviado. Hash: ${txHash.txHash}`);
      const message = `Confirmo la transacción con hash: ${txHash.txHash}`;
      console.log("message", message)
        const signature = await this.metamaskService.signMessage(message);
        console.log("Firma digital generada:", signature);
        alert(`Pago enviado. Hash: ${txHash.txHash}\nFirma: ${signature}`);
        await this.metamaskService.verifySignature(message, signature);
    } catch (error) {
      console.error('Error en el pago:', error);
      alert('Error al procesar el pago.');
    }
  }



}