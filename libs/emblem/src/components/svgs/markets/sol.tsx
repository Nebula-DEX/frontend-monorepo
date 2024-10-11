import { type SVGAttributes } from 'react';
import { EmblemSvg } from '../emblem-svg';

export const Sol = (props: SVGAttributes<SVGElement>) => {
    return (
	<EmblemSvg {...props} viewBox="0 0 32 32">

	    <g fill="none">

	    <circle fill="#66F9A1" cx="16" cy="16" r="16"/>

	    <path d="M9.925 19.687a.59.59 0 01.415-.17h14.366a.29.29 0 01.207.497l-2.838 2.815a.59.59 0 01-.415.171H7.294a.291.291 0 01-.207-.498l2.838-2.815zm0-10.517A.59.59 0 0110.34 9h14.366c.261 0 .392.314.207.498l-2.838 2.815a.59.59 0 01-.415.17H7.294a.291.291 0 01-.207-.497L9.925 9.17zm12.15 5.225a.59.59 0 00-.415-.17H7.294a.291.291 0 00-.207.498l2.838 2.815c.11.109.26.17.415.17h14.366a.291.291 0 00.207-.498l-2.838-2.815z" fill="#FFF"/>

	    </g>

	    </EmblemSvg>
    );
};
