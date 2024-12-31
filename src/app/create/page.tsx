"use client";

import { Formik } from "formik";
import { useChain } from "juice-sdk-react";
import { useState } from "react";
import { revDeployerAbi, revDeployerAddress } from "revnet-sdk";
import { encodeFunctionData } from "viem";
import { RevnetFormData } from "./types";
import { Nav } from "@/components/layout/Nav";
import { useDeployRevnetRelay } from "@/lib/relayr/hooks/useDeployRevnetRelay";
import { DEFAULT_FORM_DATA } from "./constants";
import { DeployRevnetForm } from "./form/DeployRevnetForm";
import { parseDeployData } from "./helpers/parseDeployData";
import { pinProjectMetadata } from "./helpers/pinProjectMetaData";
import { parseSuckerDeployerConfig } from "./helpers/parseSuckerDeployerConfig";

export default function Page() {
  const [isLoadingIpfs, setIsLoadingIpfs] = useState<boolean>(false);

  const chain = useChain();
  const {
    write,
    response,
    isLoading: isRelayrLoading,
    reset,
  } = useDeployRevnetRelay();

  const isLoading = isLoadingIpfs || isRelayrLoading;

  async function deployProject(formData: RevnetFormData) {
    // Upload metadata
    setIsLoadingIpfs(true);
    const metadataCid = await pinProjectMetadata({
      name: formData.name,
      description: formData.description,
      logoUri: formData.logoUri,
    });
    setIsLoadingIpfs(false);

    // returns empty deployer config until new suckers are deployed
    const suckerDeployerConfig = parseSuckerDeployerConfig();

    const deployData = parseDeployData(formData, {
      metadataCid,
      chainId: chain?.id,
      usdcAddress: "0x",
      usdcDecimals: 6,
      usdcCurrency: 1,
      suckerDeployerConfig: suckerDeployerConfig,
    });

    const encodedData = encodeFunctionData({
      abi: revDeployerAbi, // ABI of the contract
      functionName: "deployFor",
      args: deployData,
    });

    console.log("deployData::", deployData, encodedData);
    console.log("chainIds::", formData.chainIds);

    const writeData = formData.chainIds.map(chainId => {
      return {
        data: encodedData,
        chain: Number(chainId),
        deployer: revDeployerAddress[chainId],
      };
    });

    write?.(writeData);
  }

  return (
    <>
      <Nav />
      <Formik
        initialValues={DEFAULT_FORM_DATA}
        onSubmit={(formData: RevnetFormData) => {
          try {
            deployProject?.(formData);
          } catch (e) {
            setIsLoadingIpfs(false);
            console.error(e);
          }
        }}
      >
        <DeployRevnetForm
          relayrResponse={response}
          isLoading={isLoading}
          reset={reset}
        />
      </Formik>
    </>
  );
}
