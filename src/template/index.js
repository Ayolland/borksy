export default [
	{ data: () => import('./BitsyHD.5.1.hbs'), bitsyVersion: '5.1', isHd: true, description: 'Bitsy HD (Bitsy 5.1)' },
	{ data: () => import('./Bitsy.5.5.hbs'), bitsyVersion: '5.5', description: 'Bitsy 5.5' },
	{ data: () => import('./Bitsy.6.0.hbs'), bitsyVersion: '6.0', description: 'Bitsy 6.0' },
	{ data: () => import('./Bitsy.6.3.hbs'), bitsyVersion: '6.3', description: 'Bitsy 6.3' },
	{ data: () => import('./Bitsy.6.4.hbs'), bitsyVersion: '6.4', description: 'Bitsy 6.4' },
	{ data: () => import('./Bitsy.6.5.hbs'), bitsyVersion: '6.5', description: 'Bitsy 6.5' },
	{ data: () => import('./Bitsy.7.0.hbs'), bitsyVersion: '7.0', description: 'Bitsy 7.0' },
	{ data: () => import('./Bitsy.7.2.hbs'), bitsyVersion: '7.2', description: 'Bitsy 7.2' },
	{ data: () => import('./Bitsy.7.8.hbs'), bitsyVersion: '7.8', description: 'Bitsy 7.8' },
	{ data: () => import('./Bitsy.7.10.hbs'), bitsyVersion: '7.10', description: 'Bitsy 7.10' },
	{ data: () => import('./BitsyHD.7.11.hbs'), bitsyVersion: '7.11', isHd: true, description: 'Bitsy HD (Bitsy 7.11)' },
	{ data: () => import('./Bitsy.7.11.hbs'), bitsyVersion: '7.11', description: 'Bitsy 7.11', isDefault: true },
].map(i => ({ ...i, id: `Bitsy${i.isHd ? 'HD' : ''}${i.bitsyVersion.replace(/\./g, '')}` }));
