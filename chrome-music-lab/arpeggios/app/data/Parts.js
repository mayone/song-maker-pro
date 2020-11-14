/**
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define({
	loopDuration : "1m",
	parts : [
		[
			{"time" : "8n * 0", "degree" : 0, "duration" : "8n"},
			{"time" : "8n * 1", "degree" : 1, "duration" : "8n"},
			{"time" : "8n * 2", "degree" : 2, "duration" : "8n"},
			{"time" : "8n * 3", "degree" : 3, "duration" : "8n"},
			{"time" : "8n * 4", "degree" : 4, "duration" : "8n"},
			{"time" : "8n * 5", "degree" : 3, "duration" : "8n"},
			{"time" : "8n * 6", "degree" : 2, "duration" : "8n"},
			{"time" : "8n * 7", "degree" : 1, "duration" : "8n"},
		],
		[
			{"time" : "8n * 0", "degree" : 3, "duration" : "8n"},
			{"time" : "8n * 1", "degree" : 5, "duration" : "8n"},
			{"time" : "8n * 2", "degree" : 4, "duration" : "8n"},
			{"time" : "8n * 3", "degree" : 5, "duration" : "8n"},
			{"time" : "8n * 4", "degree" : 3, "duration" : "8n"},
			{"time" : "8n * 5", "degree" : 5, "duration" : "8n"},
			{"time" : "8n * 6", "degree" : 4, "duration" : "8n"},
			{"time" : "8n * 7", "degree" : 5, "duration" : "8n"},
		],
		/*[
			{"time" : "4n * 0", "degree" : 0, "duration" : "4n"},
			{"time" : "4n * 0", "degree" : 4, "duration" : "4n"},
			{"time" : "4n * 1", "degree" : 1, "duration" : "4n"},
			{"time" : "4n * 1", "degree" : 5, "duration" : "4n"},
			{"time" : "4n * 2", "degree" : 2, "duration" : "4n"},
			{"time" : "4n * 2", "degree" : 6, "duration" : "4n"},
			{"time" : "4n * 3", "degree" : 3, "duration" : "4n"},
			{"time" : "4n * 3", "degree" : 7, "duration" : "4n"},
		],*/
		[
			{"time" : "4n * 0", "degree" : 0, "duration" : "4n"},
			// {"time" : "4n * 0", "degree" : 4, "duration" : "4n"},
			{"time" : "4n * 1", "degree" : 1, "duration" : "4n"},
			// {"time" : "4n * 1", "degree" : 5, "duration" : "4n"},
			{"time" : "4n * 2", "degree" : 2, "duration" : "4n"},
			// {"time" : "4n * 2", "degree" : 6, "duration" : "4n"},
			{"time" : "4n * 3", "degree" : 3, "duration" : "4n"},
			// {"time" : "4n * 3", "degree" : 7, "duration" : "4n"},
		],
		/*[
			{"time" : "16n * 0", "degree" : 0, "duration" : "16n"},
			{"time" : "16n * 0", "degree" : 2, "duration" : "16n"},
			{"time" : "16n * 0", "degree" : 6, "duration" : "16n"},

			{"time" : "16n * 1", "degree" : 5, "duration" : "16n"},
			{"time" : "16n * 2", "degree" : 6, "duration" : "16n"},
			{"time" : "16n * 3", "degree" : 5, "duration" : "16n"},

			{"time" : "16n * 4", "degree" : 6, "duration" : "16n"},
			{"time" : "16n * 4", "degree" : 4, "duration" : "16n"},

			{"time" : "16n * 5", "degree" : 5, "duration" : "16n"},
			{"time" : "16n * 6", "degree" : 6, "duration" : "16n"},
			{"time" : "16n * 7", "degree" : 5, "duration" : "16n"},

			{"time" : "16n * 8", "degree" : 0, "duration" : "16n"},
			{"time" : "16n * 8", "degree" : 2, "duration" : "16n"},
			{"time" : "16n * 8", "degree" : 6, "duration" : "16n"},

			{"time" : "16n * 9", "degree" : 5, "duration" : "16n"},
			{"time" : "16n * 10", "degree" : 6, "duration" : "16n"},
			{"time" : "16n * 11", "degree" : 5, "duration" : "16n"},

			{"time" : "16n * 12", "degree" : 6, "duration" : "16n"},
			{"time" : "16n * 12", "degree" : 4, "duration" : "16n"},

			{"time" : "16n * 13", "degree" : 5, "duration" : "16n"},
			{"time" : "16n * 14", "degree" : 6, "duration" : "16n"},
			{"time" : "16n * 15", "degree" : 5, "duration" : "16n"},
		],*/
		[
			{"time" : "8t * 0", "degree" : 5, "duration" : "8t"},
			{"time" : "8t * 1", "degree" : 4, "duration" : "8t"},
			{"time" : "8t * 2", "degree" : 3, "duration" : "8t"},
			{"time" : "8t * 3", "degree" : 4, "duration" : "8t"},
			{"time" : "8t * 4", "degree" : 3, "duration" : "8t"},
			{"time" : "8t * 5", "degree" : 2, "duration" : "8t"},
			{"time" : "8t * 6", "degree" : 3, "duration" : "8t"},
			{"time" : "8t * 7", "degree" : 2, "duration" : "8t"},
			{"time" : "8t * 8", "degree" : 1, "duration" : "8t"},
			{"time" : "8t * 9", "degree" : 2, "duration" : "8t"},
			{"time" : "8t * 10", "degree" : 3, "duration" : "8t"},
			{"time" : "8t * 11", "degree" : 4, "duration" : "8t"},
		],
		[
			{"time" : "8t * 0", "degree" : 0, "duration" : "8t"},
			{"time" : "8t * 0", "degree" : 2, "duration" : "8t"},

			{"time" : "8t * 1", "degree" : 1, "duration" : "8t"},
			{"time" : "8t * 1", "degree" : 3, "duration" : "8t"},

			{"time" : "8t * 2", "degree" : 2, "duration" : "8t"},
			{"time" : "8t * 2", "degree" : 4, "duration" : "8t"},

			{"time" : "8t * 3", "degree" : 3, "duration" : "8t"},
			{"time" : "8t * 3", "degree" : 5, "duration" : "8t"},

			{"time" : "8t * 4", "degree" : 2, "duration" : "8t"},
			{"time" : "8t * 4", "degree" : 4, "duration" : "8t"},

			{"time" : "8t * 5", "degree" : 1, "duration" : "8t"},
			{"time" : "8t * 5", "degree" : 5, "duration" : "8t"},

			{"time" : "8t * 6", "degree" : 0, "duration" : "8t"},
			{"time" : "8t * 6", "degree" : 6, "duration" : "8t"},

			{"time" : "8t * 7", "degree" : 1, "duration" : "8t"},
			{"time" : "8t * 7", "degree" : 5, "duration" : "8t"},

			{"time" : "8t * 8", "degree" : 2, "duration" : "8t"},
			{"time" : "8t * 8", "degree" : 6, "duration" : "8t"},

			{"time" : "8t * 9", "degree" : 3, "duration" : "8t"},
			{"time" : "8t * 9", "degree" : 7, "duration" : "8t"},

			{"time" : "8t * 10", "degree" : 6, "duration" : "8t"},
			{"time" : "8t * 10", "degree" : 2, "duration" : "8t"},

			{"time" : "8t * 11", "degree" : 5, "duration" : "8t"},
			{"time" : "8t * 11", "degree" : 1, "duration" : "8t"},

		],
	],
});