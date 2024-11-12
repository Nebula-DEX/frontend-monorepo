import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';
import { Time } from '../utils';

const rewardCardSchema = z.object({
  rewardId: z.string(),
  title: z.string(),
  description: z.string(),
  tags: z.array(
    z.object({
      text: z.string(),
      variant: z.enum(['primary', 'secondary', 'tertiary']),
    })
  ),
});

const rewardCardsSchema = z.array(rewardCardSchema);

export type RewardCard = z.infer<typeof rewardCardSchema>;

export const retrieveRewardCards = async () => {
  return rewardCardsSchema.parse(data);
};

export const queryKeys = {
  all: ['reward-cards'],
  list: () => [...queryKeys.all, 'list'],
} as const;

export function rewardCardsOptions() {
  return queryOptions({
    queryKey: queryKeys.all,
    queryFn: () => retrieveRewardCards(),
    staleTime: Time.HOUR,
    initialData: data,
  });
}

// Add reward card data here
const data: RewardCard[] = [
  {
    rewardId:
      'e79dedd2d05af4dd5fb5039966f81c56ce65d4451a2c02e071017cb419b45b8a',
    title: ' Crypto Constellation Reward',
    description:
      'Venture into the vast expanse of digital assets with the Crypto Constellation Reward! Every 4 hours, traders with realized gains or losses on BTC, ETH, and SOL can enter the cosmic lottery, where higher PNL boosts your chances of winning the first prize.\n\n* **Only realized PNL within the 4-hour epoch qualifies you for the draw.**\n* **Must be part of a team to qualify.**',
    tags: [],
  },
  {
    rewardId:
      '6efc14af801568bbfb786f9bf765e4773c7c528ea7393e9f89b61b029b8bd30f',
    title: 'Stellar Commodities Quest',
    description:
      'Explore the universe of essential resources in the Stellar Commodities Quest. Trade Gold, Oil, Wheat, and more to build your PNL, and join the 4-hourly lottery where every trader has a chance to shine. Higher PNL increases your odds of winning the lottery.\n\n* **Only realized PNL within the 4-hour epoch qualifies you for the draw.** \n* **Must be part of a team to qualify.**',
    tags: [],
  },
  {
    rewardId:
      'f836f4e39f58c955dc87a7cd5cbc73d722b06bda2064066621f11f00b59bef02',
    title: 'Galactic Forex Challenge',
    description:
      'Navigate the FX landscape with the Galactic Forex Challenge. Engage with currencies like Euro, GBP, Yen, Yuan, and USD. Every 4 hours, traders in the FX galaxy join a cosmic lottery, and higher PNL increases your odds of winning the lottery.\n\n* **Only realized PNL within the 4-hour epoch qualifies you for the draw.** \n* **Must be part of a team to qualify.**',
    tags: [],
  },
  {
    rewardId:
      '44d49b3f3b0d19cec1b4083608eddcbd33f574eb38de521f149adb4bd3ce8730',
    title: 'Interstellar Index League',
    description:
      'Expand your reach across global markets in the Interstellar Index League. From the DAX to the Nikkei, FTSE, and beyond, trade your way to higher PNL and join a 4-hourly draw for the ultimate prize. Higher PNL increases your odds of winning the lottery.\n\n* **Only realized PNL within the 4-hour epoch qualifies you for the draw.** \n* **Must be part of a team to qualify.**',
    tags: [],
  },
];
