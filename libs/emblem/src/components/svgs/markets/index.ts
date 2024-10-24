import { type SVGAttributes, type ComponentType } from 'react';
import { GoldYen } from './gold-yen';
import { GoldYuan } from './gold-yuan';
import { GoldGbp } from './gold-gbp';
import { GoldEur } from './gold-eur';
import { Btc } from './btc';
import { Eth } from './eth';
import { CrudeOil } from './crude-oil';
import { Sol } from './sol';
import { Aud } from './aud';
import { Orange } from './orange';
import { Cattle } from './cattle';
import { NaturalGas } from './gas';
import { Wheat } from './wheat';
import { Xau } from './xau';
import { Cac40 } from './cac40';
import { Dax40 } from './dax40';
import { Ftse } from './ftse';
import { Nikkei } from './nikkei';
import { Hangseng } from './hangseng';

export const marketIcons: Record<
  string,
  ComponentType<SVGAttributes<SVGElement>>
> = {
  c256ac0206dd6c4b2c443acd4590b156fc4f0f6963806780a374f1202cc68e85: GoldYuan,
  b47b9a2c8a9f69c01a54093ed81083f712ec88e98a0cc1358a621be3e8632116: Xau,
  '27b3e25451b736261b26b30de0b3009143ff46f7404b4ee784b10c0792abe149': GoldYen,
  '2b851d11814da7e409ce6b0da8a62f0cf0e2fa4fb4a6344289aebbad1a79cb8d': Cac40,
  '03d186c550ae6f13c1b0732320f1923c60767e37df5fa4099565a3db49691894': Ftse,
  ee75df55c84dd341ce285fd65b7dc8f0857db977f6fb2875bce1beb405735a48: Nikkei,
  '0c89d267c72cf9d41fcd59c393c59ee9ce85556ac5336ac8cf29bd4090be174d': Hangseng,
  a98b3eeea8bdc5afd0677869df89d9630a277a02f7336bbc4c074ce5f743b581: Dax40,
  '82b7c459a515e8404ca92fcfa3bef312d331abb2af40ae056de13c810a3c4c08': GoldYen,
  '74711691b900bc8fea802ebb99d06c4ee326bda75058ac1c9637e9bc8233872d': GoldGbp,
  '778e7f4cd2414faf44d1e8a5391bbec87616aef5798bb2093f2db56704543c5f': GoldEur,
  '6d8da2600e94db28a0ff024049d8c1fe1e6d26ba46fd3e43517f26c133caad93': Btc,
  d81a8bacb5e1a6b4bc8773d8af4e4ad29a5109e0ed4648ffe26c136c84cad3fc: Aud,
  f54044c1c87ff31509ea495d8bc55783864bbcd2ced04db8cd2ce64ef43d1f49: Cattle,
  '19fa4e7dcaf956efe33e5345bfd7a8ad3b4ea4634cdd12b3158321350f949009': CrudeOil,
  '6d2e736f4b15a29f513db892bafbd3e93977222fe3a660241179e10665a7f574': Sol,
  '95a8b0dcd0acdd6c0c0df61bb24283626abaeb2f66821173e13affbb076d2b76': Orange,
  f4131d11f6294172a6f9526d1bf0eee832846a47e3f30a759948dfdb7659198a: Eth,
  b0e849d267dc8b1e543a2109885b9f9dba600a733a3b30595e93e772862b6cb1: NaturalGas,
  '90cbdea8d4986173b2fbcbbec1fe7565e7fc1e3aa60b3ccb0e9d1a5a9eb18f19': Wheat,
};
