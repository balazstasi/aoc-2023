import _, { countBy, reduce } from 'lodash';
import * as util from '../../../util/util';
import * as test from '../../../util/test';
import chalk from 'chalk';
import { log, logSolution, trace } from '../../../util/log';
import { performance } from 'perf_hooks';

const YEAR = 2023;
const DAY = 2;

// solution path: /home/rothanak/Projects/advent-of-code-2023/years/2023/02/index.ts
// data path    : /home/rothanak/Projects/advent-of-code-2023/years/2023/02/data.txt
// problem url  : https://adventofcode.com/2023/day/2

const MAX_CUBES = {
	RED: 12,
	GREEN: 13,
	BLUE: 14,
};

interface Game {
	id: string;
	draws: Array<{
		redCount: number;
		blueCount: number;
		greenCount: number;
	}>;
}

function parseInput(input: string): Game[] {
	const games: Game[] = [];

	const gameStrings = input.trim().split('Game');
	gameStrings.shift(); // Remove empty string at the beginning

	gameStrings.forEach(gameString => {
		const [idPart, drawsPart] = gameString.split(':');
		const id = idPart.trim();
		const draws = drawsPart.split('; ').map(draw => {
			const trimmed = draw.trim();
			const red = trimmed.match(/(\d+) red/);
			const blue = trimmed.match(/(\d+) blue/);
			const green = trimmed.match(/(\d+) green/);
			return {
				redCount: red == null ? 0 : Number(red[1]),
				blueCount: blue == null ? 0 : Number(blue[1]),
				greenCount: green == null ? 0 : Number(green[1]),
			};
		});
		games.push({
			id,
			draws,
		});
	});

	return games;
}
function calculateValidGames(games: Game[]): number[] {
	const validGames: number[] = [];

	for (const game of games) {
		const validGame = game.draws.every(draw => {
			return (
				draw.redCount <= MAX_CUBES.RED && draw.blueCount <= MAX_CUBES.BLUE && draw.greenCount <= MAX_CUBES.GREEN
			);
		});

		if (validGame) {
			validGames.push(Number(game.id));
		}
	}

	return validGames;
}

async function p2023day2_part1(input: string, ...params: any[]) {
	return calculateValidGames(parseInput(input)).reduce((a, b) => a + b, 0);
}

async function p2023day2_part2(input: string, ...params: any[]) {
	const games = parseInput(input);
	let powerOfCubeSets = 0;
	for (const game of games) {
		const minCubesNeeded = {
			red: 0,
			blue: 0,
			green: 0,
		};

		game.draws.map(draw => {
			minCubesNeeded.red = Math.max(minCubesNeeded.red, draw.redCount);
			minCubesNeeded.blue = Math.max(minCubesNeeded.blue, draw.blueCount);
			minCubesNeeded.green = Math.max(minCubesNeeded.green, draw.greenCount);
		});

		powerOfCubeSets += Object.values(minCubesNeeded).reduce((a, b) => a * b, 1);
	}
	return powerOfCubeSets;
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2023day2_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2023day2_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day2_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2023day2_part2(input));
	const part2After = performance.now();

	logSolution(2, 2023, part1Solution, part2Solution);

	log(chalk.gray('--- Performance ---'));
	log(chalk.gray(`Part 1: ${util.formatTime(part1After - part1Before)}`));
	log(chalk.gray(`Part 2: ${util.formatTime(part2After - part2Before)}`));
	log();
}

run()
	.then(() => {
		process.exit();
	})
	.catch(error => {
		throw error;
	});
