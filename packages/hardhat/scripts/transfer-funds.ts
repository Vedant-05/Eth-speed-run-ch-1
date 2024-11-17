import { ethers } from "hardhat";

async function main() {
  const [sender] = await ethers.getSigners();
  
  // The address you want to transfer to
  const receiverAddress = "0xc4Ad6218B68514161fFeC5dA54E1D30462C27CCD";
  
  console.log("Sending from:", await sender.getAddress());
  console.log("Sending to:", receiverAddress);
  
  // Get current balance
  const balance = await ethers.provider.getBalance(sender.getAddress());
  console.log("Current balance:", ethers.formatEther(balance), "ETH");
  
  // Get fee data (includes gas price)
  const feeData = await ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice;
  
  if (!gasPrice) {
    throw new Error("Could not get gas price");
  }
  
  // Estimate gas limit for the transfer
  const gasLimit = 21000n; // Standard ETH transfer gas limit
  
  // Calculate the maximum amount we can send (balance - gas cost)
  const gasCost = gasPrice * gasLimit;
  const amountToSend = balance - gasCost;
  
  if (amountToSend <= 0) {
    console.log("Insufficient funds to cover gas costs");
    return;
  }
  
  console.log("Transferring:", ethers.formatEther(amountToSend), "ETH");
  
  try {
    // Send the transaction
    const tx = await sender.sendTransaction({
      to: receiverAddress,
      value: amountToSend,
      gasLimit: gasLimit
    });
    
    console.log("Transaction hash:", tx.hash);
    
    // Wait for the transaction to be mined
    await tx.wait();
    console.log("Transfer complete!");
    
    // Check final balance
    const finalBalance = await ethers.provider.getBalance(sender.getAddress());
    console.log("Final balance:", ethers.formatEther(finalBalance), "ETH");
    
  } catch (error) {
    console.error("Error during transfer:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });