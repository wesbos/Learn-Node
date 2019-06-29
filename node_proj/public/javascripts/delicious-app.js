import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autoComplete from './modules/autocomplete';

autoComplete($('#address'),$('#lat'),$('#lng'));
