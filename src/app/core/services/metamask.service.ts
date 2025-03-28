import { Injectable } from '@angular/core';
import { ethers, FeeData } from 'ethers';
import { LevelGas } from '../model/common.model';

declare global {
  interface Window {
    ethereum?: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class MetamaskService {
  provider!: ethers.BrowserProvider;
  signer: ethers.Signer | null = null;

  constructor() {
    if (window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    } else {
      console.error("Metamask no se encuentra instalado");
    }
  }

  async connectWallet() {
    try {
      if (!window.ethereum) throw new Error('Metamask no está disponible');

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      console.log("Cuenta conectada: ", await this.signer.getAddress());
    } catch (error) {
      console.log("Error conectando MetaMask: ", error);
    }
  }

  async getGasPrices() {
    try {
      const response = await fetch('https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=1SFDZI12D5GF51WIQPV5RUH7UP3KUSJ49H');
      const data = await response.json();

      console.log("Tarifas de gas:");
      console.log("Baja:", data.result.SafeGasPrice, "Gwei");
      console.log("Media:", data.result.ProposeGasPrice, "Gwei");
      console.log("Alta:", data.result.FastGasPrice, "Gwei");

      return {
        low: ethers.parseUnits(data.result.SafeGasPrice, "gwei"),
        average: ethers.parseUnits(data.result.ProposeGasPrice, "gwei"),
        high: ethers.parseUnits(data.result.FastGasPrice, "gwei"),
      };
    } catch (error) {
      console.error("Error obteniendo tarifas de gas:", error);
      return null;
    }
  }

  async sendPayment(to: string, amount: number, priority: LevelGas) {
    try {
        if (!this.signer) throw new Error("No hay signer disponible");

        console.log("Obteniendo tarifas de gas...");
        const gasPrices = await this.getGasPrices();
        if (!gasPrices) throw new Error("No se pudieron obtener tarifas de gas");

        const selectedGasPrice = gasPrices[priority];
        console.log(`Usando tarifa de gas (${priority}):`, ethers.formatUnits(selectedGasPrice, "gwei"), "Gwei");

        console.log("Estimando gas para la transacción...");
        const gasLimit = await this.provider.estimateGas({
            to,
            value: ethers.parseEther(amount.toString()),
        });

        console.log("Gas estimado:", gasLimit.toString());

        // Calcular el costo total de la transacción en ETH
        const gasCostInEth = ethers.formatUnits(gasLimit * selectedGasPrice, "wei"); 
        const totalAmount = amount + parseFloat(gasCostInEth);
        console.log("costo de gas en ETH:", gasCostInEth)

        let feeData = {
            maxFeePerGas: ethers.parseUnits("10", "gwei"),
            maxPriorityFeePerGas: ethers.parseUnits("2", "gwei"),
        };

        if (this.signer.provider) {
            const fetchedFeeData = await this.signer.provider.getFeeData();
            feeData = {
                maxFeePerGas: fetchedFeeData.maxFeePerGas ?? feeData.maxFeePerGas,
                maxPriorityFeePerGas: fetchedFeeData.maxPriorityFeePerGas ?? feeData.maxPriorityFeePerGas,
            };
        }

        console.log("Enviando transacción a:", to, 'con monto:', totalAmount);
        
        const tx = await this.signer.sendTransaction({
            to,
            value: ethers.parseEther(amount.toString()),
            maxFeePerGas: feeData.maxFeePerGas,
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
        });

        console.log("Transacción enviada: ", tx.hash);
        return {
            txHash: tx.hash,
            gasUsed: gasLimit.toString(),
            gasPrice: selectedGasPrice,
        };
    } catch (error) {
        console.error("Error al enviar la transacción: ", error);
        throw error;
    }
}
    async signMessage(message: string): Promise<string> {
    if (!this.signer) throw new Error("No hay signer disponible");
    
    return await this.signer.signMessage(message);
}

async verifySignature(message: string, signature: string) {
  try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      console.log("Dirección recuperada:", recoveredAddress);

      // Obtener la dirección de la billetera conectada
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      console.log("Dirección original:", userAddress);

      // Comparar direcciones
      if (recoveredAddress.toLowerCase() === userAddress.toLowerCase()) {
          console.log("✅ Firma válida: la firma pertenece al usuario.");
      } else {
          console.log("❌ Firma inválida: la dirección no coincide.");
      }
  } catch (error) {
      console.error("Error verificando la firma:", error);
  }
}

}