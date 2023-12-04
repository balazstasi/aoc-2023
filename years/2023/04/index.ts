import _ from 'lodash';
import * as util from '../../../util/util';
import * as test from '../../../util/test';
import chalk from 'chalk';
import { log, logSolution, trace } from '../../../util/log';
import { performance } from 'perf_hooks';

const YEAR = 2023;
const DAY = 4;

// solution path: /home/rothanak/Projects/advent-of-code-2023/years/2023/04/index.ts
// data path    : /home/rothanak/Projects/advent-of-code-2023/years/2023/04/data.txt
// problem url  : https://adventofcode.com/2023/day/4

// -- PART 1 -- //

/**
 * Parses a string representing scratchcards and returns an array of numbers.
 *
 * @param {string} inputString - The string representation of scratchcards.
 * @return {number[][]} An array of arrays, where each inner array represents a scratchcard and contains numbers.
 */
function parseScratchcards(inputString: string): number[][] {
	const lines = inputString.trim().split('\n');
	const scratchcards = lines.map(line => {
		const parts = line.split('|');
		const cardNumbers = parts[0]
			.replace(/Card \d+:/, '')
			.trim()
			.split(/ +/)
			.map(Number)
			.filter(number => !isNaN(number));
		return cardNumbers;
	});

	return scratchcards;
}

/**
 * Parses the winning numbers from the input string.
 *
 * @param {string} inputString - The string containing the winning numbers.
 * @return {number[][]} An array of arrays representing the winning numbers.
 */
function parseWinningNumbers(inputString: string): number[][] {
	const lines = inputString.trim().split('\n');
	const winningNumbers = lines.map(line => {
		return line
			.split('|')[1]
			.replace(/Card \d+:/, '')
			.trim()
			.split(/ +/)
			.map(Number)
			.filter(number => !isNaN(number));
	});

	return winningNumbers;
}

/**
 * Calculates the number of matching numbers between each scratchcard and the corresponding winning numbers.
 *
 * @param {number[][]} scratchcards - An array of arrays representing the numbers on each scratchcard.
 * @param {number[][]} winningNumbers - An array of arrays representing the winning numbers.
 * @returns {number[]} An array of numbers representing the number of matching numbers per scratchcard.
 */
function calculateMatchingNumbers(scratchcards: number[][], winningNumbers: number[][]): number[] {
	const matchingNumbersPerCard: number[][] = [];

	scratchcards.forEach((card, index) => {
		const lineWinningNumbers = winningNumbers[index];
		const matchingNumbers = card.filter(n => lineWinningNumbers.includes(n));
		matchingNumbersPerCard.push(matchingNumbers);
	});

	return matchingNumbersPerCard.map(card => card.length);
}

async function p2023day4_part1(input: string, ...params: any[]) {
	const scratchCards = parseScratchcards(input);
	const winningNumbers = parseWinningNumbers(input);
	const matchCounts = calculateMatchingNumbers(scratchCards, winningNumbers);
	const totalPoints = matchCounts.reduce((tp, currentCount) => {
		if (currentCount === 0) return tp;
		return tp + Math.pow(2, currentCount - 1);
	}, 0);
	return totalPoints;
}

async function p2023day4_part2(input: string, ...params: any[]) {
	return 'Not implemented';
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2023day4_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2023day4_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day4_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2023day4_part2(input));
	const part2After = performance.now();

	logSolution(4, 2023, part1Solution, part2Solution);

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
