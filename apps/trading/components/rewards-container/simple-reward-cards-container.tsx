import { SimpleRewardCard } from './simple-reward-card';
import { ExternalLink, Loader } from '@vegaprotocol/ui-toolkit';
import { useRewardCards } from '@vegaprotocol/rest';
import { Trans } from 'react-i18next';
import { DocsLinks } from '@vegaprotocol/environment';
import { useT } from '../../lib/use-t';

export const SimpleRewardCardsContainer = () => {
  const t = useT();
  const { data, isLoading } = useRewardCards();

  if (!data.length) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl mb-1">{t('Games')}</h2>
      <p className="mb-6 text-sm">
        <Trans
          i18nKey={
            'See all the live games on the cards below. <0>Find out how to create one</0>.'
          }
          components={[
            <ExternalLink
              className="underline"
              key="find-out"
              href={DocsLinks?.ASSET_TRANSFER_PROPOSAL}
            >
              Find out how to create one
            </ExternalLink>,
          ]}
        />
        {/** Docs: https://docs.vega.xyz/mainnet/tutorials/proposals/asset-transfer-proposal */}
      </p>
      <div className="mb-12 flex flex-col">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data?.map((card) => {
              return <SimpleRewardCard key={card.rewardId} {...card} />;
            })}
          </div>
        )}
      </div>
    </section>
  );
};
