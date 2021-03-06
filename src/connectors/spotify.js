'use strict';

const playerBar = '.Root__now-playing-bar';

const artistSelector = `${playerBar} [dir="auto"]:last-child a`;
const spotifyConnectSelector = '[aria-live="polite"] span';

const playPauseButtonSvgPathSelector = `${playerBar} .player-controls__buttons button:nth-child(3) path`;
const playButtonSvgPath = 'M4.018 14L14.41 8 4.018 2z';

Connector.useMediaSessionApi();

Connector.playerSelector = playerBar;

Connector.artistSelector = [
	artistSelector,
	// For local files
	`${playerBar} [data-testid="track-info-artists"]`,
];

Connector.trackSelector = [
	`${playerBar} [dir="auto"]:first-child a`,
	// For local files
	`${playerBar} [data-testid="track-info-name"]`,
];

Connector.trackArtSelector = '.NavBarFooter .cover-art-image';

Connector.currentTimeSelector = `${playerBar} .playback-bar__progress-time:first-child`;

Connector.durationSelector = `${playerBar} .playback-bar__progress-time:last-child`;

Connector.applyFilter(MetadataFilter.getSpotifyFilter());

Connector.isScrobblingAllowed = () => isMusicPlaying() && isMainTab();

Connector.isPodcast = () => isPodcastPlaying();

Connector.isPlaying = () => {
	const svgPath = Util.getAttrFromSelectors(
		playPauseButtonSvgPathSelector,
		'd'
	);
	if (svgPath) {
		return svgPath !== playButtonSvgPath;
	}

	return true;
};

function isMusicPlaying() {
	return artistUrlIncludes('/artist/', '/show/') || isLocalFilePlaying();
}

function artistUrlIncludes(...strings) {
	const artistUrl = Util.getAttrFromSelectors(artistSelector, 'href');

	if (artistUrl) {
		for (const str of strings) {
			if (artistUrl.includes(str)) {
				return true;
			}
		}
	}

	return false;
}

function isPodcastPlaying() {
	if (isLocalFilePlaying()) {
		return false;
	}

	return artistUrlIncludes('/show/');
}

function isLocalFilePlaying() {
	// Local files has no links
	// TODO Use better detection
	return document.querySelector(artistSelector) === null;
}

function isMainTab() {
	if (hasMultipleSources()) {
		const deviceName = getActiveDeviceName();
		return deviceName && !deviceName.includes('Web Player');
	}

	return true;
}

function hasMultipleSources() {
	return document.body.classList.contains('qualaroo--connect-bar-visible');
}

function getActiveDeviceName() {
	const spotifyConnectEl = document.querySelector(spotifyConnectSelector);
	return spotifyConnectEl && spotifyConnectEl.textContent;
}
