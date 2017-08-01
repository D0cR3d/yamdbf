import { Client } from '../../client/Client';
import { Message } from '../../types/Message';
import { Command } from '../Command';
import { localizable } from '../CommandDecorators';
import { ResourceLoader } from '../../types/ResourceLoader';
import { BaseStrings as s } from '../../localization/BaseStrings';
import { inspect } from 'util';
import * as fs from 'fs';
const Discord = require('discord.js'); // tslint:disable-line
const Yamdbf = require('../../index'); // tslint:disable-line

let ts: any;
try { ts = require('typescript'); }
catch (err) {}

class CompilerError extends Error
{
	public name: string = 'CompilerError';
	public constructor(message: string)
	{
		super(message);
	}
}

export default class extends Command
{
	public constructor()
	{
		super({
			name: 'eval:ts',
			desc: 'Evaluate provided Typescript code',
			usage: '<prefix>eval:ts <...code>',
			info: 'Runs pretty slowly due to having to run diagnostics before compiling. If Typescript is not installed the provided code will be evaluated as Javascript and diagnostics/compilation will be skipped.',
			ownerOnly: true
		});
	}

	@localizable
	public async action(message: Message, [res]: [ResourceLoader]): Promise<any>
	{
		const client: Client = this.client; // tslint:disable-line
		const code: string = message.content.split(this.name).slice(1).join(this.name).trim();
		if (!code) return this.respond(message, res(s.CMD_EVAL_ERR_NOCODE));

		let start: Message = ts ? <Message> await this.respond(message, '*Compiling...*') : message;
		let evaled: string | Promise<string | object>;
		try
		{
			const compiled: string = this._compile(code);
			evaled = eval(compiled);
		}
		catch (err)
		{
			return start.edit(res(s.CMD_EVAL_ERROR, { code, error: this._clean(err) }));
		}

		if (evaled instanceof Promise)
		{
			evaled.then(result =>
			{
				if (typeof result !== 'string') result = inspect(result, { depth: 0 });
				start.edit(res(s.CMD_EVAL_RESULT, { code, result: this._clean(result) }));
			})
			.catch(err =>
			{
				start.edit(res(s.CMD_EVAL_ERROR, { code, error: this._clean(err) }));
			});
		}
		else
		{
			if (typeof evaled !== 'string')	evaled = inspect(evaled, { depth: 0 });
			return start.edit(res(s.CMD_EVAL_RESULT, { code, result: this._clean(evaled) }));
		}
	}

	private _compile(code: string): string
	{
		let message: string;
		if (ts)
		{
			const fileName: string = `${__dirname}/eval${Date.now()}.ts`;
			fs.writeFileSync(fileName, code);
			const program: any = ts.createProgram([fileName], { module: ts.ModuleKind.CommonJS });
			let diagnostics: any[] = ts.getPreEmitDiagnostics(program);
			if (diagnostics.length > 0)
			{
				diagnostics = diagnostics.map(d =>
				{
					const messageText: string = ts.flattenDiagnosticMessageText(d.messageText, '\n');
					const { line, character } = d.file.getLineAndCharacterOfPosition(d.start);
					return `\n(${line + 1},${character + 1}): ${messageText} (${d.code})`;
				})
				.filter(d => !d.includes('Cannot find name'));
				if (diagnostics.length > 0) message = diagnostics.join('');
			}
			fs.unlinkSync(fileName);
		}
		if (message) throw new CompilerError(message);
		return ts ? ts.transpileModule(code,
			{ compilerOptions: { module: ts.ModuleKind.CommonJS } })
				.outputText
				.replace('"use strict";\r\nexports.__esModule = true;\r\n', '')
			: code;
	}

	private _clean(text: string): string
	{
		return typeof text === 'string' ? text
			.replace(/`/g, `\`${String.fromCharCode(8203)}`)
			.replace(/@/g, `@${String.fromCharCode(8203)}`)
			.replace(/[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g, '[REDACTED]')
			.replace(/email: '[^']+'/g, `email: '[REDACTED]'`)
			: text;
	}
}
