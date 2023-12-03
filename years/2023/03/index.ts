import _, { isNumber, reduce, sum } from 'lodash';
import * as util from '../../../util/util';
import * as test from '../../../util/test';
import chalk from 'chalk';
import { log, logSolution, trace } from '../../../util/log';
import { performance } from 'perf_hooks';

const YEAR = 2023;
const DAY = 3;

// solution path: /home/rothanak/Projects/advent-of-code-2023/years/2023/03/index.ts
// data path    : /home/rothanak/Projects/advent-of-code-2023/years/2023/03/data.txt
// problem url  : https://adventofcode.com/2023/day/3

function filterAdjacentNumbers(input: string): number[] {
	const rows = input.split('\n');
	const filteredNumbers: number[] = [];

	rows.forEach((row, rowIndex) => {
		let colIndex = 0;
		while (colIndex < row.length) {
			const char = row[colIndex];
			if (char >= '0' && char <= '9') {
				const numDigits = getNumberOfDigits(row, colIndex);
				const isAdjacentToSymbol = checkAdjacency(rows, rowIndex, colIndex, numDigits);

				// Add the number to the filtered array if adjacent to a symbol
				if (isAdjacentToSymbol) {
					filteredNumbers.push(Number(row.substring(colIndex, colIndex + numDigits)));
				}

				colIndex += numDigits;
			} else {
				colIndex++;
			}
		}
	});

	return filteredNumbers;
}

function checkAdjacency(rows: string[], rowIndex: number, colIndex: number, numDigits: number): boolean {
	const maxRowIndex = rows.length - 1;
	const maxColIndex = rows[0].length - 1;

	for (let i = Math.max(0, rowIndex - 1); i <= Math.min(maxRowIndex, rowIndex + 1); i++) {
		for (let j = Math.max(0, colIndex - 1); j <= Math.min(maxColIndex, colIndex + numDigits); j++) {
			const current = rows[i][j];
			if (
				current !== '.' &&
				!(i === rowIndex && j >= colIndex && j < colIndex + numDigits) &&
				!(typeof +current !== 'number') &&
				current !== undefined
			) {
				console.log('🚀 ~ file: index.ts:49 ~ checkAdjacency ~ current:', current);
				return true;
			}
		}
	}

	return false;
}

function getNumberOfDigits(row: string, colIndex: number): number {
	let numDigits = 1;
	for (let i = colIndex + 1; i < row.length; i++) {
		if (row[i] >= '0' && row[i] <= '9') {
			numDigits++;
		} else {
			break;
		}
	}
	return numDigits;
}

async function p2023day3_part1(input: string, ...params: any[]) {
	const filteredOutput = filterAdjacentNumbers(input);
	console.log(
		'🚀 ~ file: index.ts:75 ~ p2023day3_part1 ~ filteredOutput:',
		filteredOutput[filteredOutput.length - 1]
	);
	return sum(filteredOutput);
}

async function p2023day3_part2(input: string, ...params: any[]) {
	return 'Not implemented';
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2023day3_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2023day3_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day3_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2023day3_part2(input));
	const part2After = performance.now();

	logSolution(3, 2023, part1Solution, part2Solution);

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
