"use client"

import { useReadContract,ClaimButton } from "thirdweb/react";
import { getNFTs } from "thirdweb/extensions/erc721";
import { getContract } from "thirdweb";
import { client } from "@/lib/client";
import { defineChain } from "thirdweb/chains";
import { MediaRenderer } from "thirdweb/react";
import { TransactionWidget, darkTheme } from "thirdweb/react";


const celoSepolia = defineChain({
  id: 11142220,
  name: "Celo Sepolia",
  rpc: "https://forno.celo-sepolia.celo-testnet.org",
  nativeCurrency: {
    name: "CELO",
    symbol: "CELO",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "Celo Sepolia Blockscout",
      url: "https://celo-sepolia.blockscout.com",
    },
  ],
  testnet: true,
});

interface NFTCollectionProps {
  contractAddress: string;
}

export function NFTCollection({ contractAddress }: NFTCollectionProps) {
  const contract = getContract({
    client,
    chain:celoSepolia,
    address: contractAddress,
  });

  const { data: nfts, isLoading, error } = useReadContract(getNFTs, {
    contract,
    start: 0,
    count: 100,
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Loading NFTs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error loading NFTs: {error.message}
      </div>
    );
  }
  console.log("NFT:-->",nfts);
  if (!nfts || nfts.length === 0) {
    
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No NFTs found in this collection</p>
      </div>
    );
  }else{
    console.log("si tiene contenido");
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
  {
  nfts?.map( (nft) => (
    
    <div key={nft.id} className="border rounded-lg p-4 shadow-md">
      
        <MediaRenderer
        client={client}
        src={nft.metadata.image}
        alt={nft.metadata.name || "NFT"}
      className="w-full h-48 object-cover rounded mb-4"
      />  
    
      <h3 className="text-lg font-semibold mb-2">
        {nft.metadata.name || `NFT #${nft.id}`}
      </h3>
      <p className="text-gray-600 mb-2">
        {nft.metadata.description || "No description"}
      </p>
      <table>
        <thead>
          <tr>
            <th>Trait Type</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
        {(nft.metadata?.attributes as any)?.map((attribute: { trait_type: string; value: string }): JSX.Element => (
          <tr>
            <td>{attribute.trait_type}</td>
            <td>{attribute.value}</td>
          </tr>
          ))}
        </tbody>
      </table>
      
      <div className="text-sm text-gray-500">Token ID: {nft.id.toString()}</div>     
    </div> 
  ))}
  <div>
    <ClaimButton
        contractAddress={contractAddress}
        chain={celoSepolia}
        client={client}
        claimParams={{
          type: "ERC721",
          quantity: 1n,
        }}
      >
        Claim now
      </ClaimButton>
  </div>
</div>
  );
}
