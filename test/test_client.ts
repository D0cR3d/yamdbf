import {
	Client,
	Command,
	LogLevel,
	Logger,
	ListenerUtil,
	// Util,
	Lang,
	// Providers
} from '../bin/';
const config: any = require('./config.json');
const logger: Logger = Logger.instance();
const { once } = ListenerUtil;
import TestCommand from './commands/test_command';

class Test extends Client
{
	public constructor()
	{
		super({
			name: 'tests',
			token: config.token,
			owner: config.owner,
			// provider: Providers.SQLiteProvider('sqlite://./db.sqlite'),
			// commandsDir: './commands',
			localeDir: './locale',
			// defaultLang: 'al_bhed',
			pause: true,
			logLevel: LogLevel.DEBUG,
			// disableBase: Util.baseCommandNames
			// 	.filter(n => n !== 'help' && n !== 'eval')
		});

		Lang.setMetaValue('al_bhed', 'name', 'Al Bhed');
	}

	@once('pause')
	private async _onPause(): Promise<void>
	{
		logger.debug('Test', 'Paused...');
		await this.setDefaultSetting('prefix', '-');
		this.continue();
	}

	@once('continue')
	private _onContinue(): void
	{
		logger.debug('Test', 'Continuing');

		logger.warn('Test', 'Testing Logger#warn()');
		logger.debug('Test', 'Testing Logger#debug()');
		logger.error('Test', 'Testing Logger#error()');
	}

	@once('clientReady', 'foo', 1)
	private async _onClientReady(foo: string, bar: number): Promise<void>
	{
		logger.debug('Test', foo, bar.toString());
		await this.setDefaultSetting('foo', 'bar');
		this.commands.registerExternal(this, new TestCommand());
	}
}
const test: Test = new Test();
test.start();

process.on('unhandledRejection', (err: any) => console.error(err));
