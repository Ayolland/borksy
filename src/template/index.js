import Bitsy55 from './Bitsy.5.5.hbs';
import Bitsy60 from './Bitsy.6.0.hbs';
import Bitsy63 from './Bitsy.6.3.hbs';
import Bitsy64 from './Bitsy.6.4.hbs';
import Bitsy65 from './Bitsy.6.5.hbs';
import Bitsy70 from './Bitsy.7.0.hbs';
import Bitsy710 from './Bitsy.7.10.hbs';
import Bitsy711 from './Bitsy.7.11.hbs';
import Bitsy72 from './Bitsy.7.2.hbs';
import Bitsy78 from './Bitsy.7.8.hbs';
import BitsyHD51 from './BitsyHD.5.1.hbs';

export default [
	{ data: BitsyHD51, bitsyVersion: '5.1', isHd: true, description: 'Bitsy HD (Bitsy 5.1)' },
	{ data: Bitsy55, bitsyVersion: '5.5', description: 'Bitsy 5.5' },
	{ data: Bitsy60, bitsyVersion: '6.0', description: 'Bitsy 6.0' },
	{ data: Bitsy63, bitsyVersion: '6.3', description: 'Bitsy 6.3' },
	{ data: Bitsy64, bitsyVersion: '6.4', description: 'Bitsy 6.4' },
	{ data: Bitsy65, bitsyVersion: '6.5', description: 'Bitsy 6.5' },
	{ data: Bitsy70, bitsyVersion: '7.0', description: 'Bitsy 7.0' },
	{ data: Bitsy72, bitsyVersion: '7.2', description: 'Bitsy 7.2' },
	{ data: Bitsy78, bitsyVersion: '7.8', description: 'Bitsy 7.8' },
	{ data: Bitsy710, bitsyVersion: '7.10', description: 'Bitsy 7.10' },
	{ data: Bitsy711, bitsyVersion: '7.11', description: 'Bitsy 7.11', isDefault: true },
].map(i => ({ ...i, id: `Bitsy${i.isHd ? 'HD' : ''}${i.bitsyVersion.replace(/\./g, '')}` }));
