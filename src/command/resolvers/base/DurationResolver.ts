import { Resolver } from '../Resolver';
import { Client } from '../../../client/Client';
import { Command } from '../../Command';
import { Message } from '../../../types/Message';
import { Lang } from '../../../localization/Lang';
import { Time } from '../../../util/Time';
import { ResourceProxy } from '../../../types/ResourceProxy';

export class DurationResolver extends Resolver
{
	public constructor(client: Client)
	{
		super(client, 'Duration');
	}

	public validate(value: any): boolean
	{
		return typeof value === 'number' && !isNaN(value) && isFinite(value);
	}

	public resolveRaw(value: string): number
	{
		return Time.parseShorthand(value);
	}

	public async resolve(message: Message, command: Command, name: string, value: string): Promise<number>
	{
		const lang: string = await Lang.getLangFromMessage(message);
		const res: ResourceProxy = Lang.createResourceProxy(lang);

		const dm: boolean = message.channel.type !== 'text';
		const prefix: string = !dm ? await message.guild.storage.settings.get('prefix') : '';
		const usage: string = Lang.getCommandInfo(command, lang).usage.replace(/<prefix>/g, prefix);

		const result: number = this.resolveRaw(value);
		if (!result)
			throw new Error(res.RESOLVE_ERR_RESOLVE_DURATION({ name, arg: value, usage }));

		return result;
	}
}
