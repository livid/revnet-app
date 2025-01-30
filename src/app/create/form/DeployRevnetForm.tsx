import { RelayrPostBundleResponse } from "@/lib/relayr/types";
import { Divider } from "./Divider";
import { DetailsPage } from "./ProjectDetails";
import { Stages } from "./Stages";
import { ChainSelect } from "./ChainSelect";
import { useTestData } from "../helpers/useTestData";
import { useFormikContext } from "formik";
import { RevnetFormData } from "../types";
import { QuoteButton } from "../buttons/QuoteButton";
import { isFormValid } from "../helpers/isFormValid";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { PayAndDeploy } from "../buttons/PayAndDeploy";
import { ChainOperator } from "./ChainOperator";
import { ChainSplits } from "./ChainSplits";
import { ChainAutoIssuance } from "./ChainAutoIssuance";

export function DeployRevnetForm({
  relayrResponse,
  reset,
  isLoading,
}: {
  relayrResponse?: RelayrPostBundleResponse;
  reset: () => void;
  isLoading: boolean;
}) {

  // type `testdata` into console to fill form with TEST_FORM_DATA
  // can remove on mainnet deploy
  useTestData();

  const { submitForm, values } = useFormikContext<RevnetFormData>();
  const validBundle = !!relayrResponse?.bundle_uuid;
  const disableQuoteButton = !isFormValid(values) || validBundle;
  const revnetTokenSymbol =
    values.tokenSymbol?.length > 0 ? `$${values.tokenSymbol}` : "token";

  return (
    <div className="md:grid md:grid-cols-3 max-w-6xl mx-auto my-20 gap-x-6 gap-y-6 px-4 sm:px-8 xl:gap-y-0 xl:px-0">
      <DetailsPage disabled={validBundle} />
      <Divider />

      <Stages disabled={validBundle} />
      <Divider />

      <ChainSelect disabled={validBundle} />
      {/* Quote and Depoly */}
      <div className="md:col-start-2 md:col-span-2 mt-6 md:-mt-20">
        {values.chainIds.length > 1 && (
          <>
            <ChainOperator disabled={validBundle} />
            <Divider />
          </>
        )}
        {values.chainIds.length > 1 && values.stages.some(stage => stage.splits.length > 0) && (
          <>
            <ChainSplits disabled={validBundle} />
            <Divider />
          </>
        )}
        {values.chainIds.length > 1 && values.stages.some(stage => stage.autoIssuance.length > 0) && (
          <>
            <ChainAutoIssuance disabled={validBundle} />
            <Divider />
          </>
        )}
        <QuoteButton
          isLoading={isLoading}
          validBundle={validBundle}
          disableQuoteButton={disableQuoteButton}
          onSubmit={submitForm}
        />
        {relayrResponse && (
          <div className="flex flex-col items-start">
            <div className="text-xs italic mt-2">
              Quote valid until{" "}
              {format(
                relayrResponse.payment_info[0].payment_deadline,
                "h:mm:ss aaa"
              )}
              .
              <Button
                variant="link"
                size="sm"
                className="italic text-xs px-1"
                disabled={isLoading}
                onClick={() => reset()}
              >
                clear quote
              </Button>
            </div>
            <div className="mt-4">
              <PayAndDeploy
                relayrResponse={relayrResponse}
                revnetTokenSymbol={revnetTokenSymbol}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
