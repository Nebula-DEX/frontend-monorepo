import { Controller, useForm } from 'react-hook-form';
import { useSquid } from '../../components/deposit-container/use-squid';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  FormGroup,
  Input,
  InputError,
  Intent,
  Select,
} from '@vegaprotocol/ui-toolkit';
import { useSquidRoute } from '../../components/deposit-container/use-squid-route';

export const BuyNeb = () => {
  return <Form />;
};

const formSchema = z.object({
  fromChain: z.string(),
  fromAsset: z.string(),
  amount: z.coerce.number().min(0.000000001),
});
type FormFields = z.infer<typeof formSchema>;

const Form = () => {
  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  });

  const { data: squid } = useSquid();
  const { data: route } = useSquidRoute({
    form,
    toAsset: {
      id: '2a1f29de786c49d7d4234410bf2e7196a6d173730288ffe44b1f7e282efb92b1',
      symbol: 'USDT',
      quantum: '1000000',
      decimals: 6,
      source: {
        chainId: '42161',
        contractAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      },
    },
  });

  console.log(route);

  const chainId = form.watch('fromChain');

  return (
    <form
      onSubmit={form.handleSubmit((fields: FormFields) => {
        console.log(fields);
      })}
    >
      <FormGroup label="From chain" labelFor="fromChain">
        <Select {...form.register('fromChain')}>
          {squid?.chains.map((c) => (
            <option key={c.chainId} value={c.chainId}>
              {c.networkName}
            </option>
          ))}
        </Select>
        {form.formState.errors.fromChain && (
          <InputError>{form.formState.errors.fromChain.message}</InputError>
        )}
      </FormGroup>
      <FormGroup label="From asset" labelFor="fromAsset">
        <Select {...form.register('fromAsset')}>
          {squid?.tokens
            .filter((t) => t.chainId === chainId)
            .map((t) => (
              <option key={t.address} value={t.address}>
                {t.symbol}
              </option>
            ))}
        </Select>
        {form.formState.errors.fromAsset && (
          <InputError>{form.formState.errors.fromAsset.message}</InputError>
        )}
      </FormGroup>
      <FormGroup label="Amount" labelFor="amount">
        <Input
          {...form.register('amount')}
          inputMode="numeric"
          pattern="^(?!0(\.0+)?$)(\d+(\.\d+)?|\.\d+)$"
        />
        {form.formState.errors.amount && (
          <InputError>{form.formState.errors.amount.message}</InputError>
        )}
      </FormGroup>
      <Button type="submit" intent={Intent.Primary}>
        Submit
      </Button>
    </form>
  );
};
