import { Message } from '../../../types/Message';
import { Util } from '../../../util/Util';
import { Command } from '../../Command';
import { Middleware } from '../../middleware/Middleware';
import { GuildStorage } from '../../../types/GuildStorage';
import { ResourceLoader } from '../../../types/ResourceLoader';
import * as CommandDecorators from '../../CommandDecorators';
const { using, localizable } = CommandDecorators;

export default class extends Command
{
	public constructor()
	{
		super({
			name: 'clearlimit',
			desc: 'Clear role restrictions from a command',
			usage: '<prefix>clearlimit <command>',
			callerPermissions: ['ADMINISTRATOR']
		});
	}

	@using(Middleware.expect({ '<command>': 'String' }))
	@localizable
	public async action(message: Message, [res, commandName]: [ResourceLoader, string]): Promise<Message | Message[]>
	{
		let command: Command = this.client.commands.find(c => Util.normalize(c.name) === Util.normalize(commandName));
		if (!command) return this.respond(message,
			res('CMD_CLEARLIMIT_UNKNOWN_COMMAND', { commandName }));

		const storage: GuildStorage = message.guild.storage;
		let limitedCommands: { [name: string]: string[] } = await storage.settings.get('limitedCommands') || {};
		delete limitedCommands[command.name];
		storage.settings.set('limitedCommands', limitedCommands);

		return this.respond(message,
			res('CMD_CLEARLIMIT_SUCCESS', { commandName: command.name }));
	}
}
