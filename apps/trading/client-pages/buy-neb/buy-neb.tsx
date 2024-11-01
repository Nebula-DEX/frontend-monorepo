import { HeaderPage } from 'apps/trading/components/header-page';
import { DepositContainer } from './deposit-container';
import { useDialogStore, useVegaWallet } from '@vegaprotocol/wallet-react';
import { Button, Intent } from '@vegaprotocol/ui-toolkit';
import { USDT_ID } from '../../lib/constants';
import { useAccount } from 'wagmi';
import { useVegaTransactionStore } from '@vegaprotocol/web3';
import { OrderTimeInForce, OrderType, Side } from '@vegaprotocol/types';
import { useState } from 'react';
import { useOrderbook } from '@vegaprotocol/market-depth';

const SWAP_MARKET_ID =
  '13af1d3e06d639f2973ec108d0d4ce0aa8fe77a4f5c29891aec3abe329fb1fa0';

export const BuyNeb = () => {
  const [txId, setTxId] = useState<number>();
  const { pubKey } = useVegaWallet();
  const { address } = useAccount();
  const open = useDialogStore((store) => store.open);
  const create = useVegaTransactionStore((state) => state.create);
  const txs = useVegaTransactionStore((state) => state.transactions);
  const tx = txs.find((t) => t?.id === txId);

  // eslint-disable-next-line no-console
  console.log('vega tx', tx);

  const { data, loading } = useOrderbook(SWAP_MARKET_ID);

  const lowestAskLvl = data?.depth?.sell ? data.depth.sell[0] : undefined;

  if (loading) {
    return null;
  }

  if (!lowestAskLvl) {
    return (
      <section className="flex flex-col gap-10 min-w-[500px] max-w-3xl mx-auto">
        <HeaderPage>Buy NEB</HeaderPage>
        <p>NEB is not currently available to buy</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-10 min-w-[500px] max-w-3xl mx-auto">
      <HeaderPage>Buy NEB</HeaderPage>
      {pubKey && address ? (
        <DepositContainer
          address={address}
          pubKey={pubKey}
          initialAssetId={USDT_ID}
          onDeposit={(tx) => {
            if (!tx.data?.result) {
              throw new Error('no deposit result for swap');
            }

            // amount of deposited arbitrum usdt
            const amount = BigInt(tx.data.result.amount);
            const price = BigInt(lowestAskLvl.price);
            const size = String(amount / price);

            const orderSubmission = {
              marketId: SWAP_MARKET_ID,
              side: Side.SIDE_BUY,
              type: OrderType.TYPE_LIMIT, // price ? OrderType.TYPE_LIMIT : OrderType.TYPE_MARKET,
              price: lowestAskLvl.price, // price ? price.toFixed(0) : undefined,
              timeInForce: OrderTimeInForce.TIME_IN_FORCE_FOK,
              size,
            };
            const id = create({ orderSubmission });
            setTxId(id);
          }}
        />
      ) : (
        <Button intent={Intent.Primary} onClick={open}>
          Connect
        </Button>
      )}
    </section>
  );
};

// import { Controller, useForm } from 'react-hook-form';
// import { useSquid } from '../../components/deposit-container/use-squid';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import {
//   Button,
//   FormGroup,
//   Input,
//   InputError,
//   Intent,
//   Select,
// } from '@vegaprotocol/ui-toolkit';
// import { useSquidRoute } from '../../components/deposit-container/use-squid-route';
// import { AssetERC20 } from '@vegaprotocol/assets';
// import { useDepositForm } from '../../components/deposit-container/use-deposit-form';

// export const BuyNeb = () => {
//   return <Form />;
// };

// const formSchema = z.object({
//   fromChain: z.string(),
//   fromAsset: z.string(),
//   amount: z.coerce.number().min(0.000000001),
// });
// type FormFields = z.infer<typeof formSchema>;

// const Form = () => {
//   const { data: squid } = useSquid();
//   const { form } = useDepositForm()

//   // const { data: route } = useSquidRoute({
//   //   form,
//   //   toAsset: {
//   //     id: '2a1f29de786c49d7d4234410bf2e7196a6d173730288ffe44b1f7e282efb92b1',
//   //     symbol: 'USDT',
//   //     quantum: '1000000',
//   //     decimals: 6,
//   //     source: {
//   //       chainId: '42161',
//   //       contractAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
//   //     },
//   //   } as AssetERC20,
//   // });

//   // console.log(route);

//   const chainId = form.watch('fromChain');

//   // const formValues = useDebounce(form.getValues(), 500);
//   console.log('here');

//   return (
//     <form
//       onSubmit={form.handleSubmit((fields: FormFields) => {
//         console.log(fields);
//       })}
//     >
//       <FormGroup label="From chain" labelFor="fromChain">
//         <Select {...form.register('fromChain')}>
//           {squid?.chains.map((c) => (
//             <option key={c.chainId} value={c.chainId}>
//               {c.networkName}
//             </option>
//           ))}
//         </Select>
//         {form.formState.errors.fromChain && (
//           <InputError>{form.formState.errors.fromChain.message}</InputError>
//         )}
//       </FormGroup>
//       <FormGroup label="From asset" labelFor="fromAsset">
//         <Select {...form.register('fromAsset')}>
//           {squid?.tokens
//             .filter((t) => t.chainId === chainId)
//             .map((t) => (
//               <option key={t.address} value={t.address}>
//                 {t.symbol}
//               </option>
//             ))}
//         </Select>
//         {form.formState.errors.fromAsset && (
//           <InputError>{form.formState.errors.fromAsset.message}</InputError>
//         )}
//       </FormGroup>
//       <FormGroup label="Amount" labelFor="amount">
//         <Input
//           {...form.register('amount')}
//           inputMode="numeric"
//           pattern="^(?!0(\.0+)?$)(\d+(\.\d+)?|\.\d+)$"
//         />
//         {form.formState.errors.amount && (
//           <InputError>{form.formState.errors.amount.message}</InputError>
//         )}
//       </FormGroup>
//       <Button type="submit" intent={Intent.Primary}>
//         Submit
//       </Button>
//     </form>
//   );
// };
