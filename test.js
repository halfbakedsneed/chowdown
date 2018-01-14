var chowdown = require('./src/chowdown');

chowdown('https://www.reddit.com/r/LivestreamFail/')
	.paginate(
		page => page.collection('.entry', {
			title: 'a.title',
			link: 'a/href'
		}),
		'.next-button > a',
		2
	)
	.tap(a => console.log(a.length))