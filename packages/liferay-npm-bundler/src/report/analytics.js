/**
 * © 2017 Liferay, Inc. <https://liferay.com>
 *
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as insight from '../insight';

/*
 * Some important information about analytics.
 *
 * The data generated by this report dump can be analyzed by getting the raw
 * URLs from the GA API, using this URL:
 *
 * https://ga-dev-tools.appspot.com/query-explorer/?start-date=30daysAgo&end-date=today&metrics=ga%3Apageviews&dimensions=ga%3ApagePath
 *
 * Note that the URL gets the data for the last 30 days, but that may be
 * changed once in the page.
 *
 * Keep in mind that every time someone runs the bundler new statistics are
 * created, thus, the important information must be bundled inside the track
 * URL because the count will be a function of the times liferay-npm-bundler has
 * been executed.
 *
 * Apart from the previous caveat, it is also important to note that the project
 * configuration may change over time (maybe you use Angular 4 today, but 5
 * tomorrow) and that's why the URLs always start with a unique ID which is a
 * signature of (computer, project's name).
 *
 * To finish with, we must take care with report fields that may come empty. For
 * example, if some package has been processed, the bundler caches the result in
 * the build directory and doesn't process it any more, thus any information
 * related to that package will only be available to the analyticsDump function
 * in the first run but not the following.
 */

/**
 * Dump a report information to Google Analytics.
 * @param  {Report} report the report to dump
 * @return {void}
 */
export function analyticsDump(report) {
	const {_packages, _versionsInfo} = report;

	// Report project name
	insight.track('name', insight.PROJECT_NAME);

	// Increase build count for this project
	insight.track('build', 'count');

	// Increase plugin use counts for this project
	Object.keys(_versionsInfo).forEach(name =>
		insight.track('bundler', 'plugin', name, _versionsInfo[name])
	);

	// Increase dependency use counts for this project
	Object.keys(_packages).forEach(pkgId => {
		const {name, version} = _packages[pkgId];

		insight.track('project', 'dependency', name, version);
	});
}
